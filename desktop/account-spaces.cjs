'use strict';
/** Chromium partition'ı; dosyalar, taslaklar, geçmiş, kasa ve yedekler hesaplar arasında paylaşılmaz. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function atomicJSON(file,value){fs.mkdirSync(path.dirname(file),{recursive:true,mode:0o700});const tmp=file+'.'+crypto.randomBytes(8).toString('hex')+'.tmp';let fd;try{fd=fs.openSync(tmp,'wx',0o600);fs.writeFileSync(fd,JSON.stringify(value));fs.fsyncSync(fd);fs.closeSync(fd);fd=undefined;fs.renameSync(tmp,file);}catch(e){if(fd!==undefined)try{fs.closeSync(fd);}catch{}try{fs.unlinkSync(tmp);}catch{}throw e;}}
function readJSON(file,fallback){try{const s=fs.lstatSync(file);if(!s.isFile()||s.isSymbolicLink()||s.size>32*1024*1024)throw Error();return JSON.parse(fs.readFileSync(file,'utf8'));}catch(e){if(e.code==='ENOENT')return fallback;throw Error('Yerel hesap kaydı okunamadı; üzerine yazılmadı.');}}
function createSpaces(root){
 const device=Object.freeze({kind:'device',userId:null,workspaceId:null,label:'Bu bilgisayar',partition:undefined,root});
 function file(id){if(!UUID.test(id))throw Error('Geçersiz hesap kimliği.');return path.join(root,'Seiri Accounts',id.toLowerCase(),'space.json');}
 function load(id){const v=readJSON(file(id),null);if(!v||v.userId!==id||!UUID.test(v.workspaceId))return null;return {...v,kind:'account',partition:'persist:seiri-user-'+id,root:path.dirname(file(id))};}
 function bind(identity,workspace){if(!UUID.test(identity?.id)||!UUID.test(workspace?.id))throw Error('Hesap doğrulanamadı.');const old=load(identity.id);if(old&&old.workspaceId!==workspace.id)throw Error('Kişisel alan değişmiş; yerel veriler korunuyor.');const value={userId:identity.id,workspaceId:workspace.id,label:identity.email||'Google hesabı'};atomicJSON(file(identity.id),value);return load(identity.id);}
 function select(space){atomicJSON(path.join(root,'active-space.json'),{userId:space.userId});}
 function restore(identity){const v=readJSON(path.join(root,'active-space.json'),null);return identity?.id&&v?.userId===identity.id?load(identity.id)||device:device;}
 return Object.freeze({device,load,bind,select,restore});
}
module.exports={createSpaces,atomicJSON,readJSON,UUID};
