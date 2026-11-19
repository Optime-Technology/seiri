'use strict';
/** Kalıcı gönderim kuyruğu, koşullu revizyon yazımı ve çakışma kopyaları. */
const crypto=require('node:crypto');const {atomicJSON,readJSON}=require('./account-spaces.cjs');const M=require('./sync-model.cjs');
const split=key=>[key.slice(0,key.indexOf(':')),key.slice(key.indexOf(':')+1)];
const matches=(desired,base)=>desired==null&&(!base||base.deleted_at)?true:M.equal(desired,base);
function createEngine({file,userId,workspaceId,adapter,valid=()=>true}){
 const empty=()=>({v:1,userId,workspaceId,seen:{},seenRev:{},base:{},queue:{},cursors:{},conflicts:0,lastAt:0});
 let state=readJSON(file,empty()),chain=Promise.resolve(),stopped=false;
 if(state.v!==1||state.userId!==userId||state.workspaceId!==workspaceId)throw Error('Eşitleme alanı hesapla uyuşmuyor.');
 function check(){if(stopped||!valid())throw Error('Hesap alanı değişti; işlem durduruldu.');}
 function save(next){check();if(Buffer.byteLength(JSON.stringify(next))>32*1024*1024)throw Error('Yerel eşitleme günlüğü 32 MB sınırına ulaştı. JSON yedeği al.');atomicJSON(file,next);state=next;}
 const serial=fn=>{const next=chain.catch(()=>{}).then(()=>{check();return fn();});chain=next;return next;};
 function capture(rows,blocked=[],recovered=false){const next=structuredClone(state),excluded=new Set(blocked);for(const key of new Set([...Object.keys(next.seen),...Object.keys(rows)])){if(excluded.has(key))continue;const value=rows[key]??null;if(M.equal(value,next.seen[key]??null))continue;const base=next.base[key];if(matches(value,base?.payload)){delete next.queue[key];next.seenRev[key]=base?.revision||0;}else{const old=next.queue[key];next.queue[key]={payload:value,baseRevision:old?.baseRevision??(recovered?-1:next.seenRev[key]??0),opId:old?.opId||crypto.randomUUID()};}if(value===null)delete next.seen[key];else next.seen[key]=value;}
  // Hassas yapılan bir kayıt bulutta daha önce varsa içeriği aşağıda silme mezar taşına çevrilir.
  for(const key of excluded){if(next.base[key]&&!next.base[key].payload.deleted_at)next.queue[key]={payload:null,baseRevision:next.base[key].revision,opId:next.queue[key]?.opId||crypto.randomUUID(),erase:true};else delete next.queue[key];delete next.seen[key];}
  save(next);return status();
 }
 function acceptRemote(table,row){if(!row.local_id)return;const key=M.rowKey(table,row.local_id),next=structuredClone(state);next.base[key]={revision:Number(row.revision),createdAt:row.created_at||null,updatedAt:row.updated_at||null,payload:M.normalizePayload(table,row)};next.cursors[table]=Math.max(next.cursors[table]||0,Number(row.sync_revision)||0);save(next);}
 async function pull(){for(const table of M.TABLES){for(let page=0;page<1000;page++){check();const rows=await adapter.pull(table,state.cursors[table]||0);check();if(!Array.isArray(rows))throw Error('Sunucu yanıtı geçersiz.');if(!rows.length)break;let last=state.cursors[table]||0;const next=structuredClone(state);for(const row of rows){if(!row.local_id)throw Error('Yerel kimliği olmayan bulut kaydı bulundu.');const revision=Number(row.sync_revision);if(!Number.isSafeInteger(revision)||revision<=last)throw Error('Sunucu değişiklik sırası geçersiz.');last=revision;next.base[M.rowKey(table,row.local_id)]={revision:Number(row.revision),createdAt:row.created_at||null,updatedAt:row.updated_at||null,payload:M.normalizePayload(table,row)};}next.cursors[table]=last;save(next);if(rows.length<500)break;if(page===999)throw Error('Çok fazla kayıt; eşitleme durduruldu.');}}}
 async function push(){for(const table of M.TABLES){for(const key of Object.keys(state.queue).filter(k=>split(k)[0]===table)){
  check();const q=state.queue[key];if(!q)continue;const [,localId]=split(key),base=state.base[key];
  if(matches(q.payload,base?.payload)&&!q.erase){const next=structuredClone(state);delete next.queue[key];if(M.equal(next.seen[key]??null,q.payload))next.seenRev[key]=base?.revision||0;save(next);continue;}
  if(!q.erase&&(base?.revision||0)!==q.baseRevision){const next=structuredClone(state);delete next.queue[key];next.conflicts++;if(q.payload&&!q.erase){const copy=M.conflict(table,localId,q.payload,q.opId),newKey=M.rowKey(table,copy.id);next.queue[newKey]={payload:copy.payload,baseRevision:0,opId:q.opId};}save(next);continue;}
  const desired=q.erase?{...base.payload,title:'Meşgul',...(table==='notes'?{content:''}:{description:''}),metadata:{v:1,erased:true},deleted_at:new Date().toISOString()}:q.payload??{...base?.payload,deleted_at:new Date().toISOString()};
  if(!base&&!q.payload){const next=structuredClone(state);delete next.queue[key];save(next);continue;}
  const written=await adapter.write(table,localId,desired,q.erase?base.revision:q.baseRevision);check();if(written.conflict){if(written.row)acceptRemote(table,written.row);else throw Error('Bulut kaydı bulunamadı; kuyruk korundu.');continue;}
  const row=written.row;if(!row)throw Error('Kayıt onayı alınamadı; kuyruk korundu.');const next=structuredClone(state);next.base[key]={revision:Number(row.revision),createdAt:row.created_at||null,updatedAt:row.updated_at||null,payload:M.normalizePayload(table,row)};delete next.queue[key];if(M.equal(next.seen[key]??null,q.payload))next.seenRev[key]=Number(row.revision);save(next);
 }} }
 function status(){return{pending:Object.keys(state.queue).length,conflicts:state.conflicts,lastAt:state.lastAt};}
 return Object.freeze({capture:(rows,blocked,recovered)=>serial(()=>capture(rows,blocked,recovered)),run:()=>serial(async()=>{await pull();await push();await push();await pull();const next=structuredClone(state);next.lastAt=Date.now();save(next);return{...status(),rows:structuredClone(state.base)};}),status,stop:()=>{stopped=true;}});
}
function supabaseAdapter(client,{workspaceId,userId,valid}){
 const check=()=>{if(!valid())throw Error('Oturum değişti.');};
 return{async pull(table,cursor){check();const r=await client.from(table).select('*').eq('workspace_id',workspaceId).gt('sync_revision',cursor).order('sync_revision').limit(500);check();if(r.error)throw Error('Bulut kayıtları okunamadı. Bağlantı ve hesap yetkisini kontrol et.');return r.data;},async write(table,localId,payload,revision){check();const id=M.idFor(workspaceId,table,localId);let q=revision?client.from(table).update(payload).eq('workspace_id',workspaceId).eq('id',id).eq('revision',revision):client.from(table).insert({...payload,id,workspace_id:workspaceId,created_by:userId,local_id:localId});const r=await q.select('*');check();if(!r.error&&r.data?.[0])return{row:r.data[0]};if(r.error&&r.error.code!=='23505')throw Error('Kayıt gönderilemedi. Ağ, boyut sınırı veya yetki nedeniyle kuyruk bu cihazda korundu.');const actual=await client.from(table).select('*').eq('workspace_id',workspaceId).eq('id',id).limit(1);check();if(actual.error)throw Error('Çakışma kontrol edilemedi; kuyruk korundu.');return{conflict:true,row:actual.data?.[0]};}};
}
module.exports={createEngine,supabaseAdapter};
