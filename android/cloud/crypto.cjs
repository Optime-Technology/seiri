'use strict';
const {Buffer}=require('buffer');
module.exports={randomUUID:()=>globalThis.crypto.randomUUID(),createHash:algorithm=>{if(algorithm!=='sha256')throw Error('Özet algoritması geçersiz.');const parts=[];return{update(v){parts.push(typeof v==='string'?Buffer.from(v,'utf8'):Buffer.from(v));return this;},digest(format){const h=globalThis.SeiriDevice.hash(Buffer.concat(parts).toString('base64'));if(!/^[a-f0-9]{64}$/.test(h))throw Error('Dosya özeti hesaplanamadı.');return format==='hex'?h:Buffer.from(h,'hex');}};}};
