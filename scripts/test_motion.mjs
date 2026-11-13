/** Hareket azaltma tercihi ve hızlı animasyon iptalini gerçek modülde dener. */
import vm from 'node:vm';import fs from 'node:fs';import assert from 'node:assert/strict';
let reduced=false,change,frames,options,cancels=0;
class Dialog{showModal(){}close(){}}
const document={documentElement:{dataset:{}},readyState:'loading',addEventListener(){},querySelectorAll(){return[];}};
const context={window:{},document,HTMLDialogElement:Dialog,matchMedia:()=>({get matches(){return reduced;},addEventListener:(_,fn)=>change=fn}),Map,Object,Promise};
vm.runInNewContext(fs.readFileSync(new URL('../web/ui/motion.js',import.meta.url),'utf8'),context);
const motion=context.window.FocusMotion,el={isConnected:true,animate:(f,o)=>{frames=f;options=o;return{finished:new Promise(()=>{}),cancel:()=>cancels++};}};
motion.enter(el);assert(frames[0].transform);assert.equal(options.duration,280);motion.enter(el);assert.equal(cancels,1);
reduced=true;change();assert.equal(cancels,2);motion.enter(el);assert.equal(options.duration,150);assert(frames.every(f=>!('transform'in f)));motion.cancel(el);
assert.equal(motion.values.staggerLimit,8);assert(motion.values.stagger<=40);for(const [key,value]of Object.entries(motion.values))if(typeof value==='number'&&!['rocketDescent','introFlight','introMin','introTimeout'].includes(key))assert(value<=400);assert(motion.values.rocketDescent>motion.values.rocketAscent);assert(motion.values.introTimeout<=3500);
console.log('PASS: hızlı yeniden giriş eski animasyonu iptal eder; reduce motion yalnızca opaklık/150 ms; temel süreler <=400 ms, roketin inişi kalkıştan yavaş, intro süre sınırı; stagger 35 ms/ilk 8.');
