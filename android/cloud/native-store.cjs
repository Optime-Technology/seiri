'use strict';
/** Dosya yolları verilmez; Java yalnızca etkin hesabın iki sabit günlüğünü açar. */
const contextToken=JSON.parse(globalThis.SeiriDevice.bootstrap()).context;
function result(raw){const r=JSON.parse(raw);if(!r.ok)throw Error(r.message||'Cihaz alanı okunamadı.');return r.value;}
function readJSON(name,fallback){const value=result(globalThis.SeiriDevice.readData(name,contextToken));return value==='null'?fallback:JSON.parse(value);}
function atomicJSON(name,value){result(globalThis.SeiriDevice.writeData(name,JSON.stringify(value),contextToken));}
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
module.exports={readJSON,atomicJSON,UUID,result,contextToken};
