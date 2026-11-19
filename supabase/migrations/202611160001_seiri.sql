-- 01 · Seiri ilk kurulum. Tek parça olarak SQL Editor'de bir kez çalıştırılır.
-- Normal notlar sunucuda okunabilir içeriktir; RLS, uçtan uca şifreleme değildir.
begin;
create schema seiri_private;
revoke all on schema seiri_private from public, anon;
grant usage on schema seiri_private to authenticated;

create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null default '' check (char_length(display_name)<=120),
 avatar_url text check (avatar_url is null or char_length(avatar_url)<=2000),
 created_at timestamptz not null default now()
);
create table public.workspaces (
 id uuid primary key default gen_random_uuid(),
 name text not null check (char_length(btrim(name)) between 1 and 120),
 is_personal boolean not null default false,
 owner_id uuid not null references auth.users(id) on delete restrict,
 sync_revision bigint not null default 0,
 created_at timestamptz not null default now()
);
create unique index one_personal_workspace on public.workspaces(owner_id) where is_personal;
create index workspace_owner_idx on public.workspaces(owner_id);
create table public.memberships (
 workspace_id uuid not null references public.workspaces(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 role text not null check (role in ('owner','admin','member')),
 joined_at timestamptz not null default now(),
 primary key(workspace_id,user_id)
);
create unique index one_owner_membership on public.memberships(workspace_id) where role='owner';
create index membership_user_idx on public.memberships(user_id,workspace_id);

-- 02 · Üyelik yardımcıları RLS'yi yeniden çağırmaz; içerik döndürmez.
create function seiri_private.is_member(ws_id uuid) returns boolean
language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and exists(select 1 from public.memberships m where m.workspace_id=ws_id and m.user_id=auth.uid());
$$;
create function seiri_private.has_role(ws_id uuid,roles text[]) returns boolean
language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and exists(select 1 from public.memberships m where m.workspace_id=ws_id and m.user_id=auth.uid() and m.role=any(roles));
$$;
create function seiri_private.can_see_profile(person_id uuid) returns boolean
language sql stable security definer set search_path='' as $$
 select person_id=auth.uid() or exists(select 1 from public.memberships a join public.memberships b using(workspace_id) where a.user_id=auth.uid() and b.user_id=person_id);
$$;

create table public.categories (
 id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade,
 created_by uuid default auth.uid() references auth.users(id) on delete set null,
 local_id text check (char_length(local_id)<=100), name text not null check(char_length(btrim(name)) between 1 and 120),
 color text not null default '#806197' check(color ~ '^#[0-9a-fA-F]{6}$'),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), deleted_at timestamptz,
 revision bigint not null default 1, sync_revision bigint not null default 0, unique(workspace_id,local_id)
);
create table public.courses (
 id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade,
 created_by uuid default auth.uid() references auth.users(id) on delete set null,
 local_id text check(char_length(local_id)<=100), name text not null check(char_length(btrim(name)) between 1 and 120),
 term text not null default '' check(char_length(term)<=80), archived boolean not null default false,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), deleted_at timestamptz,
 revision bigint not null default 1, sync_revision bigint not null default 0, unique(workspace_id,local_id)
);
create table public.notes (
 id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade,
 created_by uuid default auth.uid() references auth.users(id) on delete set null,
 local_id text check(char_length(local_id)<=100), title text not null check(char_length(btrim(title)) between 1 and 160),
 content text not null default '' check(octet_length(content)<=262144),
 course_id uuid references public.courses(id) on delete set null,
 category_id uuid references public.categories(id) on delete set null,
 metadata jsonb not null default '{}' check(jsonb_typeof(metadata)='object' and octet_length(metadata::text)<=32768),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), deleted_at timestamptz,
 revision bigint not null default 1, sync_revision bigint not null default 0, unique(workspace_id,local_id)
);
create table public.agenda_items (
 id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade,
 created_by uuid default auth.uid() references auth.users(id) on delete set null,
 assigned_to uuid references auth.users(id) on delete set null,
 local_id text check(char_length(local_id)<=100), kind text not null default 'event' check(kind in ('event','task','review')),
 title text not null check(char_length(btrim(title)) between 1 and 160),
 description text not null default '' check(octet_length(description)<=262144),
 due_at timestamptz, remind_at timestamptz,
 status text not null default 'todo' check(status in ('todo','doing','done')),
 course_id uuid references public.courses(id) on delete set null,
 note_id uuid references public.notes(id) on delete set null,
 metadata jsonb not null default '{}' check(jsonb_typeof(metadata)='object' and octet_length(metadata::text)<=32768),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), deleted_at timestamptz,
 revision bigint not null default 1, sync_revision bigint not null default 0, unique(workspace_id,local_id)
);
create index agenda_due_idx on public.agenda_items(workspace_id,due_at) where deleted_at is null;
create index agenda_assignee_idx on public.agenda_items(assigned_to) where assigned_to is not null;
create table public.checklists (
 id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade,
 created_by uuid default auth.uid() references auth.users(id) on delete set null,
 local_id text check(char_length(local_id)<=100), title text not null check(char_length(btrim(title)) between 1 and 120),
 items jsonb not null default '[]' check(jsonb_typeof(items)='array' and jsonb_array_length(items)<=200 and octet_length(items::text)<=131072),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), deleted_at timestamptz,
 revision bigint not null default 1, sync_revision bigint not null default 0, unique(workspace_id,local_id)
);
create table public.focus_sessions (
 id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade,
 created_by uuid default auth.uid() references auth.users(id) on delete set null,
 local_id text check(char_length(local_id)<=100), label text not null default '' check(char_length(label)<=160),
 mode text not null check(mode in ('pomodoro','break','countdown','stopwatch')),
 outcome text not null check(outcome in ('completed','stopped')),
 started_at timestamptz not null, ended_at timestamptz not null,
 seconds integer not null check(seconds between 0 and 604800),
 course_id uuid references public.courses(id) on delete set null,
 note_id uuid references public.notes(id) on delete set null,
 agenda_item_id uuid references public.agenda_items(id) on delete set null,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), deleted_at timestamptz,
 revision bigint not null default 1, sync_revision bigint not null default 0,
 check(ended_at>=started_at), unique(workspace_id,local_id)
);
create table public.note_templates (
 id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade,
 created_by uuid default auth.uid() references auth.users(id) on delete set null,
 local_id text check(char_length(local_id)<=100), name text not null check(char_length(btrim(name)) between 1 and 80),
 content text not null default '' check(octet_length(content)<=100000),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), deleted_at timestamptz,
 revision bigint not null default 1, sync_revision bigint not null default 0, unique(workspace_id,local_id)
);
create table public.preferences (
 user_id uuid primary key references auth.users(id) on delete cascade,
 settings jsonb not null default '{}' check(jsonb_typeof(settings)='object' and octet_length(settings::text)<=65536),
 updated_at timestamptz not null default now(), revision bigint not null default 1
);
create table public.invites (
 id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade,
 code text not null unique default replace(gen_random_uuid()::text,'-','')||replace(gen_random_uuid()::text,'-',''),
 role text not null default 'member' check(role in ('admin','member')),
 created_by uuid references auth.users(id) on delete set null,
 expires_at timestamptz not null, max_uses integer not null check(max_uses between 1 and 100),
 use_count integer not null default 0 check(use_count>=0 and use_count<=max_uses), revoked boolean not null default false
);
create index invites_workspace_idx on public.invites(workspace_id);
create table public.file_assets (
 id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade,
 created_by uuid default auth.uid() references auth.users(id) on delete set null,
 object_path text not null unique, name text not null check(char_length(name) between 1 and 499),
 mime_type text not null check(mime_type in ('image/jpeg','image/png','application/pdf')),
 byte_size integer not null check(byte_size between 1 and 10485760),
 sha256 text not null check(sha256 ~ '^[0-9a-f]{64}$'),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), deleted_at timestamptz,
 revision bigint not null default 1, sync_revision bigint not null default 0,
 check(object_path=workspace_id::text||'/'||id::text)
);

