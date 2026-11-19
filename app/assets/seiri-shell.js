'use strict';
/** Üç ana alan: Planım, Notlarım, Odak. Mevcut veri ve takvim işlemleri korunur. */
window.SeiriShell=(()=>{
 let planMode='today',ready=false;
 function area(){return page==='calendar'?'plan':page==='journal'?(window.ZamanStudy?.getArea()||'notes'):'plan';}
 async function navigate(route){if(window.ZamanStudy?.isWriting()&&!await window.ZamanStudy.closeWriter())return;
  if(route==='plan'){goPage('calendar');$('#pageTitle').textContent='Planım';}
  else window.ZamanStudy.openStudio(route==='focus'?'focus':'notes');refresh();
 }
 async function openPlan(mode){planMode=mode==='calendar'?'calendar':'today';await navigate('plan');}
 function dailyMarkup(){const entries=entriesOn(selected).filter(e=>e.type!=='note'),tasks=(window.ZamanStudy?.getPlannerTasks()||[]).filter(t=>!t.completedAt&&(!t.workDate||t.workDate===key(selected)));
  return '<div class="dailyPlanHead"><div><span class="eyebrow">'+esc(weekdays[mon(selected)])+'</span><h2>'+esc(fmt(selected))+'</h2></div><div><button class="outline" data-plan-date="prev" aria-label="Önceki gün">‹</button><button class="outline" data-plan-date="today">Bugün</button><button class="outline" data-plan-date="next" aria-label="Sonraki gün">›</button></div></div><div class="dailyPlanGrid"><section><div class="dailySectionTitle"><h3>Günün planı</h3><button class="outline" data-plan-add>Etkinlik ekle</button></div>'+ (entries.length?entries.map(e=>'<button class="dailyEvent" '+(e.type==='event'?'data-plan-entry="'+esc(e.id)+'"':'disabled')+'><time>'+esc(e.time||'Tüm gün')+'</time><span>'+(e.sensitive?'🔒 ':'')+esc(e.title)+'</span></button>').join(''):'<div class="quietEmpty"><span aria-hidden="true">▦</span><button class="outline" data-plan-add>Ekle</button></div>')+'</section><section><div class="dailySectionTitle"><h3>Görevler</h3><button class="outline" data-plan-tasks>Görevleri aç</button></div>'+ (tasks.length?tasks.slice(0,8).map(t=>'<div class="dailyTask"><button data-plan-complete="'+esc(t.id)+'" aria-label="'+esc(t.title)+' tamamla">○</button><span>'+esc(t.title)+'</span></div>').join(''):'<div class="quietEmpty"><span aria-hidden="true">✓</span><button class="outline" data-plan-tasks>Ekle</button></div>')+'<small class="dailyTaskCaption">Tarihsiz ve bekleyen görevler</small></section></div>';
 }
 function renderPlan(){const root=$('#dailyPlan');if(!root)return;const calendar=page==='calendar';$('#planNavigation').hidden=!calendar;root.hidden=!calendar||planMode!=='today';$('#calendarPage .calendarLayout').hidden=!calendar||planMode==='today';
  if(!calendar)return;$('#pageTitle').textContent='Planım';$('#crumb').textContent='Planım';
  $('#planNavigation').querySelectorAll('[data-plan-mode]').forEach(b=>{b.classList.toggle('active',b.dataset.planMode===planMode);b.setAttribute('aria-pressed',String(b.dataset.planMode===planMode));});
  if(planMode!=='today')return;root.innerHTML=dailyMarkup();root.querySelectorAll('[data-plan-add]').forEach(b=>b.onclick=()=>openEditor('event',null,key(selected)));
  root.querySelectorAll('[data-plan-entry]').forEach(b=>b.onclick=()=>{const item=data.entries.find(e=>e.id===b.dataset.planEntry);if(item)openEditor('event',item);});
  root.querySelectorAll('[data-plan-tasks]').forEach(b=>b.onclick=()=>window.ZamanStudy.openStudio('tasks'));
  root.querySelectorAll('[data-plan-complete]').forEach(b=>b.onclick=()=>{window.ZamanStudy.completeTask(b.dataset.planComplete);renderPlan();});
  root.querySelectorAll('[data-plan-date]').forEach(b=>b.onclick=()=>{selected=b.dataset.planDate==='today'?new Date(today):plus(selected,b.dataset.planDate==='prev'?-1:1);cursor=new Date(selected);render();});
 }
 function refresh(){if(!ready)return;const current=area();document.querySelectorAll('[data-shell-page]').forEach(button=>{const active=button.dataset.shellPage===current;button.classList.toggle('isActive',active);if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});renderPlan();}
 function init(){
  const header=document.querySelector('main>header');header.classList.add('seiriHeader');
  const brand=document.createElement('button');brand.type='button';brand.className='seiriWordmark';brand.setAttribute('aria-label','Seiri Planım alanına dön');brand.innerHTML='<span class="seiriBrandRocket" aria-hidden="true">'+window.FocusRocket.markup('header')+'</span><span>Seiri</span>';brand.onclick=()=>navigate('plan');
  const nav=document.createElement('nav');nav.className='seiriNavigation';nav.setAttribute('aria-label','Ana gezinme');nav.innerHTML=[['plan','calendar','Planım'],['notes','notes','Notlarım'],['focus','spark','Odak']].map(([id,icon,title])=>'<button type="button" data-shell-page="'+id+'">'+modernIcon(icon)+'<span>'+title+'</span></button>').join('');
  nav.querySelectorAll('[data-shell-page]').forEach(button=>button.onclick=()=>navigate(button.dataset.shellPage));header.prepend(brand,nav);
  const settings=document.createElement('button');settings.type='button';settings.className='seiriSettingsButton';settings.setAttribute('aria-label','Ayarları aç');settings.innerHTML=modernIcon('settings');settings.onclick=()=>openModernSettings();document.querySelector('.headerRight').append(settings);
  const tabs=document.createElement('nav');tabs.id='planNavigation';tabs.className='planNavigation';tabs.setAttribute('aria-label','Planım bölümleri');tabs.innerHTML='<button data-plan-mode="today">Günüm</button><button data-plan-mode="calendar">Takvim</button><button data-open-study="tasks">Görevler</button><button data-open-study="checklists">Listeler</button>';
  tabs.querySelectorAll('[data-plan-mode]').forEach(b=>b.onclick=()=>{planMode=b.dataset.planMode;renderPlan();});tabs.querySelectorAll('[data-open-study]').forEach(b=>b.onclick=()=>window.ZamanStudy.openStudio(b.dataset.openStudy));
  const daily=document.createElement('section');daily.id='dailyPlan';$('#calendarPage').prepend(tabs,daily);
  // Hazır olmayan hesap/ekip ekranlarına ait kullanıcıya açık geçişleri kaldır.
  document.querySelectorAll('[data-rail-page="teams"],.nav[data-page="teams"],.nav[data-page="account"]').forEach(b=>b.remove());
  const rocket=$('#rocketMenu');rocket.querySelectorAll('[data-rail-page]').forEach(b=>b.remove());
  const group=document.createElement('div');group.innerHTML=[['plan','calendar','Planım'],['notes','notes','Notlarım'],['focus','spark','Odak']].map(([route,icon,label])=>'<button class="railButton" data-quick-route="'+route+'">'+modernIcon(icon)+'<span>'+label+'</span></button>').join('');rocket.querySelector('.rocketMenuBrand').after(group);group.querySelectorAll('[data-quick-route]').forEach(b=>b.onclick=()=>navigate(b.dataset.quickRoute));
  $('#railNew').onclick=()=>openEditor(area()==='notes'?'note':'event');
  document.body.classList.add('seiriCanvas');ready=true;
  refresh();
 }
 document.addEventListener('DOMContentLoaded',init);
 return Object.freeze({refresh,openPlan,navigate,area});
})();
