'use strict';
/** İçerik toplamadan, kullanıcının seçimiyle yerel tanılama raporu oluşturur. */
window.SeiriSupport=(()=>{
 async function download(){let native={};try{native=await window.ZamanDesktop?.getInfo()||{};}catch{}const report={product:SeiriBrand.name,version:SeiriBrand.version,createdAt:new Date().toISOString(),platform:native.platform||'unknown',arch:native.arch||'unknown',appearance:getAppearancePreference(),storageHealthy:!storageLoadError&&window.ZamanStudy.storageHealthy(),counts:{notes:data.entries.filter(n=>n.type==='note'&&!n.deletedAt).length,trash:data.entries.filter(n=>n.type==='note'&&n.deletedAt).length,courses:window.ZamanStudy.getCourses().length,tasks:window.ZamanStudy.getPlannerTasks().length,sessions:window.ZamanStudy.getSessions().length},containsContent:false};const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='seiri-tanilama-'+SeiriBrand.version+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 return Object.freeze({download});
})();