-- 03 · Yeni kullanıcı ve mevcut kullanıcılar için kişisel çalışma alanı.
create function seiri_private.handle_new_user() returns trigger
language plpgsql security definer set search_path='' as $$
declare ws uuid;
begin
 insert into public.profiles(id,display_name) values(new.id,left(coalesce(new.raw_user_meta_data->>'full_name',new.raw_user_meta_data->>'name','Kullanıcı'),120));
 insert into public.workspaces(name,is_personal,owner_id) values('Kişisel',true,new.id) returning id into ws;
 insert into public.memberships(workspace_id,user_id,role) values(ws,new.id,'owner');
 insert into public.preferences(user_id) values(new.id);
 return new;
end;$$;
create trigger seiri_new_user after insert on auth.users for each row execute function seiri_private.handle_new_user();
insert into public.profiles(id,display_name) select id,left(coalesce(raw_user_meta_data->>'full_name','Kullanıcı'),120) from auth.users;
insert into public.workspaces(name,is_personal,owner_id) select 'Kişisel',true,id from auth.users;
insert into public.memberships(workspace_id,user_id,role) select id,owner_id,'owner' from public.workspaces where is_personal;
insert into public.preferences(user_id) select id from auth.users;

-- 04 · Sunucu zamanı/revizyonu ve çapraz çalışma alanı referans kontrolü.
create function seiri_private.touch_record() returns trigger
language plpgsql security definer set search_path='' as $$
declare doc jsonb; field text; target_table text; ref uuid; valid_ref boolean;
begin
 if tg_op='UPDATE' then
  if new.id<>old.id or new.workspace_id<>old.workspace_id or new.created_at<>old.created_at then raise exception 'Kimlik ve çalışma alanı değiştirilemez.'; end if;
  if new.created_by is distinct from old.created_by and not(new.created_by is null and not exists(select 1 from auth.users where id=old.created_by)) then raise exception 'Kaydın oluşturucusu değiştirilemez.'; end if;
  if tg_table_name='file_assets' then
   if new.object_path is distinct from old.object_path or new.byte_size is distinct from old.byte_size or new.sha256 is distinct from old.sha256 or new.mime_type is distinct from old.mime_type then raise exception 'Dosyanın içeriği yerinde değiştirilemez; yeni dosya oluştur.'; end if;
  end if;
  new.revision:=old.revision+1;
 else
  new.created_at:=clock_timestamp(); new.revision:=1;
 end if;
 new.updated_at:=clock_timestamp();
 doc:=to_jsonb(new);
 foreach field in array array['course_id','category_id','note_id','agenda_item_id'] loop
  if doc->>field is not null then
   ref:=(doc->>field)::uuid;
   target_table:=case field when 'course_id' then 'courses' when 'category_id' then 'categories' when 'note_id' then 'notes' else 'agenda_items' end;
   execute format('select exists(select 1 from public.%I where id=$1 and workspace_id=$2)',target_table) into valid_ref using ref,new.workspace_id;
   if not valid_ref then raise exception 'Bağlı kayıt aynı çalışma alanında olmalı.'; end if;
  end if;
 end loop;
 if doc->>'assigned_to' is not null and not exists(select 1 from public.memberships where workspace_id=new.workspace_id and user_id=(doc->>'assigned_to')::uuid) then raise exception 'Atanan kişi çalışma alanının üyesi olmalı.'; end if;
 -- Aynı alanın sayacı satır kilidiyle artar; değişiklik sırası işlem bitişini atlamaz.
 update public.workspaces set sync_revision=sync_revision+1 where id=new.workspace_id returning sync_revision into new.sync_revision;
 return new;
