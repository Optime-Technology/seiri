-- İsteğe bağlı canlı test: Authentication > Users altında iki test hesabı olmalı.
-- SQL Editor'de yönetici olarak çalıştır; yalnızca örnek kayıt açar ve en sonda geri alır.
begin;
create temporary table seiri_test_context(a uuid,b uuid,ws_a uuid,ws_b uuid,note_a uuid) on commit drop;
do $$declare people uuid[];wa uuid;wb uuid;n uuid;begin
 select array_agg(id) into people from(select id from auth.users order by created_at nulls last,id limit 2) u;
 if coalesce(array_length(people,1),0)<2 then raise exception 'Önce Authentication > Users bölümünde iki test hesabı oluştur.';end if;
 select id into wa from public.workspaces where owner_id=people[1] and is_personal;
 select id into wb from public.workspaces where owner_id=people[2] and is_personal;
 if wa is null or wb is null then raise exception 'Kişisel alan otomasyonu çalışmamış; migration sonucunu kontrol et.';end if;
 insert into public.notes(workspace_id,created_by,title,content) values(wa,people[1],'SEIRI_RLS_TEST','Yalnızca A görmeli') returning id into n;
 insert into seiri_test_context values(people[1],people[2],wa,wb,n);
end;$$;
grant select on seiri_test_context to authenticated;
set local role authenticated;
select set_config('request.jwt.claim.sub',(select b::text from seiri_test_context),true);
do $$declare c record;blocked boolean:=false;begin
 select * into c from seiri_test_context;
 if exists(select 1 from public.notes where id=c.note_a) then raise exception 'HATA: B, A notunu okudu.';end if;
 update public.notes set content='Yetkisiz değişiklik' where id=c.note_a;
 if found then raise exception 'HATA: B, A notunu değiştirdi.';end if;
 begin insert into public.notes(workspace_id,title) values(c.ws_a,'Yetkisiz kayıt');exception when insufficient_privilege then blocked:=true;end;
 if not blocked then raise exception 'HATA: B, A alanına not ekledi.';end if;
 blocked:=false;
 begin insert into public.memberships(workspace_id,user_id,role) values(c.ws_a,c.b,'owner');exception when insufficient_privilege then blocked:=true;end;
 if not blocked then raise exception 'HATA: doğrudan üyelik eklenebildi.';end if;
 insert into public.notes(workspace_id,title) values(c.ws_b,'B kendi notu');
 if not exists(select 1 from public.notes where workspace_id=c.ws_b and title='B kendi notu') then raise exception 'HATA: B kendi alanını kullanamadı.';end if;
end;$$;
select set_config('request.jwt.claim.sub',(select a::text from seiri_test_context),true);
do $$begin if not exists(select 1 from public.notes where id=(select note_a from seiri_test_context)) then raise exception 'HATA: A kendi notunu okuyamadı.';end if;end;$$;
reset role;
rollback;
select 'RLS testi geçti. Örnek kayıtlar ROLLBACK ile kaldırıldı.' as result;
