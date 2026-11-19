'use strict';
/** Yerel yedekler: 30 dakikada bir değişiklik varsa, en son yedi tam kopya. */
window.SeiriBackups=(()=>{
 const interval=30*60*1000;let lastAt=0,lastSignature='',inFlight=null,lastError='',lastToast='',restoring=false;
 const capable=()=>!!window.ZamanDesktop?.backupCreate;
 const healthy=()=>!storageLoadError&&window.ZamanStudy?.storageHealthy()!==false;
 function signature(){return ['zaman-v1','zaman-study-v1','zaman-local-profile-v1','zaman-skin','zaman-theme','zaman-motion','zaman-planner-settings'].map(k=>localStorage.getItem(k)||'').join('\n');}
 function make(force=false){if(typeof importingBackup!=='undefined'&&importingBackup)return Promise.resolve(false);if(!capable())return Promise.resolve(false);if(inFlight)return force?inFlight.then(()=>make(true)):inFlight;
  inFlight=Promise.resolve().then(async()=>{try{if(!healthy())throw Error('Veri alanı okunamıyor. Önce geçerli bir yedekten kurtar.');
   if(window.ZamanStudy?.isWriting()&&!await window.ZamanStudy.saveCurrent())throw Error('Not kaydedilemedi. Yazı alanından yedek al.');
   const current=signature();if(!force&&(Date.now()-lastAt<interval||current===lastSignature))return true;
   const backup=await buildSeiriBackup(),text=JSON.stringify(backup);if(new Blob([text]).size>128*1024*1024)throw Error('Yerel yedek 128 MB sınırını aşıyor. Dışa aktarmayı kullan.');
   const result=await window.ZamanDesktop.backupCreate(text);lastAt=Date.now();lastSignature=current;lastError=result.warnings?.join(' ')||'';lastToast='';return true;
  }catch(error){lastError=error.message||'Yerel yedek oluşturulamadı.';if(lastToast!==lastError){toast(lastError);lastToast=lastError;}return false;}finally{inFlight=null;}});return inFlight;
 }
 function download(text,id){const url=URL.createObjectURL(new Blob([text],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=id;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 async function mount(body){if(!capable())return;let host=body.querySelector('#localBackupPanel');if(!host){host=document.createElement('section');host.id='localBackupPanel';host.className='localBackupPanel';body.append(host);}host.innerHTML='<h3>Otomatik yerel yedekler</h3><p>Uygulama çalışırken, değişiklik varsa 30 dakikada bir alınır. Son 7 kopya bu bilgisayarda saklanır. Disk arızasına karşı ayrıca dışa yedek al.</p><button class="outline" data-backup-now>Şimdi yerel yedek al</button><p role="status" class="backupStatus"></p><div class="localBackupRows"></div>';
  const update=async()=>{try{const result=await window.ZamanDesktop.backupList();if(!host.isConnected)return;host.querySelector('.backupStatus').textContent=lastError||'En fazla 7 kopya · Kopya başına 128 MB';host.querySelector('.localBackupRows').innerHTML=result.items.map(item=>'<div class="localBackupRow"><div><strong>'+esc(new Date(item.createdAt).toLocaleString('tr-TR'))+'</strong><small>'+esc(fileSize(item.size))+'</small></div><button class="outline" data-backup-export="'+esc(item.id)+'">Dışa aktar</button><button class="outline" data-backup-restore="'+esc(item.id)+'">Geri yükle</button></div>').join('')||'<span class="muted">Henüz yerel kopya yok.</span>';
   host.querySelectorAll('[data-backup-export]').forEach(b=>b.onclick=async()=>{try{download(await window.ZamanDesktop.backupRead(b.dataset.backupExport),b.dataset.backupExport);}catch{toast('Yedek dışa aktarılamadı.');}});
   host.querySelectorAll('[data-backup-restore]').forEach(b=>b.onclick=async()=>{if(restoring)return;if(!confirm('Bu yedek mevcut verilerle birleştirilecek. Aynı kimlikli kayıtların yerine yedekteki sürüm gelir. Devam edilsin mi?'))return;restoring=true;b.disabled=true;try{if(window.ZamanStudy?.isWriting()&&!await window.ZamanStudy.closeWriter())return;const text=await window.ZamanDesktop.backupRead(b.dataset.backupRestore);if(healthy()&&!await make(true))throw Error('Geri yüklemeden önce güvenlik kopyası alınamadı.');if(!await importSeiriBackupFile(new File([text],'seiri-restore.json',{type:'application/json'})))throw Error('Geri yükleme tamamlanamadı.');lastSignature='';await renderModernDrawer('data');}catch(error){toast(error.message||'Yedek geri yüklenemedi.');}finally{restoring=false;if(b.isConnected)b.disabled=false;}});
  }catch{if(host.isConnected)host.querySelector('.backupStatus').textContent='Yerel kopyalar okunamadı.';}};
  host.querySelector('[data-backup-now]').onclick=async event=>{const button=event.currentTarget;button.disabled=true;await make(true);if(button.isConnected){button.disabled=false;await update();}};await update();
 }
 async function init(){if(!capable())return;try{const result=await window.ZamanDesktop.backupList();lastAt=result.items[0]?.createdAt||0;if(Date.now()-lastAt>=interval)await make(true);else lastSignature=signature();}catch{lastError='Yerel yedek alanı açılamadı.';}setInterval(()=>make(),60000);}
 document.addEventListener('DOMContentLoaded',()=>{setTimeout(init,2000);});
 return Object.freeze({mount,make});
})();
