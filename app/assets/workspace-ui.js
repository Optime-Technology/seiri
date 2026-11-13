'use strict';
/** Sabit sol menü yerine tam genişlik ve bağlama göre açılan yardımcı alan. */
window.FocusWorkspaceUI=(()=>{
 let panel,toggle,manager,mini,route='',ready=false;
 function renderCategories(){const list=document.getElementById('categories');if(!list)return;
  list.innerHTML=data.categories.length?data.categories.map(c=>'<div class="categoryManageRow"><span class="dot" style="background:'+esc(c.color)+'"></span><strong>'+esc(c.name)+'</strong><small>'+data.entries.filter(e=>e.category===c.id).length+' kayıt</small><button type="button" class="categoryDelete" data-remove-category="'+esc(c.id)+'" aria-label="'+esc(c.name)+' kategorisini sil">Sil</button></div>').join(''):'<div class="categoryEmpty">Kategori yok</div>';
  list.querySelectorAll('[data-remove-category]').forEach(b=>b.onclick=()=>deleteDialog(b.dataset.removeCategory));
  const count=document.getElementById('journalCategoryCount');if(count)count.textContent=data.categories.length;
 }
 function deleteDialog(id){const category=data.categories.find(c=>c.id===id);if(!category)return;
  const d=document.createElement('dialog');d.className='workspaceDialog';d.setAttribute('aria-label','Kategori sil');d.innerHTML='<form><div class="workspaceDialogHead"><h2>Kategoriyi sil</h2><button type="button" class="close" data-cancel aria-label="Kapat">×</button></div><p><strong>'+esc(category.name)+'</strong> kategorisi silinecek. '+data.entries.filter(e=>e.category===id).length+' kayıt korunacak.</p><label>Kayıtları taşı<select name="destination">'+categoryOptions().filter(c=>c.id!==id).map(c=>'<option value="'+esc(c.id)+'">'+esc(c.name)+'</option>').join('')+'</select></label><p class="categorySafety">Not ve etkinlik içerikleri silinmez. Hassas etkinlikler şifreli kalır.</p><p role="alert" class="categoryError"></p><div class="workspaceActions"><button type="button" class="outline" data-cancel>Vazgeç</button><button type="submit" class="danger">Kategoriyi sil</button></div></form>';
  document.body.append(d);d.querySelector('[name=destination]').value=FocusWorkspaceModel.uncategorized.id;d.querySelectorAll('[data-cancel]').forEach(b=>b.onclick=()=>d.close());d.addEventListener('close',()=>d.remove());
  d.querySelector('form').onsubmit=e=>{e.preventDefault();const previous=data;
   try{if(account)throw Error('Bu sürümde ekip kategorileri buradan değiştirilemez.');data=FocusWorkspaceModel.removeCategory(data,id,d.querySelector('[name=destination]').value);if(!save()){data=previous;throw Error('Kategori silinemedi. Depolama alanını kontrol et.');}if(filter===id)filter='all';d.close();render();window.ZamanStudy.refresh();renderCategories();toast('Kategori silindi; kayıtlar taşındı.');}
   catch(error){data=previous;d.querySelector('.categoryError').textContent=error.message;}
  };d.showModal();
 }
 function showCategories(){renderCategories();if(!manager.open)manager.showModal();}
 function setPanel(open,focus=false){if(!panel)return;panel.hidden=!open;toggle.setAttribute('aria-expanded',String(open));if(open){updateContext();window.FocusMotion?.enter(panel);}else if(focus)toggle.focus();}
 function updateContext(){if(!ready)return;const journal=page==='journal',calendar=page==='calendar',body=panel.querySelector('.contextBody');toggle.hidden=!journal&&!calendar;
  if(!journal&&!calendar){panel.hidden=true;toggle.setAttribute('aria-expanded','false');return;}
  const next=journal?'calendar':'notes';toggle.querySelector('span').textContent=journal?'Mini takvim':'Notlar';panel.querySelector('h2').textContent=journal?'Mini takvim':'Notlar';
  if(next==='calendar'){if(!body.contains(mini)){body.replaceChildren(mini);}modernMiniCalendar();}
  else {if(body.contains(mini))document.getElementById('miniCalendarParking').append(mini);const notes=FocusWorkspaceModel.sortNotes(data.entries.filter(e=>e.type==='note')).slice(0,12);body.innerHTML='<div class="contextNotes">'+notes.map(n=>'<button data-context-note="'+esc(n.id)+'"><strong>'+(n.pinned?'◆ ':'')+esc(n.title)+'</strong><small>'+esc(fmt(parse(n.date)))+'</small></button>').join('')+'</div><button class="outline contextAdd" data-context-new>Yeni not</button>';body.querySelectorAll('[data-context-note]').forEach(b=>b.onclick=()=>{setPanel(false);const item=data.entries.find(e=>e.id===b.dataset.contextNote);if(item)openEditor('note',item);});body.querySelector('[data-context-new]').onclick=()=>{setPanel(false);openEditor('note');};}
  if(route!==next&&!panel.hidden)window.FocusMotion?.enter(panel);route=next;
 }
 function journalRendered(){if(!ready)return;const head=document.querySelector('#journalPage .notebookSidebar');if(head&&!head.querySelector('#journalCategories')){
  const b=document.createElement('button');b.id='journalCategories';b.className='journalCategories';b.innerHTML=modernIcon('palette')+'<span>Kategoriler</span><small id="journalCategoryCount">'+data.categories.length+'</small>';b.onclick=showCategories;head.insertBefore(b,head.querySelector('.notebookNav'));}
  updateContext();renderCategories();
 }
 async function pin(id){const entry=data.entries.find(e=>e.id===id);if(!entry||entry.type!=='note')return;
  if(window.ZamanStudy.isWriting()&&!await window.ZamanStudy.saveCurrent()){toast('Önce notu kaydet veya taslağı dışa aktar.');return;}
  const old=data.entries;data.entries=data.entries.map(e=>e.id===id?{...e,pinned:!e.pinned}:e);
  if(!save()){data.entries=old;return;}const current=data.entries.find(e=>e.id===id);const b=document.getElementById('writerPin');if(b)b.textContent=current.pinned?'Sabitlemeyi kaldır':'Notu sabitle';window.ZamanStudy.refresh();updateContext();
 }
 function init(){
  manager=document.createElement('dialog');manager.id='categoryManager';manager.className='workspaceDialog categoryManager';manager.setAttribute('aria-label','Kategoriler');manager.innerHTML='<div class="workspaceDialogHead"><h2>Kategoriler</h2><button class="close" data-manager-close aria-label="Kategorileri kapat">×</button></div><p class="categorySafety">Kategori silmek, içindeki not ve etkinlikleri silmez.</p><div class="categoryManagerBody"></div><div class="categoryManagerAdd"></div>';document.body.append(manager);manager.querySelector('[data-manager-close]').onclick=()=>manager.close();manager.querySelector('.categoryManagerBody').append(document.getElementById('categories'));const add=document.getElementById('addCategory');add.textContent='+ Kategori ekle';add.className='outline';manager.querySelector('.categoryManagerAdd').append(add);
  mini=document.querySelector('.miniCalendarCard');mini.classList.add('contextMini');const parking=document.createElement('div');parking.id='miniCalendarParking';parking.hidden=true;document.body.append(parking);parking.append(mini);
  panel=document.createElement('aside');panel.id='contextPanel';panel.className='contextPanel';panel.hidden=true;panel.setAttribute('aria-label','Yardımcı alan');panel.innerHTML='<div class="contextHead"><h2></h2><button aria-label="Yardımcı alanı kapat" class="close">×</button></div><div class="contextBody"></div>';document.body.append(panel);panel.querySelector('.close').onclick=()=>setPanel(false,true);
  toggle=document.createElement('button');toggle.id='contextToggle';toggle.className='contextToggle';toggle.type='button';toggle.setAttribute('aria-controls','contextPanel');toggle.setAttribute('aria-expanded','false');toggle.innerHTML=modernIcon('notes')+'<span>Notlar</span>';document.querySelector('.headerRight').prepend(toggle);toggle.onclick=()=>setPanel(panel.hidden);
  // Eski bağlayıcıların kullandığı kimlikler korunur, menü kullanıcı yüzeyinden kaldırılır.
  const old=document.querySelector('.sidebar');old.hidden=true;old.inert=true;old.setAttribute('aria-hidden','true');document.body.classList.add('spaciousApp');
  document.addEventListener('pointerdown',e=>{if(!panel.hidden&&!panel.contains(e.target)&&!toggle.contains(e.target))setPanel(false);});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden&&!document.querySelector('dialog[open]')){setPanel(false,true);e.preventDefault();}});
  document.addEventListener('click',e=>{const b=e.target.closest('[data-pin-note],#writerPin');if(b){e.preventDefault();pin(b.dataset.pinNote||editing).catch(()=>toast('Not sabitlenemedi.'));}if(e.target.closest('#writerExport')){const note=window.ZamanStudy.backupData().entries.find(n=>n.id===editing);window.FocusNoteExport.show(note);}});
  const previous=render;render=function(...args){const value=previous(...args);journalRendered();updateContext();return value;};ready=true;journalRendered();updateContext();
 }
 document.addEventListener('DOMContentLoaded',init);
 return Object.freeze({journalRendered,renderCategories,showCategories,updateContext});
})();