end;$$;
create function seiri_private.touch_preferences() returns trigger language plpgsql set search_path='' as $$begin new.updated_at:=clock_timestamp();new.revision:=old.revision+1;return new;end;$$;
create trigger preferences_updated before update on public.preferences for each row execute function seiri_private.touch_preferences();

do $$declare t text;begin
 foreach t in array array['categories','courses','notes','agenda_items','checklists','focus_sessions','note_templates','file_assets'] loop
  execute format('create trigger touch_record before insert or update on public.%I for each row execute function seiri_private.touch_record()',t);
  execute format('create index %I on public.%I(workspace_id,sync_revision)',t||'_sync_idx',t);
  execute format('create index %I on public.%I(workspace_id,updated_at) where deleted_at is null',t||'_active_idx',t);
  execute format('create index %I on public.%I(created_by)',t||'_creator_idx',t);
 end loop;
end;$$;

-- 05 · Workspace/üyelik işlemleri doğrudan tablo yazımı yerine kontrollü RPC.
create function public.seiri_create_workspace(ws_name text) returns uuid
language plpgsql security definer set search_path='' as $$declare ws uuid;begin
 if auth.uid() is null then raise exception 'Giriş gerekli.'; end if;
 if char_length(btrim(ws_name)) not between 1 and 120 or ws_name is null then raise exception 'Geçerli bir ekip adı yaz.'; end if;
 insert into public.workspaces(name,owner_id) values(btrim(ws_name),auth.uid()) returning id into ws;
 insert into public.memberships(workspace_id,user_id,role) values(ws,auth.uid(),'owner'); return ws;
