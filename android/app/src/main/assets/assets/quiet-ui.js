'use strict';
/** Boş durum eylemleri; erişilebilir alan etiketleri ve izin açıklamaları korunur. */
document.addEventListener('click',event=>{
 const add=event.target.closest('[data-empty-add]');if(add){event.preventDefault();event.stopPropagation();add.closest('dialog')?.close();openEditor(add.dataset.emptyAdd==='note'?'note':'event');return;}
 if(event.target.closest('[data-empty-task]')){window.ZamanStudy.openStudio('tasks');requestAnimationFrame(()=>document.getElementById('newStudyTask')?.focus());}
 if(event.target.closest('[data-empty-focus]'))window.ZamanStudy.openStudio('focus');
},true);
