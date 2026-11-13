/** Oynatma iptali, fade, ses eğrisi ve odak kesintisini gerçek denetleyicide dener. */
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const callbacks={},timers=[],contexts=[];let fail=false,resolveDecode;
class Context{constructor(){this.sampleRate=48000;this.currentTime=3;this.state='running';this.ramps=[];contexts.push(this);}resume(){this.state='running';return Promise.resolve();}suspend(){this.state='suspended';return Promise.resolve();}close(){this.state='closed';return Promise.resolve();}decodeAudioData(){return fail?Promise.reject(Error('bozuk')):resolveDecode?new Promise(r=>resolveDecode=r):Promise.resolve({duration:120});}createGain(){const self=this;return{gain:{value:0,cancelAndHoldAtTime:()=>{},linearRampToValueAtTime:(gain,at)=>self.ramps.push({gain,at})},connect(){}};}createBufferSource(){return this.source={connect(){},start(){this.started=true;}};} }
const document={hidden:false,addEventListener:(type,fn)=>callbacks[type]=fn};const window={AudioContext:Context,addEventListener:(type,fn)=>callbacks[type]=fn};
const ctx={window,document,Map,Math,Number,Object,Promise,Error,fetch:async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(4)}),setTimeout:(fn,ms)=>{assert.equal(ms,1500);timers.push(fn);}};
vm.runInNewContext(fs.readFileSync(new URL('../web/ui/sound-engine.js',import.meta.url),'utf8'),ctx);const audio=window.FocusAudio;
assert.equal(audio.volumeGain(0),0);assert.equal(audio.volumeGain(100),1);assert(audio.volumeGain(50)<.1);
assert(await audio.start('brown',50));assert(contexts.at(-1).source.loop);assert.equal(contexts.at(-1).source.loopEnd,120);assert.equal(contexts.at(-1).ramps.at(-1).at,4.5);
let stop=audio.stop();assert.equal(contexts.at(-1).ramps.at(-1).gain,0);assert.notEqual(contexts.at(-1).state,'closed');timers.shift()();await stop;assert.equal(contexts.at(-1).state,'closed');
assert(await audio.start('rain',100));let pause=audio.pause();timers.shift()();await pause;assert.equal(contexts.at(-1).state,'suspended');await audio.resume();assert.equal(contexts.at(-1).state,'running');assert.equal(contexts.at(-1).ramps.at(-1).gain,1);
// Eski fade-out biterken başlayan yeni ses kapatılmamalı.
stop=audio.stop();await audio.start('brown',80);timers.shift()();await stop;assert.equal(contexts.at(-1).state,'running');
fail=true;await assert.rejects(()=>audio.start('rain',40));assert.equal(contexts.at(-1).state,'closed');
console.log('PASS: logaritmik ses eğrisi, 120 sn loop, 1.5 sn fade, duraklat/devam, eski durdurmanın yeni sesi kapatmaması, decode hatası temizliği.');
