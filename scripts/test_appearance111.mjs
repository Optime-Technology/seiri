/** Üç görünümün gerçek seçim kodunu, eski tercihlerden geçişi ve yedek uyumunu sınar. */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const read=name=>fs.readFileSync(new URL('../web/ui/'+name,import.meta.url),'utf8');
class Element {
 constructor(){this.dataset={};this.attributes={};this.style={};this.buttons=[];this.focused=false;this.isConnected=true;}
 set innerHTML(value){this.html=value;this.buttons=[...value.matchAll(/<button\b([^>]+)>/g)].map(match=>{const button=new Element();for(const attr of match[1].matchAll(/([\w-]+)="([^"]*)"/g))button.attributes[attr[1]]=attr[2];return button;});}
 get innerHTML(){return this.html||'';}
 setAttribute(key,value){this.attributes[key]=value;}
 removeAttribute(key){delete this.attributes[key];}
 getAttribute(key){return this.attributes[key]??null;}
 querySelectorAll(selector){const name=selector.slice(1,-1);return this.buttons.filter(button=>name in button.attributes);}
 querySelector(selector){const match=selector.match(/^\[([\w-]+)="([^"]+)"\]$/);return match?this.buttons.find(button=>button.attributes[match[1]]===match[2]):null;}
 focus(){this.focused=true;}
 animate(){return{cancel(){}};}
}
const elements=new Map();
const element=id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id);};
const saved=new Map([['zaman-skin','playful']]);const notices=[];let reduced=false,theme='light';
const document={documentElement:{dataset:{skin:'playful',theme:'light'}},hidden:false,body:{append(){}},createElement:()=>new Element(),addEventListener(){},dispatchEvent(){}};
const context={window:{matchMedia:()=>({get matches(){return reduced;},addEventListener(){}}),addEventListener(){}},document,CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail;}},localStorage:{getItem:key=>saved.get(key)??null,setItem:(key,value)=>saved.set(key,value)},$:element,$$:()=>[],setTheme:value=>{theme=value;document.documentElement.dataset.theme=value;},page:'calendar',account:null,toast:text=>notices.push(text),goPage(){},showCloudPage(){},queueProfileSave(){},openModernSettings(){},esc:String,innerWidth:1400,innerHeight:900};
vm.createContext(context);vm.runInContext(read('appearance-model.js'),context);context.SeiriAppearance=context.window.SeiriAppearance;
vm.runInContext(read('themes.js'),context);
const run=script=>vm.runInContext(script,context);
assert.deepEqual(Array.from(context.SeiriAppearance.modes,mode=>mode.id),['seiri','lofi','academic']);
assert.equal(run('currentSkin()'),'seiri');assert.equal(saved.get('zaman-skin'),'seiri');
for(const old of ['classic','playful','linen','midnight','sakura','forest','garbage',null])assert.equal(context.SeiriAppearance.normalize(old),'seiri');
run("applyAppearance('lofi')");assert.equal(theme,'dark');assert.equal(run('currentSkin()'),'lofi');
run("setTheme('light')");assert.equal(theme,'dark','Lo-Fi yanlışlıkla aydınlık moda geçmemeli.');
run("applyAppearance('academic')");assert.equal(theme,'light');assert.equal(document.documentElement.dataset.motion,'off');
run("applyAppearance('seiri')");reduced=true;run('refreshThemeMotion()');assert.equal(document.documentElement.dataset.motion,'off');reduced=false;
context.page='settings';run('renderThemes()');let cards=element('#settingsPage').querySelectorAll('[data-skin-choice]');assert.equal(cards.length,3);
assert.equal(cards.filter(button=>button.getAttribute('aria-checked')==='true').length,1);
const selected=cards.find(button=>button.getAttribute('data-skin-choice')==='seiri');let prevented=false;selected.onkeydown({key:'ArrowRight',preventDefault(){prevented=true;}});assert(prevented);assert.equal(run('currentSkin()'),'lofi');
const focused=element('#settingsPage').querySelector('[data-skin-choice="lofi"]');assert(focused.focused,'Yeniden çizilen seçime odak geri dönmeli.');
focused.onkeydown({key:'End',preventDefault(){}});assert.equal(run('currentSkin()'),'academic');
assert.equal(context.SeiriAppearance.next('academic','ArrowRight'),'seiri');assert.equal(context.SeiriAppearance.next('seiri','ArrowLeft'),'academic');
for(const attribute of ['data-skin-choice','data-modern-theme','data-collection-theme']){
 const html=run('appearanceCards('+JSON.stringify(attribute)+')');assert.equal((html.match(/role="radio"/g)||[]).length,3);assert(!/Eğlenceli|Sakura|Keten|Orman|Modern/.test(html));
}
const studyContext=vm.createContext({window:{}});vm.runInContext(read('checklist-model.js'),studyContext);studyContext.SeiriChecklistModel=studyContext.window.SeiriChecklistModel;vm.runInContext(read('study-model.js')+';this.model=ZamanStudyModel;',studyContext);
const existing={settings:{premiumTheme:'sakura',background:true,volume:43},tasks:[{id:'keep',title:'Korunacak görev',createdAt:1700000000000}],checklists:[],sessions:[]};const before=JSON.stringify(existing);const migrated=studyContext.model.normalize(existing);
assert.equal(migrated.settings.premiumTheme,'none');assert.equal(migrated.settings.background,true);assert.equal(migrated.settings.volume,43);assert.equal(migrated.tasks[0].title,'Korunacak görev');assert.equal(JSON.stringify(existing),before);
const index=fs.readFileSync(new URL('../app/index.html',import.meta.url),'utf8');assert(index.indexOf('appearance-model.js')<index.indexOf('themes.js'));assert(index.includes('seiri-shell.js'));
assert(read('seiri-shell.js').includes("openModernSettings()"));
console.log('PASS: yalnızca Seiri/Lo-Fi/Akademik; eski tema tercihi geçişi; üç seçim yüzeyi; radyo/klavye ve odak; Lo-Fi gece kilidi; hareket azaltma; eski yedekte görev/arka plan korunumu.');
