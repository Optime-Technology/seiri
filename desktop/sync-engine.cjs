'use strict';
/** Kalıcı kuyruk: notlarda son düzenleme, sürüm geçmişi ve silme önceliği. */
const crypto=require('node:crypto');
const {atomicJSON,readJSON}=require('./account-spaces.cjs');
const M=require('./sync-model.cjs'),R=require('./sync-resolution.cjs');
const split=key=>[key.slice(0,key.indexOf(':')),key.slice(key.indexOf(':')+1)];
const matches=(desired,base)=>desired==null&&(!base||base.deleted_at)?true:R.equal(desired,base);
function createEngine({file,userId,workspaceId,adapter,valid=()=>true,now=()=>Date.now()}){
 const empty=()=>({v:1,userId,workspaceId,seen:{},seenRev:{},base:{},queue:{},cursors:{},conflicts:0,lastAt:0});
 let state=readJSON(file,empty()),chain=Promise.resolve(),stopped=false;
 if(state.v!==1||state.userId!==userId||state.workspaceId!==workspaceId)throw Error('Eşitleme alanı hesapla uyuşmuyor.');
 // 1.16/1.17 günlükleri veri silmeden açılır. Eski kuyruk zamanları uydurulmaz.
 state.deviceId ||=crypto.randomUUID();state.historyQueue ||= {};state.seenSync ||= {};state.resolved ||=0;state.lastClock ||= {at:0,seq:0};
 function check(){if(stopped||!valid())throw Error('Hesap alanı değişti; işlem durduruldu.');}
 function save(next){check();if(Buffer.byteLength(JSON.stringify(next))>32*1024*1024)throw Error('Yerel eşitleme günlüğü 32 MB sınırına ulaştı. JSON yedeği al.');atomicJSON(file,next);state=next;}
 const serial=fn=>{const next=chain.catch(()=>{}).then(()=>{check();return fn();});chain=next;return next;};
 function archive(next,id,p){const v=R.version(id,p,now());if(v&&!next.base['notes:'+v.id])next.historyQueue[v.id]=v.payload;}
 function capture(rows,blocked=[],recovered=false){
  const next=structuredClone(state),excluded=new Set(blocked);
  for(const key of new Set([...Object.keys(next.seen),...Object.keys(rows)])){
   if(excluded.has(key))continue;const value=rows[key]??null,base=next.base[key];const purge=key.startsWith('notes:')&&value===null&&!!next.seen[key]?.deleted_at&&!!base?.payload.deleted_at&&!base.payload.metadata?.erased;
   if(R.equal(value,next.seen[key]??null)){if(matches(value,base?.payload)&&!next.queue[key]){next.seenRev[key]=base?.revision||0;next.seenSync[key]=base?.payload.metadata?.seiriSync||null;}continue;}
   if(!purge&&matches(value,base?.payload)){delete next.queue[key];next.seenRev[key]=base?.revision||0;next.seenSync[key]=base?.payload.metadata?.seiriSync||null;}
   else{const old=next.queue[key],opId=crypto.randomUUID();const observed=base&&base.revision===next.seenRev[key]?R.clock(base.payload):null;
    const clock=R.nextClock(value,next.lastClock,next.deviceId,opId,now(),observed);next.lastClock=clock;
    next.queue[key]={payload:value,previous:old?.previous??next.seen[key]??null,priorSync:old?.priorSync??next.seenSync[key]??null,baseRevision:old?.baseRevision??(recovered?-1:next.seenRev[key]??0),opId,clock,purge,recovered:recovered||old?.recovered===true};
   }
   if(value===null)delete next.seen[key];else next.seen[key]=structuredClone(value);
  }
  // Hassas yapılan ana kayıtla birlikte buluttaki eski sürümler de içeriksizleştirilir.
  for(const key of excluded){
   const base=next.base[key];if(base&&!base.payload.metadata?.erased)next.queue[key]={payload:null,baseRevision:base.revision,opId:crypto.randomUUID(),erase:true};else delete next.queue[key];delete next.seen[key];
   const [table,id]=split(key);if(table==='notes'){
    for(const [k,r]of Object.entries(next.base))if(R.isVersion(r.payload)&&r.payload.metadata.noteId===id&&!r.payload.metadata.erased)next.queue[k]={payload:null,baseRevision:r.revision,opId:crypto.randomUUID(),erase:true};
    for(const [k,p]of Object.entries(next.historyQueue))if(p.metadata.noteId===id)delete next.historyQueue[k];
   }
  }
  save(next);return status();
 }
 function putRow(next,table,row){if(!row?.local_id)throw Error('Yerel kimliği olmayan bulut kaydı bulundu.');const key=M.rowKey(table,row.local_id),p=M.normalizePayload(table,row),old=next.base[key];
  if(table==='notes'&&old&&!R.equal(old.payload,p)&&!p.metadata?.erased)archive(next,row.local_id,old.payload);
  next.base[key]={revision:Number(row.revision),createdAt:row.created_at||null,updatedAt:row.updated_at||null,payload:p};
 }
 function acceptRemote(table,row){const next=structuredClone(state);putRow(next,table,row);save(next);}
 async function pull(){for(const table of M.TABLES){for(let page=0;page<1000;page++){
  check();const rows=await adapter.pull(table,state.cursors[table]||0);check();if(!Array.isArray(rows))throw Error('Sunucu yanıtı geçersiz.');if(!rows.length)break;
  let last=state.cursors[table]||0;const next=structuredClone(state);
  for(const row of rows){const revision=Number(row.sync_revision);if(!Number.isSafeInteger(revision)||revision<=last)throw Error('Sunucu değişiklik sırası geçersiz.');last=revision;putRow(next,table,row);}
  // Tek bir yazma yanıtı imleci ilerletmez; aradaki diğer cihaz kayıtları atlanmaz.
  next.cursors[table]=last;save(next);if(rows.length<500)break;if(page===999)throw Error('Çok fazla kayıt; eşitleme durduruldu.');
 }}}
 async function flushHistory(){for(const id of Object.keys(state.historyQueue)){
  check();const p=state.historyQueue[id];if(!p)continue;
  if(!state.base['notes:'+id]){const written=await adapter.write('notes',id,p,0);check();if(!written.row)throw Error('Önceki not sürümü saklanamadı; değişiklik kuyrukta korundu.');acceptRemote('notes',written.row);}
  const next=structuredClone(state);delete next.historyQueue[id];save(next);
 }}
 function finish(key,q,revision,resolved=false){const next=structuredClone(state);delete next.queue[key];if(R.equal(next.seen[key]??null,q.payload)&&matches(q.payload,next.base[key]?.payload)){next.seenRev[key]=revision||0;next.seenSync[key]=next.base[key]?.payload.metadata?.seiriSync||null;}if(resolved)next.resolved++;save(next);}
 async function push(){for(const table of M.TABLES){for(const key of Object.keys(state.queue).filter(k=>split(k)[0]===table)){
  // Ağ üzerinde sürekli yarış varsa istek sınırlanır; kuyruk bir sonraki turda sürer.
  for(let attempt=0;attempt<4&&state.queue[key];attempt++){
   check();const q=state.queue[key],[,localId]=split(key),base=state.base[key],p=base?.payload;
   if(matches(q.payload,p)&&!q.erase&&!q.purge){finish(key,q,base?.revision);break;}
   if(!base&&!q.payload){finish(key,q,0);break;}
   const deleting=q.payload===null||!!q.payload?.deleted_at;
   const note=table==='notes'&&(R.isNote(q.payload)||R.isNote(p));
   const stale=(base?.revision||0)!==q.baseRevision;
   let desired,expected=q.baseRevision;
   if(q.erase){desired={...p,...(table==='notes'?{title:'Meşgul',content:''}:{title:'Meşgul',description:''}),metadata:{v:1,erased:true},deleted_at:new Date(now()).toISOString()};expected=base.revision;}
   else if(deleting){
    // Silme, revizyon yarışı yüzünden düşürülmez. Tam silmede içerik de kaldırılır.
    desired=q.payload?structuredClone(q.payload):{...p,title:table==='notes'?'Silinen not':p?.title,...(table==='notes'?{content:'',metadata:{v:1,erased:true}}:{}),deleted_at:new Date(q.clock?.at||now()).toISOString()};
    if(note&&q.payload)desired=R.stamp(desired,q.clock||R.clock(q.payload));expected=base?.revision||0;
   }else if(p?.deleted_at&&(p.metadata?.erased||!q.previous?.deleted_at)){
    // Eski çevrimdışı düzenleme silinmiş kaydı diriltemez; açık geri yükleme gerekir.
    if(note){const next=structuredClone(state);archive(next,localId,q.payload);save(next);await flushHistory();}finish(key,q,base.revision,true);break;
   }else if(note){
    const c=q.clock||R.clock(q.payload),remoteClock=R.clock(p);desired=R.stamp(q.payload,c,q.previous,q.priorSync);expected=base?.revision||0;
    if(stale){
     const next=structuredClone(state);archive(next,localId,q.payload);archive(next,localId,p);save(next);await flushHistory();
     // Kurtarılmış cache/eski kuyruk güncel içeriğin üzerine sessizce geçmez.
     if(q.recovered||!q.clock){finish(key,q,base?.revision,true);break;}
     if(p&&!p.deleted_at)desired=R.merge(desired,p,q.previous,c);
     else if(p?.deleted_at&&R.compare(c,remoteClock)<=0){finish(key,q,base.revision,true);break;}
     if(R.equal(desired,p)){finish(key,q,base?.revision,true);break;}
    }
   }else if(stale){
    // Görev/liste gibi kapsam dışı kayıtların önceki güvenli davranışı korunur.
    const next=structuredClone(state);delete next.queue[key];next.conflicts++;
    if(q.payload){const copy=M.conflict(table,localId,q.payload,q.opId);next.queue[M.rowKey(table,copy.id)]={payload:copy.payload,baseRevision:0,opId:q.opId};}save(next);break;
   }else desired=q.payload;
   if(note&&!q.erase&&p&&!R.equal(p,desired)){const next=structuredClone(state);archive(next,localId,p);save(next);await flushHistory();}
   if(desired.metadata&&Buffer.byteLength(JSON.stringify(desired.metadata))>30000)throw Error('Not özellikleri ve eşitleme bilgisi 30 KB sınırını aşıyor. Yerel kayıt korundu.');
   const written=await adapter.write(table,localId,desired,expected);check();
   if(written.conflict){if(written.row)acceptRemote(table,written.row);else throw Error('Bulut kaydı bulunamadı; kuyruk korundu.');continue;}
   if(!written.row)throw Error('Kayıt onayı alınamadı; kuyruk korundu.');acceptRemote(table,written.row);finish(key,q,Number(written.row.revision),note&&stale);
  }
 }}}
 async function trimVersions(){
  const versions=Object.entries(state.base).filter(([,r])=>R.isVersion(r.payload)&&!r.payload.deleted_at).sort((a,b)=>(b[1].payload.metadata.at-a[1].payload.metadata.at)||a[0].localeCompare(b[0]));const counts=new Map();let total=0;
  for(const [key,r]of versions){const id=r.payload.metadata.noteId,n=counts.get(id)||0;if(n<20&&total<64){counts.set(id,n+1);total++;continue;}
   const p={...r.payload,title:'Eski sürüm',content:'',deleted_at:new Date(now()).toISOString(),metadata:{v:1,surface:'note_version',noteId:id,versionId:r.payload.metadata.versionId,at:r.payload.metadata.at}};
   const result=await adapter.write('notes',split(key)[1],p,r.revision);check();if(result.row)acceptRemote('notes',result.row);
  }
 }
 function status(){return{pending:Object.keys(state.queue).length+Object.keys(state.historyQueue).length,conflicts:state.conflicts,resolved:state.resolved,lastAt:state.lastAt};}
 return Object.freeze({capture:(rows,blocked,recovered)=>serial(()=>capture(rows,blocked,recovered)),run:()=>serial(async()=>{await pull();await flushHistory();await push();await push();await pull();await flushHistory();await trimVersions();await pull();const next=structuredClone(state);next.lastAt=now();save(next);return{...status(),rows:structuredClone(state.base)};}),status,stop:()=>{stopped=true;}});
}
function supabaseAdapter(client,{workspaceId,userId,valid}){
 const check=()=>{if(!valid())throw Error('Oturum değişti.');};
 return{async pull(table,cursor){check();const r=await client.from(table).select('*').eq('workspace_id',workspaceId).gt('sync_revision',cursor).order('sync_revision').limit(500);check();if(r.error)throw Error('Bulut kayıtları okunamadı. Bağlantı ve hesap yetkisini kontrol et.');return r.data;},async write(table,localId,payload,revision){check();const id=M.idFor(workspaceId,table,localId);let q=revision?client.from(table).update(payload).eq('workspace_id',workspaceId).eq('id',id).eq('revision',revision):client.from(table).insert({...payload,id,workspace_id:workspaceId,created_by:userId,local_id:localId});const r=await q.select('*');check();if(!r.error&&r.data?.[0])return{row:r.data[0]};if(r.error&&r.error.code!=='23505')throw Error('Kayıt gönderilemedi. Ağ, boyut sınırı veya yetki nedeniyle kuyruk bu cihazda korundu.');const actual=await client.from(table).select('*').eq('workspace_id',workspaceId).eq('id',id).limit(1);check();if(actual.error)throw Error('Çakışma kontrol edilemedi; kuyruk korundu.');return{conflict:true,row:actual.data?.[0]};}};
}
module.exports={createEngine,supabaseAdapter};
