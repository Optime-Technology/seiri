/** Simüle DOM/masaüstü duman testi; fiziksel Windows veya görsel kabul testi değildir. */
import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import os from 'node:os';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{JSDOM,VirtualConsole}=require('jsdom'),{IDBFactory}=require('fake-indexeddb'),{createStore}=require('../desktop/backup-store.cjs');
const root=new URL('../app/',import.meta.url),html=fs.readFileSync(new URL('index.html',root),'utf8'),idb=new IDBFactory(),temp=fs.mkdtempSync(path.join(os.tmpdir(),'seiri-dom-')),backup=createStore(temp),errors=[];
const wait=ms=>new Promise(r=>setTimeout(r,ms));async function until(fn){for(let i=0;i<160;i++){if(fn())return;await wait(5);}assert.fail('DOM işlemi tamamlanmadı.');}
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
 w.ZamanDesktop={schedule:async()=>true,onDownload(){},onOpenEntry(){},onVaultLocked(){},vaultLock:async()=>{},vaultInfo:async()=>({ok:true,value:{ready:false}}),getInfo:async()=>({version:'1.13.0',delivered:[],login:false}),backupList:async()=>({items:backup.list(),keep:7,maxBytes:128*1024*1024}),backupCreate:async text=>backup.write(text),backupRead:async id=>backup.read(id),openExternal(){},setLogin:async()=>{},test:async()=>{}};
 w.localStorage.setItem('seiri-tutorial-v1','done');for(const [key,value]of Object.entries(seed))w.localStorage.setItem(key,value);
 const context=dom.getInternalVMContext();
 for(const script of [...w.document.scripts]){const source=script.getAttribute('src');const code=source?fs.readFileSync(new URL(source.slice(1),root),'utf8'):script.textContent;new vm.Script(code,{filename:source||'boot.js'}).runInContext(context);}
 await new Promise(resolve=>w.addEventListener('load',resolve,{once:true}));await wait(40);return{dom,w,context};
}
let first,second;
try{
 first=await boot();const w=first.w,d=w.document;
 assert.deepEqual([...d.querySelectorAll('[data-shell-page]')].map(b=>b.textContent),['Planım','Notlarım','Odak']);assert(!d.getElementById('dailyPlan').hidden);assert(!d.querySelector('[data-rail-page="teams"]'));
 d.querySelector('[data-shell-page="notes"]').click();await until(()=>d.querySelector('#studyNewNote'));
 assert.equal(d.querySelector('.notebookLogo strong').textContent,'Notlarım');assert.deepEqual([...d.querySelectorAll('[data-study-tab]')].map(b=>b.dataset.studyTab),['notes','flow','courses','templates','trash']);
 d.getElementById('studyNewNote').click();const form=d.getElementById('notePropertiesForm');assert(form);assert.equal(form.querySelectorAll('[required]').length,1);form.elements.title.value='Kurtarma denemesi';form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
 await until(()=>d.body.classList.contains('writingNote'));const noteId=vm.runInContext('editing',first.context);
 d.getElementById('entryBody').innerHTML='<p>Kapanıştan önceki ders notu.</p>';d.getElementById('entryBody').dispatchEvent(new w.Event('input',{bubbles:true}));await wait(180);
 // 850 ms ana kayıt gecikmesinden önce uygulama kapanır; ayrı taslak kalmalı.
 const seed=Object.fromEntries(Array.from({length:w.localStorage.length},(_,i)=>{const k=w.localStorage.key(i);return[k,w.localStorage.getItem(k)];}));first.dom.window.close();first=null;
 second=await boot(seed);const x=second.w,doc=x.document;doc.querySelector('[data-shell-page="notes"]').click();await until(()=>doc.querySelector('[data-recover-draft]'));
 const recovery=[...doc.querySelectorAll('[data-recover-draft]')].find(b=>b.dataset.recoverDraft===noteId);assert(recovery);recovery.click();await until(()=>doc.body.classList.contains('writingNote'));assert(doc.getElementById('entryBody').textContent.includes('Kapanıştan önceki ders notu.'));
 assert(await x.ZamanStudy.saveCurrent());doc.getElementById('writerReturn').click();await until(()=>!doc.body.classList.contains('writingNote'));
 doc.querySelector('[data-shell-page="focus"]').click();await until(()=>doc.querySelector('[data-study-tab="stats"]'));assert.equal(doc.querySelector('.notebookLogo strong').textContent,'Odak');assert(!doc.querySelector('[data-study-tab="checklists"]'));
 await x.SeiriShell.openPlan('today');assert(!doc.getElementById('dailyPlan').hidden);doc.querySelector('[data-open-study="checklists"]').click();await until(()=>doc.querySelector('[data-new-checklist]'));assert.equal(doc.querySelector('.notebookLogo strong').textContent,'Planım');
 await vm.runInContext("openModernSettings('data')",second.context);await until(()=>doc.querySelector('[data-backup-now]'));doc.querySelector('[data-backup-now]').click();await until(()=>backup.list().length>0);assert(JSON.parse(backup.read(backup.list()[0].id)).entries.some(n=>n.id===noteId));
 const originalBackupId=backup.list()[0].id;
 doc.getElementById('settingsDrawer').close();doc.querySelector('[data-shell-page="notes"]').click();await until(()=>doc.querySelector('#studyWorkspace .notebookOpen'));doc.querySelector('#studyWorkspace .notebookOpen').click();await until(()=>doc.body.classList.contains('writingNote'));doc.getElementById('writerDelete').click();await until(()=>!doc.body.classList.contains('writingNote'));assert(JSON.parse(x.localStorage.getItem('zaman-v1')).entries.find(e=>e.id===noteId).deletedAt);
 await vm.runInContext("openModernSettings('data')",second.context);await until(()=>doc.querySelector('[data-backup-restore="'+originalBackupId+'"]'));await doc.querySelector('[data-backup-restore="'+originalBackupId+'"]').onclick();await until(()=>JSON.parse(x.localStorage.getItem('zaman-v1')).entries.some(e=>e.id===noteId&&!e.deletedAt));
 assert.deepEqual(errors.map(e=>e.message),[]);
 console.log('PASS: simüle DOM’da üç alan, sadece başlıkla tam sayfa not, kapanış sonrası gerçek IndexedDB taslak kurtarma, Odak/Planım alt gezinmesi yerel yedek düğmesi ve silinen notu gerçek geri yükleme akışıyla kurtarma. Fiziksel Windows/görsel test değildir.');
}finally{first?.dom.window.close();second?.dom.window.close();fs.rmSync(temp,{recursive:true,force:true});}
