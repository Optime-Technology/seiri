'use strict';
/** Notların son düzenleme sırası, alan birleştirmesi ve görünmez sürüm kayıtları. */
const M=require('./sync-model.cjs');
const isNote=p=>p?.metadata?.surface==='entry'&&p.metadata.entry?.type==='note';
const isVersion=p=>p?.metadata?.surface==='note_version';
function clean(p){if(!p)return p;const out=structuredClone(p);if(out.metadata){delete out.metadata.seiriSync;if(out.metadata.entry){delete out.metadata.entry.updated;delete out.metadata.entry.savedDraftSession;delete out.metadata.entry.savedDraftRevision;}}return out;}
const equal=(a,b)=>M.equal(clean(a),clean(b));
const clock=p=>p?.metadata?.seiriSync?.clock||{at:Date.parse(p?.metadata?.entry?.updated)||0,seq:0,device:'',op:''};
function compare(a,b){return (a.at-b.at)||(a.seq-b.seq)||String(a.device).localeCompare(String(b.device),'en')||String(a.op).localeCompare(String(b.op),'en');}
function nextClock(p,previous,device,op,now,observed){
 // Düzenleme zamanı kullanılır; gecikmiş ağ isteğinin varış saati kullanılmaz.
 const raw=Date.parse(p?.metadata?.entry?.updated),wall=Number.isFinite(raw)&&raw>0&&raw<=now+300000?raw:now;
 const at=Math.max(wall,previous?.at||0,observed?.at||0);
 return{at,seq:Math.max(at===previous?.at?previous.seq+1:0,at===observed?.at?observed.seq+1:0),device,op};
}
function stamp(p,c,previous=null,priorSync=null){if(!p)return p;const out=structuredClone(p),fields={};
 const before=previous?flat(previous):{},current=flat(p);for(const k of Object.keys(current))fields[k]=!previous||previous.deleted_at||!M.equal(current[k],before[k])?c:priorSync?.fields?.[k]||priorSync?.clock||clock(previous);
 out.metadata={...out.metadata,seiriSync:{v:2,clock:c,fields}};return out;}

function flat(p){const v=clean(p),m=v.metadata||{},e=m.entry||{};return{title:v.title,content:v.content,...Object.fromEntries(Object.entries(e).map(([k,x])=>['entry.'+k,x]))};}
function merge(local,remote,original,c){
 const l=flat(local),r=flat(remote),o=original?flat(original):{},out=structuredClone(compare(c,clock(remote))>0?local:remote),entry={},fields={};
 for(const k of new Set([...Object.keys(l),...Object.keys(r),...Object.keys(o)])){
  const lc=!M.equal(l[k],o[k]),rc=!M.equal(r[k],o[k]),localClock=local.metadata?.seiriSync?.fields?.[k]||c,remoteClock=remote.metadata?.seiriSync?.fields?.[k]||clock(remote);const useLocal=lc&&!rc?true:rc&&!lc?false:compare(localClock,remoteClock)>0;const x=useLocal?l[k]:r[k];fields[k]=useLocal?localClock:remoteClock;
  if(k.startsWith('entry.')){if(x!==undefined)entry[k.slice(6)]=x;}else if(x!==undefined)out[k]=x;
 }
 out.metadata={...out.metadata,entry,assets:{...remote.metadata?.assets,...local.metadata?.assets}};
 // Aynı dosya kimliğinin farklı içerikle eşlenmesi desteklenmez; kimlikler değişmezdir.
 if(!Object.keys(out.metadata.assets).length)delete out.metadata.assets;
 const latest=compare(c,clock(remote))>0?c:clock(remote);out.metadata.entry.updated=new Date(latest.at||Date.now()).toISOString();
 out.metadata.seiriSync={v:2,clock:latest,fields};return out;
}
function version(id,p,now){if(!isNote(p)||p.metadata?.erased)return null;const normalized=clean(p),versionId='sync-'+M.uuid(id+'|'+M.stable(normalized)),localId='version-'+M.uuid(versionId);
 return{id:localId,payload:{title:p.title,content:p.content,deleted_at:null,metadata:{v:1,surface:'note_version',noteId:id,versionId,at:clock(p).at||now,entry:structuredClone(p.metadata.entry),...(p.metadata.assets?{assets:structuredClone(p.metadata.assets)}:{})}}};}
module.exports={isNote,isVersion,clean,equal,clock,compare,nextClock,stamp,merge,version};
