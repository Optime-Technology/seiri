'use strict';
/** Yerel JSON yedeklerini atomik yazar; tamamlanmamış dosyaları döngüye katmaz. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const MAX_BYTES=128*1024*1024,KEEP=7;
const allowed=/^seiri-\d{13}-[a-f0-9]{16}\.json$/;
function createStore(directory,{io=fs,now=Date.now}={}){
 function ready(){io.mkdirSync(directory,{recursive:true,mode:0o700});}
 function list(){ready();return io.readdirSync(directory).filter(name=>allowed.test(name)).flatMap(id=>{const stat=io.lstatSync(path.join(directory,id));return stat.isFile()&&!stat.isSymbolicLink()?[{id,size:stat.size,createdAt:Number(id.split('-')[1])}]:[];}).sort((a,b)=>b.createdAt-a.createdAt||b.id.localeCompare(a.id));}
 function validate(text){if(typeof text!=='string'||Buffer.byteLength(text)>MAX_BYTES)throw Error('Yerel yedek 128 MB sınırını aşıyor. Dışa aktarmayı kullan.');const value=JSON.parse(text);if(!value||!Array.isArray(value.entries)||!Array.isArray(value.categories)||!value.quick||typeof value.quick!=='object'||!Array.isArray(value.files))throw Error('Geçersiz yedek.');return value;}
 function write(text){validate(text);ready();const id='seiri-'+String(now()).padStart(13,'0')+'-'+crypto.randomBytes(8).toString('hex')+'.json',target=path.join(directory,id),temp=target+'.tmp';let fd;
  try{fd=io.openSync(temp,'wx',0o600);io.writeFileSync(fd,text,'utf8');io.fsyncSync(fd);io.closeSync(fd);fd=undefined;io.renameSync(temp,target);}catch(error){if(fd!==undefined)try{io.closeSync(fd);}catch{}try{io.unlinkSync(temp);}catch{}throw error;}
  // Yeni kopya tamamlanmadan eski kopyalara dokunulmaz.
  const warnings=[];for(const old of list().slice(KEEP)){try{io.unlinkSync(path.join(directory,old.id));}catch{warnings.push('Eski bir yedek temizlenemedi.');}}
  return {id,warnings};
 }
 function read(id){if(typeof id!=='string'||!allowed.test(id))throw Error('Geçersiz yedek kimliği.');const file=path.join(directory,id),stat=io.lstatSync(file);if(!stat.isFile()||stat.isSymbolicLink()||stat.size>MAX_BYTES)throw Error('Yedek açılamadı.');const text=io.readFileSync(file,'utf8');validate(text);return text;}
 return Object.freeze({list,write,read,keep:KEEP,maxBytes:MAX_BYTES});
}
module.exports={createStore,MAX_BYTES,KEEP};
