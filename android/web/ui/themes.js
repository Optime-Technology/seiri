"use strict";
/** Seiri, Lo-Fi ve Akademik: üç görünüm, ortak seçim ve erişilebilir gezinme. */
const appearanceModes=SeiriAppearance.modes.map(mode=>mode.id);
const appearanceNames=Object.fromEntries(SeiriAppearance.modes.map(mode=>[mode.id,mode.name]));
const reduceMotionQuery=window.matchMedia('(prefers-reduced-motion: reduce)');
let themeMotionPreference=true,catJourney=null;
try{themeMotionPreference=localStorage.getItem('zaman-motion')!=='0'}catch{}
const themeAmbient=document.createElement('div');themeAmbient.id='themeAmbient';themeAmbient.setAttribute('aria-hidden','true');themeAmbient.innerHTML='<div id="themeCat"><div class="catStep"><img src="/themes/yellow-cat.png" alt="" width="100" height="67" draggable="false"></div></div>';document.body.append(themeAmbient);
function currentSkin(){return SeiriAppearance.normalize(document.documentElement.dataset.skin)}
function getAppearancePreference(){return {themeMode:currentSkin(),themeAnimations:themeMotionPreference}}
function effectiveThemeMotion(){return themeMotionPreference&&!reduceMotionQuery.matches&&!document.hidden&&currentSkin()!=='academic'}
function persistAppearance(){try{localStorage.setItem('zaman-skin',currentSkin());localStorage.setItem('zaman-motion',themeMotionPreference?'1':'0')}catch{toast('Tema bu oturumda açık; tercihin kaydedilemedi.')}}
const originalSetTheme=setTheme;
setTheme=function(theme){if(currentSkin()==='lofi')theme='dark';originalSetTheme(theme);if(currentSkin()==='lofi'){$('#themeToggle').innerHTML='☾ <span>Lo-Fi · Gece</span>';$('#themeToggle').setAttribute('aria-label','Lo-Fi tema ayarlarını aç');$('#themeToggle').removeAttribute('title')}};
$('#themeToggle').onclick=()=>{if(currentSkin()==='lofi')openModernSettings('appearance');else setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark')};
function applyAppearance(mode,{persist=true,sync=false,announce=false}={}){
 mode=SeiriAppearance.normalize(mode);const changed=currentSkin()!==mode;
 document.documentElement.dataset.skin=mode;
 if(mode==='lofi')setTheme('dark');else if(changed&&mode==='academic')setTheme('light');else setTheme(document.documentElement.dataset.theme==='dark'?'dark':'light');
 refreshThemeMotion();if(persist)persistAppearance();
 if(page==='settings')renderThemes();if(sync&&account)queueProfileSave();
 document.dispatchEvent(new CustomEvent('seiri:appearance',{detail:{mode}}));
 if(announce)toast(appearanceNames[mode]+' görünümü seçildi.');
}
function syncAppearanceFromProfile(settings){if(!settings||settings.themeMode===undefined)return;themeMotionPreference=settings.themeAnimations!==false;applyAppearance(settings.themeMode,{sync:false,announce:false})}
const beforeThemeGoPage=goPage;
goPage=function(p){if(p==='settings'){showThemeSettings();return}$('#settingsPage').hidden=true;beforeThemeGoPage(p)};
function showThemeSettings(){page='settings';for(const id of ['calendar','journal','special','teams','account'])$('#'+id+'Page').hidden=true;$('#settingsPage').hidden=false;$('.overview').hidden=true;$$('.nav').forEach(b=>b.classList.toggle('active',b.dataset.page==='settings'));$('#crumb').textContent='Ayarlar / Temalar';$('#pageTitle').textContent='Temalar';$('#pageSubtitle').textContent='';$('#createBtn').hidden=true;$('#workspaceBanner').hidden=true;renderThemes()}
const themePageGoPage=goPage;
goPage=function(p){const previousPage=page;$('.overview').hidden=p==='settings';$('#createBtn').hidden=p==='settings';if(p!=='settings')$('#workspaceBanner').hidden=!activeTeamId;themePageGoPage(p);if(p!==previousPage)window.scrollTo(0,0)};
const originalShowCloudPage=showCloudPage;
showCloudPage=function(p){$('.overview').hidden=false;$('#createBtn').hidden=false;$('#workspaceBanner').hidden=!activeTeamId;originalShowCloudPage(p);window.scrollTo(0,0)};

function appearanceCards(attribute='data-skin-choice'){
 const skin=currentSkin();return SeiriAppearance.modes.map(mode=>'<button type="button" class="appearanceCard '+(skin===mode.id?'isSelected':'')+'" role="radio" aria-checked="'+(skin===mode.id)+'" tabindex="'+(skin===mode.id?'0':'-1')+'" '+attribute+'="'+mode.id+'"><span class="appearancePreview '+mode.id+'" aria-hidden="true">'+(mode.id==='lofi'?'<img src="/themes/lofi-room.png" alt=""><img class="appearanceCat" src="/themes/yellow-cat.png" alt="">':mode.id==='academic'?'<b>Aa</b><i></i><i></i>':'<b>Seiri</b><span class="sampleNote"><i></i><i></i><i></i></span>')+'</span><span class="appearanceCardText"><strong>'+mode.name+'</strong><small>'+mode.description+'</small></span><span class="appearanceCheck" aria-hidden="true">'+(skin===mode.id?'✓':'')+'</span></button>').join('');
}
function bindAppearanceCards(root,attribute='data-skin-choice',after=()=>{}){
 root.querySelectorAll('['+attribute+']').forEach(button=>{
  const choose=id=>{applyAppearance(id,{sync:true,announce:true});after();root.querySelector('['+attribute+'="'+id+'"]')?.focus({preventScroll:true});};
  button.onclick=()=>choose(button.getAttribute(attribute));
  button.onkeydown=event=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;event.preventDefault();choose(SeiriAppearance.next(button.getAttribute(attribute),event.key));};
 });
}
function renderThemes(){
 const root=$('#settingsPage');root.innerHTML='<div class="appearanceHeading"><h2>Görünüm</h2></div><div class="appearanceCards" role="radiogroup" aria-label="Görünüm paketi">'+appearanceCards()+'</div><label class="modernSwitchRow"><span><strong>Hareketli detaylar</strong></span><input id="themeMotionSwitch" type="checkbox" role="switch" aria-label="Hareketli tema detayları" '+(themeMotionPreference?'checked':'')+' '+(currentSkin()==='academic'?'disabled':'')+'></label>';
 bindAppearanceCards(root,'data-skin-choice',renderThemes);
 $('#themeMotionSwitch').onchange=event=>{themeMotionPreference=event.target.checked;persistAppearance();refreshThemeMotion();};
}
function startCatJourney(){catJourney?.cancel();catJourney=null;const cat=$('#themeCat');if(currentSkin()!=='lofi')return;const w=innerWidth,h=innerHeight,left=w<650?18:Math.min(245,w*.22),right=Math.max(20,w-108),bottom=Math.max(100,h-88),top=Math.min(105,h*.25);if(!effectiveThemeMotion()){cat.style.transform=`translate3d(${right}px,${bottom}px,0)`;return}cat.style.transform='';catJourney=cat.animate([{transform:`translate3d(${left}px,${bottom}px,0)`,offset:0},{transform:`translate3d(${right}px,${bottom}px,0)`,offset:.37},{transform:`translate3d(${right}px,${bottom}px,0)`,offset:.43},{transform:`translate3d(${right}px,${top}px,0)`,offset:.64},{transform:`translate3d(${right}px,${top}px,0)`,offset:.7},{transform:`translate3d(${right}px,${bottom}px,0)`,offset:.83},{transform:`translate3d(${left}px,${bottom}px,0)`,offset:1}],{duration:64000,iterations:Infinity,easing:'linear'})}

function refreshThemeMotion(){const running=effectiveThemeMotion();document.documentElement.dataset.motion=running?'on':'off';document.documentElement.dataset.uiMotion=themeMotionPreference?'on':'off';startCatJourney();}
window.addEventListener('resize',startCatJourney);
document.addEventListener('visibilitychange',refreshThemeMotion);
reduceMotionQuery.addEventListener('change',()=>{refreshThemeMotion();if(page==='settings')renderThemes()});
applyAppearance(document.documentElement.dataset.skin,{sync:false});
