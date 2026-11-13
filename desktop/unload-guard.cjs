'use strict';
/** Electron will-prevent-unload: varsayılan, yazıya geri dönmektir.
 * https://www.electronjs.org/docs/latest/api/web-contents#event-will-prevent-unload
 */
module.exports=function installUnloadGuard(win,dialog,onStay){
 win.webContents.on('will-prevent-unload',event=>{
  const choice=dialog.showMessageBoxSync(win,{type:'warning',title:'Kaydedilmemiş değişiklikler',message:'Bazı değişiklikler henüz kaydedilmedi.',detail:'Düzenlemeye dönerek kaydedebilir veya taslağı dışa aktarabilirsin.',buttons:['Düzenlemeye dön','Kaydetmeden çık'],defaultId:0,cancelId:0,noLink:true});
  if(choice===1)event.preventDefault();else onStay();
 });
};
