'use strict';
/** Windows masaüstü kabuğu. Dosya erişimi yalnızca ana süreçte yapılır. */
const {app,BrowserWindow,protocol,net,ipcMain,dialog,shell,Tray,Menu,Notification,nativeImage,session}=require('electron');
const path=require('node:path'),fs=require('node:fs'),{pathToFileURL}=require('node:url');
protocol.registerSchemesAsPrivileged([{scheme:'zaman',privileges:{standard:true,secure:true,supportFetchAPI:true,stream:true}}]);
app.setName('Seiri');
// İsim değişirken eski notlar, anahtar kasası ve ayarlar aynı yerde kalır.
app.setPath('userData',path.join(app.getPath('appData'),'Zaman'));
app.setAppUserModelId('com.optimetechnology.seiri');
const root=path.resolve(__dirname,'../app');
const visibleNotices=new Map();
let security,win,tray,quitting=false,state={reminders:[],delivered:[]},stateFile;
const externalHosts=new Set(['zaman-ajanda-celil.eternalchest.chatgpt.site','vakithesaplama.diyanet.gov.tr','www.diyanet.gov.tr']);
function external(url){try{const u=new URL(url);if(u.protocol==='https:'&&externalHosts.has(u.hostname)&&!u.username&&!u.password&&!u.port)return shell.openExternal(u.href);}catch{}return Promise.resolve();}
function persist(){const tmp=stateFile+'.tmp';fs.writeFileSync(tmp,JSON.stringify(state));fs.renameSync(tmp,stateFile);}
function validSender(event){if(!win||event.sender!==win.webContents||event.senderFrame?.url!=='zaman://app/index.html')throw Error('Bu işlem için yetki yok.');}
function handle(name,fn){ipcMain.handle(name,async(event,...args)=>{validSender(event);try{return await fn(...args);}catch(error){console.error(name,'operation_failed');throw Error('İşlem tamamlanamadı. Dosya ve sistem izinlerini kontrol et.');}});}
function show(){if(!win||win.isDestroyed())createWindow();win.show();win.restore();win.focus();}
function notify(item){if(security)item=security.redact(item);if(!Notification.isSupported())return;const n=new Notification({title:item.title,body:item.body,icon:path.join(__dirname,'icon.png')});n.on('click',()=>{show();win.webContents.send('open-entry',item.entryId||'');});if(item.entryId){if(!visibleNotices.has(item.entryId))visibleNotices.set(item.entryId,new Set());visibleNotices.get(item.entryId).add(n);n.on('close',()=>visibleNotices.get(item.entryId)?.delete(n));}n.show();}
function tick(){const now=Date.now(),due=state.reminders.filter(n=>n.at<=now);if(!due.length)return;state.reminders=state.reminders.filter(n=>n.at>now);for(const n of due){if(now-n.at<24*3600000){state.delivered.unshift({...n,shownAt:now});notify(n);}}state.delivered=state.delivered.slice(0,100);persist();}
function createWindow(){
 win=new BrowserWindow({title:'Seiri 1.9.0 · Takvim ve Ajanda',width:1380,height:900,minWidth:860,minHeight:620,backgroundColor:'#f8f9f5',icon:path.join(__dirname,'icon.png'),show:false,autoHideMenuBar:true,webPreferences:{preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,sandbox:true,nodeIntegration:false,webSecurity:true,spellcheck:true}});
 try{security=require('./security-ipc.cjs')({win,userData:app.getPath('userData'),onRedact:(id,remove)=>{for(const n of visibleNotices.get(id)||[])n.close();visibleNotices.delete(id);state.reminders=state.reminders.filter(n=>!remove||n.entryId!==id).map(n=>security.redact(n));state.delivered=state.delivered.filter(n=>!remove||n.entryId!==id).map(n=>security.redact(n));persist();}});}catch{win.destroy();dialog.showErrorBox('Güvenlik kasası açılamadı','Kasa dosyası okunamadı. Veriler değiştirilmedi. Uygulama veri klasörünü koruyup yedeğini kontrol et.');app.quit();return;}
 require('./unload-guard.cjs')(win,dialog,()=>{quitting=false;});
 win.webContents.setWindowOpenHandler(({url})=>{external(url);return {action:'deny'};});
 win.webContents.on('will-navigate',(event,url)=>{if(url!=='zaman://app/index.html'){event.preventDefault();external(url);}});
 win.on('close',event=>{if(!quitting){event.preventDefault();win.hide();if(!state.trayNotice){state.trayNotice=true;persist();notify({title:'Seiri sistem tepsisinde açık',body:'Hatırlatmalar çalışmaya devam ediyor. Tamamen kapatmak için tepsi menüsünden Çıkış seç.'});}}});
 win.once('ready-to-show',()=>{win.maximize();win.show();});win.loadURL('zaman://app/index.html');
}
if(!app.requestSingleInstanceLock({version:app.getVersion()})){app.whenReady().then(()=>{dialog.showErrorBox('Seiri veya eski sürüm zaten çalışıyor','Güncel sürümü açmak için önce sistem tepsisindeki Seiri, FocusFlow veya Zaman simgesinden Çıkış seç. Ardından yeni Seiri.exe dosyasını aç. Eski çalışan pencere yeni paketle değişmez.');app.quit();});}else{
 app.on('second-instance',()=>show());
 app.on('before-quit',()=>quitting=true);
 app.whenReady().then(()=>{
  stateFile=path.join(app.getPath('userData'),'reminders.json');try{const saved=JSON.parse(fs.readFileSync(stateFile,'utf8'));if(Array.isArray(saved.reminders)&&Array.isArray(saved.delivered))state=saved;}catch{}
  protocol.handle('zaman',async request=>{
   try{const u=new URL(request.url);if(u.hostname!=='app'||!['GET','HEAD'].includes(request.method))return new Response('',{status:403});
    const decoded=decodeURIComponent(u.pathname),target=path.resolve(root,'.'+decoded);if(!target.startsWith(root+path.sep))return new Response('',{status:403});
    const response=await net.fetch(pathToFileURL(target).href);const headers=new Headers(response.headers);
    headers.set('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self'; connect-src 'self' blob:; frame-src blob:; object-src 'none'; base-uri 'none'; form-action 'none'");
    return new Response(response.body,{status:response.status,headers});
   }catch{return new Response('Dosya bulunamadı.',{status:404});}
  });
  session.defaultSession.setPermissionRequestHandler((_wc,_permission,callback)=>callback(false));
  session.defaultSession.setPermissionCheckHandler(()=>false);
  session.defaultSession.on('will-download',(_event,item)=>{item.setSaveDialogOptions({title:'Seiri · Dosyayı kaydet',defaultPath:path.join(app.getPath('downloads'),path.basename(item.getFilename()))});item.once('done',(_e,status)=>{if(win&&!win.isDestroyed())win.webContents.send('download-result',status);});});
  handle('desktop:info',()=>({version:app.getVersion(),delivered:state.delivered,notifications:Notification.isSupported(),login:app.getLoginItemSettings().openAtLogin}));
  handle('desktop:external',url=>external(String(url)));
  handle('desktop:login',enabled=>{app.setLoginItemSettings({openAtLogin:enabled===true});return app.getLoginItemSettings().openAtLogin;});
  handle('desktop:schedule',items=>{if(!Array.isArray(items)||items.length>201)throw Error('Geçersiz liste');const delivered=new Set(state.delivered.map(n=>n.id+'@'+n.at));state.reminders=items.filter(n=>n&&typeof n.id==='string'&&typeof n.entryId==='string'&&Number.isSafeInteger(n.at)&&n.at>Date.now()&&!delivered.has(n.id+'@'+n.at)).map(n=>({id:n.id.slice(0,160),entryId:n.entryId.slice(0,100),at:n.at,title:String(n.title).slice(0,160),body:String(n.body).slice(0,500)})).map(n=>security?security.redact(n):n);persist();return true;});
  handle('desktop:test',()=>{state.reminders.push({id:'test-'+Date.now(),entryId:'',at:Date.now()+5000,title:'Seiri test bildirimi',body:'Windows hatırlatmaları bu alanda görünecek.'});persist();return true;});
  handle('desktop:pdf',async bytes=>{if(!(bytes instanceof Uint8Array)||bytes.byteLength>10*1024*1024)throw Error('Dosya sınırı');const b=Buffer.from(bytes);if(b.subarray(0,5).toString()!=='%PDF-')throw Error('PDF değil');const file=path.join(app.getPath('temp'),'seiri-'+require('node:crypto').randomUUID()+'.pdf');fs.writeFileSync(file,b);const error=await shell.openPath(file);if(error)throw Error(error);return true;});
  tray=new Tray(nativeImage.createFromPath(path.join(__dirname,'icon.png')).resize({width:32,height:32}));tray.setToolTip('Seiri · Takvim ve Ajanda');tray.setContextMenu(Menu.buildFromTemplate([{label:'Seiri’yi aç',click:show},{label:'Hatırlatmalar için arka planda çalışıyor',enabled:false},{type:'separator'},{label:'Çıkış',click:()=>{quitting=true;app.quit();}}]));tray.on('double-click',show);
  Menu.setApplicationMenu(Menu.buildFromTemplate([{label:'Seiri',submenu:[{label:'Yenile',role:'reload'},{label:'Yakınlaştır',role:'zoomIn'},{label:'Uzaklaştır',role:'zoomOut'},{label:'Varsayılan boyut',role:'resetZoom'},{type:'separator'},{label:'Çıkış',click:()=>{quitting=true;app.quit();}}]},{label:'Düzenle',submenu:[{role:'undo',label:'Geri al'},{role:'redo',label:'Yinele'},{type:'separator'},{role:'cut',label:'Kes'},{role:'copy',label:'Kopyala'},{role:'paste',label:'Yapıştır'},{role:'selectAll',label:'Tümünü seç'}]}]));
  if(process.platform==='win32'){const shortcut=path.join(app.getPath('appData'),'Microsoft','Windows','Start Menu','Programs','Seiri.lnk');try{shell.writeShortcutLink(shortcut,'create',{target:process.execPath,cwd:path.dirname(process.execPath),description:'Seiri · Takvim ve Ajanda',icon:path.join(__dirname,'icon.ico'),iconIndex:0,appUserModelId:'com.optimetechnology.seiri'});}catch{}}
  createWindow();tick();setInterval(tick,1000);app.on('activate',show);
 });
}
