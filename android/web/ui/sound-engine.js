'use strict';
/** Sesler decode edilir ve tek AudioBufferSource ile boşluksuz döndürülür.
 * Üretim, LUFS ölçümü ve sabit seed: tools/generate_sounds.py.
 */
window.FocusAudio=(()=>{
 const FADE_SECONDS=1.5,MIN_DB=-48,cache=new Map();
 let context=null,gain=null,source=null,kind='',volume=35,wanted=false,revision=0,suspended=false;
 const curve=value=>value<=0?0:Math.pow(10,(MIN_DB+(Math.min(100,Math.max(0,value))/100)*-MIN_DB)/20);
 const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 function ramp(value){if(!context||!gain)return;const at=context.currentTime;gain.gain.cancelAndHoldAtTime(at);gain.gain.linearRampToValueAtTime(value,at+FADE_SECONDS);}
 async function release(){const old=context;context=null;gain=null;source=null;suspended=false;if(old&&old.state!=='closed')await old.close();}
 async function buffer(ctx,id){
  if(['brown','rain'].includes(id)){
   if(!cache.has(id))cache.set(id,fetch('/audio/'+id+'.ogg').then(r=>{if(!r.ok)throw Error('Ses dosyası açılamadı.');return r.arrayBuffer();}).catch(e=>{cache.delete(id);throw e;}));
   return ctx.decodeAudioData((await cache.get(id)).slice(0));
  }
  // Diğer ses seçenekleri korunur; sabit seed ve çevrimsel FFT yerine eski renk filtreleri.
  const length=ctx.sampleRate*16,b=ctx.createBuffer(1,length,ctx.sampleRate),x=b.getChannelData(0);let seed=937162,last=0,b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
  for(let i=0;i<length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const noise=seed/2147483648-1;if(id==='pink'||id==='ocean'){b0=.99886*b0+noise*.0555179;b1=.99332*b1+noise*.0750759;b2=.969*b2+noise*.153852;b3=.8665*b3+noise*.3104856;b4=.55*b4+noise*.5329522;b5=-.7616*b5-noise*.016898;x[i]=(b0+b1+b2+b3+b4+b5+b6+noise*.5362)*.011;b6=noise*.115926;}else if(id==='wind'){last=(last+.02*noise)/1.02;x[i]=last*.35;}else x[i]=noise*.08;}
  // Kısa çapraz geçiş, önceki seçeneklerin döngü kliklerini bastırır.
  const overlap=Math.floor(ctx.sampleRate*.1);for(let i=0;i<overlap;i++){const w=.5-.5*Math.cos(Math.PI*i/(overlap-1));x[length-overlap+i]=x[length-overlap+i]*(1-w)+x[i]*w;}
  return b;
 }
 async function start(id,value){
  wanted=true;kind=id;volume=value;const token=++revision;await release();if(token!==revision||!wanted)return false;
  const ctx=new (window.AudioContext||window.webkitAudioContext)();context=ctx;ctx.onstatechange=()=>{if(context===ctx&&ctx.state==='interrupted')suspended=true;};
  try{await ctx.resume();const decoded=await buffer(ctx,id);if(token!==revision||!wanted){if(ctx.state!=='closed')await ctx.close();return false;}
   source=ctx.createBufferSource();source.buffer=decoded;source.loop=true;source.loopStart=0;source.loopEnd=decoded.duration;gain=ctx.createGain();gain.gain.value=0;
   if(['ocean','wind','pink'].includes(id)){const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=id==='wind'?420:id==='ocean'?1000:3500;source.connect(filter);filter.connect(gain);}else source.connect(gain);
   gain.connect(ctx.destination);source.start();ramp(curve(volume));if(document.hidden)await pause();return true;
  }catch(error){if(token===revision){wanted=false;await release();}throw error;}
 }
 async function stop(){wanted=false;const token=++revision;if(!context)return;ramp(0);await sleep(FADE_SECONDS*1000);if(token===revision)await release();}
 async function pause(){if(!context||suspended)return;suspended=true;const ctx=context,token=revision;ramp(0);await sleep(FADE_SECONDS*1000);if(token===revision&&suspended&&ctx.state!=='closed')await ctx.suspend();}
 async function resume(){if(!wanted||!context||!suspended||document.hidden)return;suspended=false;await context.resume();ramp(curve(volume));}
 function setVolume(value){volume=Math.max(0,Math.min(100,Number(value)||0));if(!suspended)ramp(curve(volume));}
 document.addEventListener('visibilitychange',()=>{(document.hidden?pause():resume()).catch(()=>{});});
 window.addEventListener('blur',()=>pause().catch(()=>{}));window.addEventListener('focus',()=>resume().catch(()=>{}));
 // Electron veya ilerideki mobil köprü, ses odağı/arama kesintisini aynı protokolle iletir.
 window.addEventListener('focusflow-audio-interruption',e=>{(e.detail?.paused?pause():resume()).catch(()=>{});});
 window.addEventListener('pagehide',()=>{wanted=false;++revision;release().catch(()=>{});});
 return Object.freeze({start,stop,pause,resume,setVolume,volumeGain:curve,fadeSeconds:FADE_SECONDS});
})();