end;$$;
create function public.seiri_rename_workspace(ws_id uuid,ws_name text) returns void
language plpgsql security definer set search_path='' as $$begin
 if not seiri_private.has_role(ws_id,array['owner','admin']) then raise exception 'Yetki yok.';end if;
 update public.workspaces set name=btrim(ws_name) where id=ws_id;
end;$$;
create function public.seiri_create_invite(ws_id uuid,member_role text default 'member',ttl_hours integer default 168,uses integer default 1) returns public.invites
language plpgsql security definer set search_path='' as $$declare result public.invites;begin
 if not seiri_private.has_role(ws_id,array['owner','admin']) then raise exception 'Yetki yok.'; end if;
 if member_role='admin' and not seiri_private.has_role(ws_id,array['owner']) then raise exception 'Yönetici davetini yalnızca kurucu oluşturabilir.';end if;
 if exists(select 1 from public.workspaces where id=ws_id and is_personal) then raise exception 'Kişisel alana üye davet edilemez.';end if;
 if member_role not in ('admin','member') or member_role is null or ttl_hours is null or ttl_hours not between 1 and 168 or uses is null or uses not between 1 and 100 then raise exception 'Davet ayarları geçersiz.'; end if;
 insert into public.invites(workspace_id,role,created_by,expires_at,max_uses) values(ws_id,member_role,auth.uid(),now()+make_interval(hours=>ttl_hours),uses) returning * into result; return result;
end;$$;
create function public.seiri_revoke_invite(invite_id uuid) returns void
language plpgsql security definer set search_path='' as $$declare ws uuid;begin
 select workspace_id into ws from public.invites where id=invite_id;
 if not seiri_private.has_role(ws,array['owner','admin']) then raise exception 'Yetki yok.';end if;
 update public.invites set revoked=true where id=invite_id;
end;$$;
create function public.seiri_accept_invite(invite_code text) returns uuid
language plpgsql security definer set search_path='' as $$declare inv public.invites;begin
 if auth.uid() is null then raise exception 'Giriş gerekli.';end if;
 select * into inv from public.invites where code=invite_code for update;
 if not found or inv.revoked or inv.expires_at<=now() then raise exception 'Davet geçersiz, iptal edilmiş veya süresi dolmuş.';end if;
 if seiri_private.is_member(inv.workspace_id) then return inv.workspace_id;end if;
 if inv.use_count>=inv.max_uses then raise exception 'Davetin kullanım sınırı doldu.';end if;
 insert into public.memberships(workspace_id,user_id,role) values(inv.workspace_id,auth.uid(),inv.role);
 update public.invites set use_count=use_count+1 where id=inv.id;return inv.workspace_id;
end;$$;
create function public.seiri_set_member_role(ws_id uuid,person_id uuid,member_role text) returns void
language plpgsql security definer set search_path='' as $$declare owner uuid;begin
 select owner_id into owner from public.workspaces where id=ws_id for update;
 if owner is distinct from auth.uid() or auth.uid() is null then raise exception 'Yalnızca kurucu rol atayabilir.';end if;
 if person_id=owner or member_role is null or member_role not in ('admin','member') then raise exception 'Kurucu değişikliği için devir kullan.';end if;
 update public.memberships set role=member_role where workspace_id=ws_id and user_id=person_id;
 if not found then raise exception 'Üye bulunamadı.';end if;
end;$$;
create function public.seiri_remove_member(ws_id uuid,person_id uuid) returns void
language plpgsql security definer set search_path='' as $$declare owner uuid;begin
 select owner_id into owner from public.workspaces where id=ws_id for update;
 if owner is distinct from auth.uid() or auth.uid() is null or person_id=owner then raise exception 'Yalnızca kurucu başka bir üyeyi çıkarabilir.';end if;
 update public.agenda_items set assigned_to=null where workspace_id=ws_id and assigned_to=person_id;
 delete from public.memberships where workspace_id=ws_id and user_id=person_id;
