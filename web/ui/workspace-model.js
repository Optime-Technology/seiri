'use strict';
/** Kategorisiz sanal seçenektir; kullanıcının bütün kategorileri silinebilir. */
const FocusWorkspaceModel=(()=>{
 const uncategorized=Object.freeze({id:'__uncategorized__',name:'Kategorisiz',color:'#a2a6ad'});
 const options=categories=>[...categories.filter(c=>c.id!==uncategorized.id),uncategorized];
 const exists=(categories,id)=>id===uncategorized.id||categories.some(c=>c.id===id);
 function removeCategory(data,id,target=uncategorized.id,updated=new Date().toISOString()){
  if(!data.categories.some(c=>c.id===id))throw Error('Kategori bulunamadı.');
  if(id===target||!exists(data.categories,target))throw Error('Geçerli bir hedef kategori seç.');
  const categories=data.categories.filter(c=>c.id!==id),destination=options(categories).find(c=>c.id===target);
  const entries=data.entries.map(entry=>entry.category===id?{...entry,category:target,...(entry.categorySnapshot?{categorySnapshot:{...destination}}:{}),updated}:entry);
  return {...data,categories,entries};
 }
 function sortNotes(entries){return [...entries].sort((a,b)=>Number(!!b.pinned)-Number(!!a.pinned)||String(b.updated||b.date).localeCompare(String(a.updated||a.date))||a.id.localeCompare(b.id));}
 return Object.freeze({uncategorized,options,exists,removeCategory,sortNotes});
})();
if(typeof module!=='undefined')module.exports=FocusWorkspaceModel;
