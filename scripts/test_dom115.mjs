/** Simüle DOM/masaüstü duman testi; fiziksel Windows veya görsel kabul testi değildir. */
import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import os from 'node:os';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{JSDOM,VirtualConsole}=require('jsdom'),{IDBFactory}=require('fake-indexeddb'),{createStore}=require('../desktop/backup-store.cjs');
const root=new URL('../app/',import.meta.url),html=fs.readFileSync(new URL('index.html',root),'utf8'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'seiri-dom-')),backup=createStore(temp),errors=[];
const wait=ms=>new Promise(r=>setTimeout(r,ms));async function until(fn){for(let i=0;i<160;i++){if(fn())return;await wait(5);}assert.fail('DOM işlemi tamamlanmadı.');}
let idb=new IDBFactory(),emit=()=>{},calls=[];
let cloudState={version:0,configured:true,secureReady:true,checking:false,pending:false,hasSession:false,verified:false,user:null,workspace:null,message:'',syncEnabled:false};
function cloudChange(change){cloudState={...cloudState,...change,version:cloudState.version+1};emit(cloudState);return {ok:true,state:cloudState};}

async function boot(seed={}){
 const vc=new VirtualConsole();vc.on('jsdomError',error=>errors.push(error));const dom=new JSDOM(html,{url:'https://seiri.test/index.html',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc}),w=dom.window;
 Object.assign(w,{indexedDB:idb,structuredClone,Blob,File});Object.defineProperty(w.crypto,'randomUUID',{value:crypto.randomUUID});
 Object.defineProperty(w.HTMLElement.prototype,'innerText',{get(){return this.textContent;},set(value){this.textContent=value;}});
 w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});w.scrollTo=()=>{};w.confirm=()=>true;
 w.URL.createObjectURL=()=> 'blob:seiri-test';w.URL.revokeObjectURL=()=>{};
 w.HTMLElement.prototype.animate=function(){return{finished:Promise.resolve(),cancel(){}};};
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
 w.document.queryCommandState=()=>false;w.document.queryCommandValue=()=>'';w.document.execCommand=()=>true;
 w.FileReader=class{readAsDataURL(blob){blob.arrayBuffer().then(b=>{this.result='data:'+blob.type+';base64,'+Buffer.from(b).toString('base64');this.onload?.();}).catch(e=>this.onerror?.(e));}};
 w.ZamanDesktop={cloudAuthInfo:async()=>({ok:true,state:cloudState}),onCloudAuthChanged:fn=>{emit=fn;return()=>{};},cloudAuthSignIn:async()=>{calls.push('signin');return cloudChange({pending:true});},cloudAuthCancel:async()=>{calls.push('cancel');return cloudChange({pending:false});},cloudAuthRefresh:async()=>cloudChange({message:''}),cloudAuthSignOut:async()=>{calls.push('signout');return {...cloudChange({hasSession:false,verified:false,user:null,workspace:null}),revoked:false};},schedule:async()=>true,onDownload(){},onOpenEntry(){},onVaultLocked(){},vaultLock:async()=>{},vaultInfo:async()=>({ok:true,value:{ready:false}}),getInfo:async()=>({version:'1.14.0',delivered:[],login:false}),backupList:async()=>({items:backup.list(),keep:7,maxBytes:128*1024*1024}),backupCreate:async text=>backup.write(text),backupRead:async id=>backup.read(id),openExternal(url){w.lastExternal=url;},setLogin:async()=>{},test:async()=>{}};
 for(const [key,value]of Object.entries(seed))w.localStorage.setItem(key,value);
 const context=dom.getInternalVMContext();
 for(const script of [...w.document.scripts]){const source=script.getAttribute('src');const code=source?fs.readFileSync(new URL(source.slice(1),root),'utf8'):script.textContent;new vm.Script(code,{filename:source||'boot.js'}).runInContext(context);}
 await new Promise(resolve=>w.addEventListener('load',resolve,{once:true}));await wait(40);return{dom,w,context};
}
let fixture;
try{
 fixture=await boot({'seiri-tutorial-v1':'done'});const {w,context}=fixture,d=w.document;
 const before=w.localStorage.getItem('zaman-v1');
 vm.runInContext("openModernSettings('home')",context);assert(d.querySelector('[data-settings-tab="cloud"]'));d.querySelector('[data-settings-tab="cloud"]').click();await until(()=>d.getElementById('cloudSignIn')&&!d.getElementById('cloudSignIn').disabled);
 assert(d.getElementById('cloudAuthStatus').textContent.includes('giriş yapılmadı'));d.getElementById('cloudSignIn').click();await until(()=>d.getElementById('cloudCancel')&&!d.getElementById('cloudCancel').disabled);assert.deepEqual(calls,['signin']);d.getElementById('cloudCancel').click();await until(()=>d.getElementById('cloudSignIn')&&!d.getElementById('cloudSignIn').disabled);
 cloudChange({hasSession:true,verified:true,user:{name:'<img src=x onerror=alert(1)>',email:'test@example.test'},workspace:{id:'ws-a',name:'Kişisel'}});assert(d.getElementById('cloudAuthStatus').textContent.includes('doğrulandı'));assert(!d.getElementById('drawerBody').querySelector('img'));assert(d.getElementById('drawerBody').textContent.includes('Hesaba özel alan'));
 vm.runInContext("renderModernDrawer('profile')",context);cloudChange({checking:true});assert(d.getElementById('drawerBody').querySelector('#cloudAuthStatus')===null,'Arka plan bildirimi başka ayarı değiştiremez');
 vm.runInContext("renderModernDrawer('cloud')",context);await until(()=>d.getElementById('cloudLogout'));cloudChange({checking:false});d.getElementById('cloudLogout').click();await until(()=>d.getElementById('cloudSignIn')&&!d.getElementById('cloudSignIn').disabled);assert(d.getElementById('cloudAuthError').textContent.includes('Sunucudaki çıkış'));assert.equal(w.localStorage.getItem('zaman-v1'),before);
 const version=cloudState.version;emit({...cloudState,version:version-1,hasSession:true,user:{email:'STALE'}});assert(!d.getElementById('drawerBody').textContent.includes('STALE'));
 assert.deepEqual(errors.map(e=>e.message),[]);console.log('PASS: Ayarlar hesap menüsü; giriş/iptal/doğrulama/çevrimdışı çıkış; HTML kaçışı; eski IPC yanıtı ve başka panel koruması; yerel notları değiştirmeme (simüle DOM).');
}finally{fixture?.dom.window.close();fs.rmSync(temp,{recursive:true,force:true});}