end;$$;
create function public.seiri_transfer_workspace(ws_id uuid,person_id uuid) returns void
language plpgsql security definer set search_path='' as $$declare ws public.workspaces;begin
 select * into ws from public.workspaces where id=ws_id for update;
 if ws.owner_id is distinct from auth.uid() or auth.uid() is null or ws.is_personal then raise exception 'Bu alan devredilemez veya yetkin yok.';end if;
 if not exists(select 1 from public.memberships where workspace_id=ws_id and user_id=person_id) then raise exception 'Yeni kurucu önce ekibe katılmalı.';end if;
 update public.memberships set role='admin' where workspace_id=ws_id and user_id=ws.owner_id;
 update public.memberships set role='owner' where workspace_id=ws_id and user_id=person_id;
 update public.workspaces set owner_id=person_id where id=ws_id;
end;$$;
create function public.seiri_delete_workspace(ws_id uuid) returns void
language plpgsql security definer set search_path='' as $$declare ws public.workspaces;begin
 select * into ws from public.workspaces where id=ws_id for update;
 if ws.owner_id is distinct from auth.uid() or auth.uid() is null or ws.is_personal then raise exception 'Kişisel alan silinemez; ekip için kurucu yetkisi gerekir.';end if;
 if exists(select 1 from storage.objects where bucket_id='seiri-files' and split_part(name,'/',1)=ws_id::text) then raise exception 'Önce ekibin bulut dosyalarını kaldır.';end if;
 delete from public.workspaces where id=ws_id;
end;$$;

create function public.seiri_purge_file(file_id uuid) returns void
language plpgsql security definer set search_path='' as $$declare asset public.file_assets;begin
 select * into asset from public.file_assets where id=file_id for update;
 if asset.deleted_at is null or not seiri_private.is_member(asset.workspace_id) or not(asset.created_by=auth.uid() or seiri_private.has_role(asset.workspace_id,array['owner','admin'])) then raise exception 'Dosya silme yetkisi yok.';end if;
 if exists(select 1 from storage.objects where bucket_id='seiri-files' and name=asset.object_path) then raise exception 'Önce Storage dosyasını kaldır.';end if;
 delete from public.file_assets where id=file_id;
end;$$;

-- 06 · Dosya rezervasyonu, boyut sınırı ve özel Storage alanı.
create function public.seiri_register_file(ws_id uuid,file_id uuid,file_name text,mime text,bytes integer,digest text) returns public.file_assets
language plpgsql security definer set search_path='' as $$declare result public.file_assets;begin
 if not seiri_private.is_member(ws_id) then raise exception 'Yetki yok.';end if;
 -- Aynı rezervasyon yeniden gönderilirse ikinci kayıt oluşturulmaz.
 perform pg_advisory_xact_lock(763041);
 select * into result from public.file_assets where id=file_id;
 if found then
  if result.workspace_id=ws_id and result.created_by=auth.uid() and result.sha256=digest and result.byte_size=bytes and result.deleted_at is null then return result;end if;
  raise exception 'Dosya kimliği daha önce kullanılmış.';
 end if;
 if bytes is null or bytes not between 1 and 10485760 then raise exception 'Dosya en fazla 10 MB olabilir.';end if;
 if (select coalesce(sum(byte_size),0) from public.file_assets where created_by=auth.uid())+bytes>41943040 then raise exception 'Bu beta için kullanıcının 40 MB dosya kotası doldu.';end if;
 if (select coalesce(sum(byte_size),0) from public.file_assets where workspace_id=ws_id)+bytes>41943040 then raise exception 'Bu beta için çalışma alanının 40 MB dosya kotası doldu.';end if;
 if (select coalesce(sum(byte_size),0) from public.file_assets )+bytes>943718400 then raise exception 'Projenin dosya kotası doldu. Dosya cihazda kalmalı.';end if;
 insert into public.file_assets(id,workspace_id,created_by,object_path,name,mime_type,byte_size,sha256) values(file_id,ws_id,auth.uid(),ws_id::text||'/'||file_id::text,file_name,mime,bytes,digest) returning * into result;
 return result;
