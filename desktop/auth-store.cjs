'use strict';
/** SDK oturumu ve PKCE doğrulayıcısı yalnızca işletim sistemi şifrelemesiyle diske yazılır. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
function fault(code){const e=Error(code);e.code=code;return e;}
function createAuthStore(file,protector,{io=fs}={}){
 let data=null,chain=Promise.resolve();
 const run=fn=>{const next=chain.catch(()=>{}).then(fn);chain=next;return next;};
 async function available(){try{return !!await protector.available();}catch{return false;}}
 function stat(){if(!io.existsSync(file))return null;const s=io.lstatSync(file);if(!s.isFile()||s.isSymbolicLink()||s.size>1024*1024)throw fault('STORAGE_CORRUPT');return s;}
 async function load(){if(!await available())throw fault('STORAGE_UNAVAILABLE');if(data)return;if(!stat()){data={};return;}try{const outer=JSON.parse(io.readFileSync(file,'utf8'));if(outer.v!==1||typeof outer.ciphertext!=='string')throw Error();const parsed=JSON.parse(await protector.decrypt(Buffer.from(outer.ciphertext,'base64')));if(!parsed||Array.isArray(parsed)||typeof parsed!=='object'||Object.values(parsed).some(v=>typeof v!=='string'))throw Error();data=parsed;}catch{throw fault('STORAGE_CORRUPT');}}
 async function write(next,valid){if(!valid())return;if(Buffer.byteLength(JSON.stringify(next))>512*1024)throw fault('STORAGE_WRITE');let encrypted;try{encrypted=await protector.encrypt(JSON.stringify(next));}catch{throw fault('STORAGE_UNAVAILABLE');}if(!valid())return;const temp=file+'.'+crypto.randomBytes(8).toString('hex')+'.tmp';let fd;try{io.mkdirSync(path.dirname(file),{recursive:true,mode:0o700});stat();fd=io.openSync(temp,'wx',0o600);io.writeFileSync(fd,JSON.stringify({v:1,ciphertext:Buffer.from(encrypted).toString('base64')}),'utf8');io.fsyncSync(fd);io.closeSync(fd);fd=undefined;if(!valid()){io.unlinkSync(temp);return;}io.renameSync(temp,file);data=next;}catch{if(fd!==undefined)try{io.closeSync(fd);}catch{}try{io.unlinkSync(temp);}catch{}throw fault('STORAGE_WRITE');}}
 return Object.freeze({available,
  getItem:key=>run(async()=>{await load();return data[key]??null;}),
  setItem:(key,value,valid=()=>true)=>run(async()=>{if(!valid())return;await load();if(typeof key!=='string'||key.length>1000||typeof value!=='string')throw fault('STORAGE_WRITE');await write({...data,[key]:value},valid);}),
  removeItem:(key,valid=()=>true)=>run(async()=>{if(!valid())return;await load();const next={...data};delete next[key];await write(next,valid);}),
  clear:()=>run(async()=>{try{if(io.existsSync(file)){const s=io.lstatSync(file);if(!s.isFile()||s.isSymbolicLink())throw Error();io.unlinkSync(file);}data={};}catch{throw fault('STORAGE_WRITE');}})
 });
}
function electronProtector(safeStorage,platform=process.platform){return{
 available:async()=>{if(platform==='linux'&&safeStorage.getSelectedStorageBackend?.()==='basic_text')return false;return typeof safeStorage.isAsyncEncryptionAvailable==='function'?safeStorage.isAsyncEncryptionAvailable():safeStorage.isEncryptionAvailable();},
 encrypt:text=>typeof safeStorage.encryptStringAsync==='function'?safeStorage.encryptStringAsync(text):safeStorage.encryptString(text),
 decrypt:async bytes=>typeof safeStorage.decryptStringAsync==='function'?(await safeStorage.decryptStringAsync(bytes)).result:safeStorage.decryptString(bytes)
};}
module.exports={createAuthStore,electronProtector,fault};
