'use strict';
/** Not başına taslak günlüğü. Eski bir kayıt veya silme yeni revizyonu ezemez. */
window.SeiriDraftJournal=(()=>{
 function valid(record){return !!record&&record.kind==='seiri-note-draft'&&typeof record.id==='string'&&record.id.length<100&&typeof record.bodyHtml==='string'&&record.bodyHtml.length<2000000&&typeof record.session==='string'&&Number.isSafeInteger(record.revision)&&record.revision>=0&&Number.isFinite(record.at);}
 function create({put,get,remove}){let tail=Promise.resolve();const queue=action=>{const operation=tail.catch(()=>{}).then(action);tail=operation;return operation;};
  return Object.freeze({discard:id=>queue(()=>remove('draft:'+id)),write:record=>queue(async()=>{if(!valid(record))throw Error('Geçersiz taslak.');await put('draft:'+record.id,record);}),settle:(id,session,revision)=>queue(async()=>{const key='draft:'+id,latest=await get(key);if(valid(latest)&&latest.session===session&&latest.revision<=revision)await remove(key);}),flush:()=>tail});
 }
 return Object.freeze({create,valid});
})();
