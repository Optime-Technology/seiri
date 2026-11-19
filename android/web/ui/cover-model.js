'use strict';
/** Not kapağı yalnızca küçültülmüş yerel JPEG dosyasına işaret eder. */
const SeiriCoverModel=(()=>{
 const maxBytes=768*1024;
 function valid(value){return !!value&&typeof value.id==='string'&&/^[a-zA-Z0-9-]{1,99}$/.test(value.id)&&typeof value.name==='string'&&value.name.length<500&&value.type==='image/jpeg'&&Number.isInteger(value.size)&&value.size>0&&value.size<=maxBytes;}
 function refs(entry){return [...(entry.attachments||[]),...(valid(entry.cover)?[entry.cover]:[]),...(Array.isArray(entry.inlineImages)?entry.inlineImages.filter(valid):[])];}
 function change(entries,id,cover,updated=new Date().toISOString()){
  if(cover!==null&&!valid(cover))throw Error('Geçersiz kapak görseli.');
  const note=entries.find(e=>e.id===id);if(!note||note.type!=='note'||note.sensitive)throw Error('Not bulunamadı.');
  return entries.map(e=>{if(e.id!==id)return e;const next={...e,updated};if(cover)next.cover={...cover};else delete next.cover;return next;});
 }
 return Object.freeze({maxBytes,valid,refs,change});
})();
if(typeof module!=='undefined')module.exports=SeiriCoverModel;
