'use strict';
/** Görünümün tek kaynağı. Eski paket kimlikleri veri kaybetmeden Seiri'ye taşınır. */
window.SeiriAppearance=(()=>{
 const modes=Object.freeze([
  Object.freeze({id:'seiri',name:'Seiri',description:'Kâğıt yüzeyler · Lavanta · Zarif başlıklar'}),
  Object.freeze({id:'lofi',name:'Lo-Fi',description:'Gece manzarası · Retro yazılar · Piksel kedi'}),
  Object.freeze({id:'academic',name:'Akademik',description:'Times New Roman · Sade çalışma alanı'})
 ]);
 const normalize=value=>modes.some(mode=>mode.id===value)?value:'seiri';
 function next(current,key){const index=modes.findIndex(mode=>mode.id===normalize(current));if(key==='Home')return modes[0].id;if(key==='End')return modes.at(-1).id;return modes[(index+(['ArrowLeft','ArrowUp'].includes(key)?modes.length-1:1))%modes.length].id;}
 return Object.freeze({modes,normalize,next});
})();
