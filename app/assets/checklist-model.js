'use strict';
/** Checklistler çalışma verisiyle aynı yerel kayda ve JSON yedeğine dahildir. */
const SeiriChecklistModel=(()=>{
 const maxLists=50,maxItems=200;
 function valid(l){return l&&typeof l.id==='string'&&l.id.length>0&&l.id.length<=100&&typeof l.title==='string'&&l.title.trim().length>0&&l.title.length<=120&&Array.isArray(l.items)&&l.items.length<=maxItems&&l.items.every(i=>i&&typeof i.id==='string'&&i.id.length>0&&i.id.length<=100&&typeof i.text==='string'&&i.text.length<=300&&typeof i.done==='boolean')&&new Set(l.items.map(i=>i.id)).size===l.items.length;}
 function normalize(lists){return Array.isArray(lists)?lists.filter(valid).filter((l,i,a)=>a.findIndex(x=>x.id===l.id)===i).slice(0,100).map(l=>({id:l.id,title:l.title,items:l.items.map(i=>({id:i.id,text:i.text,done:i.done})),createdAt:Number(l.createdAt)||0,updatedAt:Number(l.updatedAt)||0,deletedAt:Number(l.deletedAt)||0})):[];}
 function create(lists,id,title,now=Date.now()){title=title.trim();if(!title||title.length>120)throw Error('1–120 karakter arasında başlık yaz.');if(lists.filter(l=>!l.deletedAt).length>=maxLists||lists.length>=100)throw Error('Liste sınırına ulaşıldı.');if(lists.some(l=>l.id===id))throw Error('Liste zaten var.');return [...lists,{id,title,items:[],createdAt:now,updatedAt:now,deletedAt:0}];}
 function change(lists,id,action,value,now=Date.now()){if(!lists.some(l=>l.id===id))throw Error('Liste bulunamadı.');return lists.map(l=>{if(l.id!==id)return l;const next={...l,items:l.items.map(i=>({...i})),updatedAt:now};
  if(action==='title'){const title=String(value).trim();if(!title||title.length>120)throw Error('Geçerli bir başlık yaz.');next.title=title;}
  else if(action==='add'){if(next.items.length>=maxItems)throw Error('Bir listede en fazla 200 madde olabilir.');if(!value.text.trim()||value.text.length>300||next.items.some(i=>i.id===value.id))throw Error('Geçerli bir madde yaz.');next.items.push({id:value.id,text:value.text.trim(),done:false});}
  else if(action==='done'||action==='text'||action==='remove'){const item=next.items.find(i=>i.id===value.id);if(!item)throw Error('Madde bulunamadı.');if(action==='done')item.done=value.done===true;if(action==='text'){if(!value.text.trim()||value.text.length>300)throw Error('Geçerli bir madde yaz.');item.text=value.text.trim();}if(action==='remove')next.items=next.items.filter(i=>i.id!==value.id);}
  else if(action==='delete')next.deletedAt=now;else if(action==='restore')next.deletedAt=0;else throw Error('Geçersiz işlem.');return next;});}
 return Object.freeze({valid,normalize,create,change,maxLists,maxItems});
})();
if(typeof module!=='undefined')module.exports=SeiriChecklistModel;
