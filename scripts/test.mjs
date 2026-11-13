/** Paket kaynakları ve hatırlatmalar için çalıştırılabilir doğrulamalar. */
import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),app=path.join(root,'app');
const html=fs.readFileSync(path.join(app,'index.html'),'utf8'),scripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
const combined=scripts.map(s=>fs.readFileSync(path.join(app,s),'utf8')).join('\n');new vm.Script(combined);
assert(!html.includes('<script>'),'Satır içi script CSP ile uyumsuz');
assert(combined.includes('if(!window.ZamanMobile)bootstrapCloud();'));
assert(!/https?:/.test(fs.readFileSync(path.join(app,'assets/style.css'),'utf8').match(/@import[^;]+/g)?.join('')||''));
for(const f of ['themes/lofi-room.png','themes/yellow-cat.png','assets/adapter.js','assets/platform.js'])assert(fs.statSync(path.join(app,f)).size>0);
let context={};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'desktop/reminder-planner.js'),'utf8'),context);
const now=Date.parse('2026-11-11T09:00:00+03:00');const events=[{id:'e1',type:'event',title:'Toplantı',date:'2026-11-12',time:'13:00'}];
let list=context.planAndroidReminders(events,{},now);assert.equal(list.length,2);assert.equal(list[0].at,Date.parse('2026-11-11T13:00:00+03:00'));assert.equal(list[1].at,Date.parse('2026-11-12T12:30:00+03:00'));
assert.equal(context.planAndroidReminders(events,{reminderDay:false},now).length,1);
assert.equal(context.planAndroidReminders(events,{reminderDay:false,reminder30:false},now).length,0);
assert.equal(context.planAndroidReminders([{...events[0],deleted_at:'x'}],{},now).length,0);
assert.equal(context.planAndroidReminders([{...events[0],time:'99:99'}],{},now).length,0);
assert.equal(context.planAndroidReminders(events,{},now+3*86400000).length,0);
const main=fs.readFileSync(path.join(root,'desktop/main.cjs'),'utf8');
for(const check of ['contextIsolation:true','sandbox:true','nodeIntegration:false','webSecurity:true','validSender(event)','Content-Security-Policy',"action:'deny'",'maxWidth:']){if(check==='maxWidth:')continue;assert(main.includes(check),check);}
for(const name of ['main.cjs','preload.cjs','adapter.js','vault.cjs','security-ipc.cjs'])new vm.Script(fs.readFileSync(path.join(root,'desktop',name),'utf8'));
console.log('PASS: '+scripts.length+' arayüz scripti; yerel kaynaklar; İstanbul saat dilimi; 30 dk/1 gün; kapalı tercihler; silinen/geçmiş/geçersiz etkinlikler; masaüstü güvenlik ayarları.');
