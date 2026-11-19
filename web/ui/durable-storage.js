'use strict';
/** Son geçerli küçük veri kopyası; bozuk ana kaydı sessizce boş veriyle ezmez. */
window.SeiriStorage=(()=>{
 function load(storage,key,initial,valid=x=>!!x,transform=x=>x){let found=false;
  for(const name of [key,key+'-last-good']){let raw;try{raw=storage.getItem(name);}catch{return{value:initial(),blocked:true,recovered:false};}if(raw===null)continue;found=true;
   try{const value=JSON.parse(raw);if(!valid(value))continue;return{value:transform(value),blocked:false,recovered:name!==key};}catch{}
  }return{value:initial(),blocked:found,recovered:false};
 }
 function write(storage,key,value,valid=()=>true){if(!valid(value))throw Error('Geçersiz kayıt.');const text=JSON.stringify(value),old=storage.getItem(key);storage.setItem(key,text);if(typeof document!=='undefined')document.dispatchEvent(new Event('seiri-local-write'));if(old!==null){try{if(!valid(JSON.parse(old)))return true;storage.setItem(key+'-last-good',old);}catch{}}return true;}
 return Object.freeze({load,write});
})();
