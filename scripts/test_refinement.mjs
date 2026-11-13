/** Vurgu sınırı ve arka plan silme işleminin hata/iptal durumları. */
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../web/ui/app.js',import.meta.url),'utf8');
const editor={nodeType:1,childNodes:[],contains:n=>n===editor||n===text||n===span},span={nodeType:1,tagName:'SPAN',parentElement:editor,style:{backgroundColor:'rgb(255, 223, 112)'},childNodes:[]},text={nodeType:3,parentElement:span};span.childNodes=[text];span.lastChild=text;editor.childNodes=[span];
const selection={rangeCount:1,isCollapsed:true,anchorNode:editor,anchorOffset:1};const context={window:{getSelection:()=>selection},$ :()=>editor,Node:{ELEMENT_NODE:1},Set,String};vm.createContext(context);
vm.runInContext(source.slice(source.indexOf('let highlightCaret=null;'),source.indexOf('// İmleci boyalı')),context);
assert(vm.runInContext('highlightIsActive()',context),'Boyalı span sonrasındaki imleç açık vurgu sayılır.');selection.anchorNode=text;selection.anchorOffset=5;assert(vm.runInContext('highlightIsActive()',context));
vm.runInContext('highlightCaret={node:window.getSelection().anchorNode,offset:5,active:false}',context);assert(!vm.runInContext('highlightIsActive()',context));selection.anchorOffset=4;assert(vm.runInContext('highlightIsActive()',context),'İmleç taşınınca eski geçici durum uygulanmamalı.');span.style.backgroundColor='transparent';assert(!vm.runInContext('highlightIsActive()',context));
const study=fs.readFileSync(new URL('../web/ui/study.js',import.meta.url),'utf8');const remove=study.slice(study.indexOf(' async function removeBackground()'),study.indexOf(' async function chooseBackground'));
let accepted=true,writeOK=true,deleteFails=false,deleted=0,revoked=0,rendered=0;const state={settings:{background:true}};
const ctx={state,confirm:()=>accepted,commit:fn=>{if(!writeOK)return false;fn(state);return true;},store:async(key,value,remove)=>{assert.equal(key,'background');assert.equal(remove,true);if(deleteFails)throw Error('disk');deleted++;},URL:{revokeObjectURL:()=>revoked++},applyStudyAppearance:()=>{},renderCollection:()=>rendered++,toast:()=>{}};vm.createContext(ctx);vm.runInContext("let backgroundURL='blob:test';"+remove,ctx);
accepted=false;await vm.runInContext('removeBackground()',ctx);assert.equal(deleted,0);assert(state.settings.background);
accepted=true;writeOK=false;await vm.runInContext('removeBackground()',ctx);assert.equal(deleted,0);
writeOK=true;deleteFails=true;await assert.rejects(()=>vm.runInContext('removeBackground()',ctx));assert(state.settings.background);assert.equal(revoked,0);
deleteFails=false;await vm.runInContext('removeBackground()',ctx);assert.equal(deleted,1);assert.equal(revoked,1);assert.equal(rendered,1);assert.equal(vm.runInContext('backgroundURL',ctx),'');assert(!state.settings.background);
console.log('PASS: vurgu imleç sınırı, geçici kapatma ve imleç taşıma; arka plan silmede iptal, tercih kayıt hatası, disk hatasında geri dönüş, başarılı silme ve URL temizliği.');
// Intro atlanınca önceki inert tercihleri aynı kalmalı; uygulama kilitlenmemeli.
const rocketSource=fs.readFileSync(new URL('../web/ui/rocket.js',import.meta.url),'utf8');let skip,removed=false,limit=0;
const main={tagName:'MAIN',inert:false,isConnected:true},locked={tagName:'ASIDE',inert:true,isConnected:true};
const sprite={},intro={tagName:'SECTION',isConnected:true,querySelector:selector=>selector==='.introRocket'?sprite:{addEventListener:(_event,fn)=>skip=fn},getAnimations:()=>[],contains:()=>false,remove:()=>removed=true};
const introDocument={getElementById:id=>id==='focusLaunchIntro'?intro:null,body:{children:[intro,main,locked]},addEventListener(){},activeElement:null};
const introWindow={addEventListener(){},FocusMotion:{values:{short:150},animate:()=>({finished:Promise.resolve()}),quiet:()=>false}};
vm.runInNewContext(rocketSource,{window:introWindow,document:introDocument,matchMedia:()=>({matches:false,addEventListener(){}}),performance:{now:()=>0},Map,Object,Promise,setTimeout:(_fn,ms)=>{limit=ms;return 1;},clearTimeout(){}});
assert(main.inert);assert(locked.inert);skip();await Promise.resolve();await Promise.resolve();await Promise.resolve();assert(removed);assert(!main.inert);assert(locked.inert);assert.equal(limit,3500);
assert(introWindow.FocusRocket.markup('a').includes('aBody'));assert(introWindow.FocusRocket.markup('b').includes('bBody'));
console.log('PASS: intro Atla uygulamayı açar; önceden kilitli alanın inert durumu korunur; 3.5 sn güvenli çıkış; SVG kimlikleri çakışmaz.');