end;$$;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('seiri-files','seiri-files',false,10485760,array['image/jpeg','image/png','application/pdf']);

-- 07 · Açık GRANT'ler ve RLS. İstemci hiçbir üyelik veya davet satırını doğrudan yazamaz.
do $$declare t text;begin
 foreach t in array array['profiles','workspaces','memberships','categories','courses','notes','agenda_items','checklists','focus_sessions','note_templates','preferences','invites','file_assets'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('revoke all on public.%I from public,anon,authenticated',t);
  execute format('grant select on public.%I to authenticated',t);
 end loop;
 foreach t in array array['categories','courses','notes','agenda_items','checklists','focus_sessions','note_templates'] loop
  execute format('grant insert,update on public.%I to authenticated',t);
  -- Üyeler alan içeriğini okur; tombstone satırları silme eşitlemesi için görünür kalır.
  execute format('create policy member_read on public.%I for select to authenticated using(seiri_private.is_member(workspace_id))',t);
  -- Kayıt ekleyen gerçek kullanıcı olmalı; başka kullanıcı adına kayıt açılamaz.
  execute format('create policy member_insert on public.%I for insert to authenticated with check(seiri_private.is_member(workspace_id) and created_by=auth.uid())',t);
  -- Üye kendi kaydını; admin ve owner alanın tüm kayıtlarını düzenler/soft delete yapar.
  execute format('create policy author_or_admin_update on public.%I for update to authenticated using(seiri_private.is_member(workspace_id) and (created_by=auth.uid() or seiri_private.has_role(workspace_id,array[''owner'',''admin'']))) with check(seiri_private.is_member(workspace_id) and (created_by=auth.uid() or seiri_private.has_role(workspace_id,array[''owner'',''admin''])))',t);
 end loop;
end;$$;
grant update(display_name,avatar_url) on public.profiles to authenticated;
-- Profil, kendisine veya aynı alanı paylaşan kişilere görünür.
create policy profile_read on public.profiles for select to authenticated using(seiri_private.can_see_profile(id));
-- Kullanıcı yalnızca kendi profilinin izinli sütunlarını değiştirir.
create policy profile_update on public.profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid());
-- Workspace ve üyelik satırları yalnızca alan üyelerine görünür; yazma RPC ile yapılır.
create policy workspace_read on public.workspaces for select to authenticated using(seiri_private.is_member(id));
create policy membership_read on public.memberships for select to authenticated using(seiri_private.is_member(workspace_id));
-- Davet kodları yalnızca owner/admin tarafından listelenebilir.
create policy invite_read on public.invites for select to authenticated using(seiri_private.has_role(workspace_id,array['owner','admin']));
grant update(settings) on public.preferences to authenticated;
-- Kişisel tercihler ekip arkadaşlarına açılmaz.
create policy preferences_read on public.preferences for select to authenticated using(user_id=auth.uid());
create policy preferences_update on public.preferences for update to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
grant update(deleted_at) on public.file_assets to authenticated;
-- Dosya metadata'sını yalnızca workspace üyeleri okuyabilir.
create policy asset_read on public.file_assets for select to authenticated using(seiri_private.is_member(workspace_id));
-- Yükleyen veya admin/owner dosyayı soft delete/geri yükleme işaretleyebilir.
create policy asset_update on public.file_assets for update to authenticated using(seiri_private.is_member(workspace_id) and (created_by=auth.uid() or seiri_private.has_role(workspace_id,array['owner','admin']))) with check(seiri_private.is_member(workspace_id) and (created_by=auth.uid() or seiri_private.has_role(workspace_id,array['owner','admin'])));

-- Özel bucket: metaveri ve üyelik olmadan dosya okunmaz/yüklenmez/silinmez.
create policy seiri_file_read on storage.objects for select to authenticated using(bucket_id='seiri-files' and exists(select 1 from public.file_assets a where a.object_path=storage.objects.name and seiri_private.is_member(a.workspace_id) and (a.deleted_at is null or a.created_by=auth.uid() or seiri_private.has_role(a.workspace_id,array['owner','admin']))));
create policy seiri_file_insert on storage.objects for insert to authenticated with check(bucket_id='seiri-files' and exists(select 1 from public.file_assets a where a.object_path=storage.objects.name and a.created_by=auth.uid() and a.deleted_at is null and seiri_private.is_member(a.workspace_id)));
-- Silme için önce tombstone gerekir. Yeni içerik aynı dosyanın üstüne yazılmaz.
create policy seiri_file_delete on storage.objects for delete to authenticated using(bucket_id='seiri-files' and exists(select 1 from public.file_assets a where a.object_path=storage.objects.name and a.deleted_at is not null and seiri_private.is_member(a.workspace_id) and (a.created_by=auth.uid() or seiri_private.has_role(a.workspace_id,array['owner','admin']))));

