'use strict';
/** Marka roketi, hızlı araçlar ve açılış sahnesi. Çizim uygulamanın kendi SVG varlığıdır. */
window.FocusRocket=(()=>{
 const markup=prefix=>`<svg class="brandRocket" viewBox="0 0 64 96" fill="none" aria-hidden="true"><defs><linearGradient id="${prefix}Body" x1="16" x2="47" y2="50" gradientUnits="userSpaceOnUse"><stop stop-color="#b97625"/><stop offset=".42" stop-color="#ffe7a0"/><stop offset=".72" stop-color="#e9b24d"/><stop offset="1" stop-color="#b76d24"/></linearGradient><linearGradient id="${prefix}Fire" x1="32" y1="67" x2="32" y2="95" gradientUnits="userSpaceOnUse"><stop stop-color="#ffe4a1"/><stop offset=".55" stop-color="#eab256"/><stop offset="1" stop-color="#dc8956" stop-opacity="0"/></linearGradient></defs><path class="rocketFlame" d="M25 65Q22 82 32 95Q42 82 39 65Z" fill="url(#${prefix}Fire)"/><path d="M21 42Q6 51 7 70L22 64ZM43 42Q58 51 57 70L42 64Z" fill="#c28c3f"/><path d="M32 3C17 17 16 33 19 58L24 69H40L45 58C48 33 47 17 32 3Z" fill="url(#${prefix}Body)"/><path d="M32 3Q23 15 21 26Q32 30 43 26Q41 15 32 3Z" fill="#f5cf79"/><circle cx="32" cy="38" r="9" fill="#b57d31"/><circle cx="32" cy="38" r="6.5" fill="#252b43"/><circle cx="30" cy="36" r="2" fill="#b0c7d1" fill-opacity=".8"/><path d="M26 68H38L40 74H24Z" fill="#766044"/><path d="M32 50L35 65L32 79L29 65Z" fill="#a97732"/></svg>`;
 const timings=()=>window.FocusMotion.values;
 const quiet=()=>window.FocusMotion?.quiet()??matchMedia('(prefers-reduced-motion: reduce)').matches;
 let dock,button,menu,rocket,opened=false,revision=0;
 function setOpen(next,{focus=false}={}){
  if(!dock||next===opened)return;opened=next;const token=++revision;
  button.setAttribute('aria-expanded',String(next));button.setAttribute('aria-label',next?'Hızlı araçları kapat':'Hızlı araçları aç');
  dock.classList.toggle('dockOpen',next);dock.classList.toggle('isLaunching',next);dock.classList.toggle('isLanding',!next);
  const current=getComputedStyle(rocket).transform,target=quiet()?'none':next?'translate3d(0,-112px,0) scale(.84)':'translate3d(0,0,0) scale(1)';
  rocket.style.transform=target;
  const flight=window.FocusMotion.animate(rocket,[{transform:current==='none'?'translate3d(0,0,0) scale(1)':current,opacity:1},{transform:target,opacity:1}],next?timings().rocketAscent:timings().rocketDescent);
  if(flight)flight.finished.catch(()=>{}).finally(()=>{if(token===revision)dock.classList.remove('isLaunching','isLanding');});
  if(next){menu.hidden=false;window.FocusMotion.enter(menu,timings().medium);}
  else{window.FocusMotion.cancel(menu);menu.hidden=true;if(focus)button.focus({preventScroll:true});}
 }
 function installDock(){
  dock=document.querySelector('.rocketDock');if(!dock)return;button=document.getElementById('rocketLauncher');menu=document.getElementById('rocketMenu');rocket=dock.querySelector('.dockRocket');
  button.addEventListener('click',()=>setOpen(!opened));
  dock.addEventListener('click',event=>{if(event.target.closest('#rocketMenu button'))setOpen(false);});
  document.addEventListener('pointerdown',event=>{if(opened&&!dock.contains(event.target))setOpen(false);});
  document.addEventListener('keydown',event=>{if(!dock.contains(document.activeElement))return;
   const items=[...menu.querySelectorAll('button:not([disabled])')];
   if(event.key==='Escape'&&opened){event.preventDefault();event.stopPropagation();setOpen(false,{focus:true});}
   else if(['ArrowUp','ArrowDown','Home','End'].includes(event.key)){event.preventDefault();if(!opened)setOpen(true);let i=items.indexOf(document.activeElement);i=event.key==='Home'?0:event.key==='End'?items.length-1:(i+(event.key==='ArrowDown'?1:-1)+items.length)%items.length;items[i]?.focus();}
  },true);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)setOpen(false);});
 }
 // Gerçek yükleme tamamlanmadan yüzdeli sahte bir sayaç gösterilmez.
 const intro=document.getElementById('focusLaunchIntro'),priorInert=new Map();let finished=false,ready=false,createdAt=performance.now(),timeout;
 function freeze(){if(!intro||finished)return;for(const el of document.body.children)if(el!==intro&&!['SCRIPT','STYLE'].includes(el.tagName)&&!priorInert.has(el)){priorInert.set(el,el.inert);el.inert=true;}}
 function finish(){if(finished)return;finished=true;clearTimeout(timeout);if(!intro)return;intro.getAnimations?.().forEach(a=>a.cancel());const restore=()=>{for(const[el,value]of priorInert)if(el.isConnected)el.inert=value;const focused=intro.contains(document.activeElement);intro.remove();if(focused)document.getElementById('rocketLauncher')?.focus({preventScroll:true});};if(!window.FocusMotion){restore();return;}const fade=window.FocusMotion.animate(intro,[{opacity:1},{opacity:0}],timings().short);if(fade)fade.finished.catch(()=>{}).finally(restore);else restore();}
 if(intro){intro.querySelector('.introRocket').innerHTML=markup('intro');freeze();intro.querySelector('#skipLaunchIntro').addEventListener('click',finish);}
 async function loaded(){installDock();if(!intro||finished)return;freeze();ready=true;intro.dataset.ready='true';intro.querySelector('.launchState').textContent='Hazır';
  if(quiet()){finish();return;}
  intro.querySelector('.introRocket').style.transform='translate3d(0,-180px,0) scale(.7)';intro.classList.add('introFlying');
  const flight=window.FocusMotion.animate(intro.querySelector('.introRocket'),[{transform:'translate3d(0,0,0) scale(1)',opacity:1},{transform:'translate3d(0,-180px,0) scale(.7)',opacity:0}],timings().introFlight);
  await Promise.all([flight?.finished.catch(()=>{}),new Promise(resolve=>setTimeout(resolve,Math.max(0,timings().introMin-(performance.now()-createdAt))))]);finish();
 }
 window.addEventListener('load',()=>{loaded().catch(finish);});
 // Başka bir kaynak yüklenemese bile uygulama intro arkasında kilitli kalmaz.
 timeout=setTimeout(finish,3500);
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&ready)finish();});
 matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',event=>{if(event.matches)finish();});
 return Object.freeze({markup});
})();