-- Özel yardımcıların tamamı varsayılan PUBLIC EXECUTE yetkisinden arındırılır.
revoke all on all functions in schema seiri_private from public,anon,authenticated;
grant execute on function seiri_private.is_member(uuid),seiri_private.has_role(uuid,text[]),seiri_private.can_see_profile(uuid) to authenticated;
do $$declare f record;begin
 for f in select oid::regprocedure as signature from pg_proc where pronamespace='public'::regnamespace and proname in ('seiri_create_workspace','seiri_rename_workspace','seiri_create_invite','seiri_revoke_invite','seiri_accept_invite','seiri_set_member_role','seiri_remove_member','seiri_transfer_workspace','seiri_delete_workspace','seiri_register_file','seiri_purge_file') loop
  execute format('revoke all on function %s from public,anon,authenticated',f.signature);
  execute format('grant execute on function %s to authenticated',f.signature);
 end loop;
end;$$;

create index notes_course_idx on public.notes(course_id);
create index notes_category_idx on public.notes(category_id);
create index agenda_course_idx on public.agenda_items(course_id);
create index agenda_note_idx on public.agenda_items(note_id);
create index sessions_course_idx on public.focus_sessions(course_id);
create index sessions_note_idx on public.focus_sessions(note_id);
create index sessions_agenda_idx on public.focus_sessions(agenda_item_id);

-- 08 · İçerik/kimlik taşımayan özel Realtime uyarısı.
-- Postgres Changes DELETE akışına tablo eklenmez: DELETE olaylarında RLS filtresi yoktur.
create function seiri_private.can_listen(channel_topic text) returns boolean
language plpgsql stable security definer set search_path='' as $$begin
 if channel_topic is null or channel_topic !~ '^seiri:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then return false;end if;
 return seiri_private.is_member(substring(channel_topic from 7)::uuid);
end;$$;
create function seiri_private.wake_sync() returns trigger
language plpgsql security definer set search_path='' as $$declare ws uuid;begin
 if tg_op='DELETE' then ws:=old.workspace_id;else ws:=new.workspace_id;end if;
 perform realtime.send(jsonb_build_object('changed',true),'sync','seiri:'||ws::text,true);
 return null;
exception when others then
 -- Realtime kesintisi asıl not kaydını iptal etmez; istemci ayrıca artımlı pull yapar.
 raise log 'Seiri Realtime uyarısı gönderilemedi: %',sqlstate;
 return null;
end;$$;
revoke all on function seiri_private.can_listen(text),seiri_private.wake_sync() from public,anon,authenticated;
grant execute on function seiri_private.can_listen(text) to authenticated;
-- Supabase bu tabloda RLS'yi zaten açar. Tabloyu ALTER etmeyiz; yalnızca policy ekleriz.
-- Yalnızca kendi alanının private broadcast kanalına katılan kullanıcı okuyabilir.
create policy seiri_sync_receive on realtime.messages for select to authenticated
using(extension='broadcast' and private=true and topic=(select realtime.topic()) and seiri_private.can_listen((select realtime.topic())));
do $$declare t text;begin
 foreach t in array array['notes','agenda_items','courses','categories','checklists','focus_sessions','note_templates','file_assets','memberships'] loop
  execute format('create trigger seiri_notify after insert or update or delete on public.%I for each row execute function seiri_private.wake_sync()',t);
 end loop;
end;$$;
comment on column public.workspaces.sync_revision is 'Çalışma alanında sıralı değişiklik sayacı; istemci bu alana yazamaz.';
comment on column public.notes.revision is 'İstemci UPDATE isteğinde beklenen revision filtresi kullanır; sıfır satır çakışmadır.';
comment on column public.notes.deleted_at is 'Soft delete tombstone; senkron istemcisi bu satırı sorgudan çıkarmamalıdır.';
commit;
