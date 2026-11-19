'use strict';
/** İki küçük veri kaydı birlikte uygulanır; yarım işlem sonraki açılışta geri alınır. */
(function(root,factory){const value=factory();if(typeof module!=='undefined')module.exports=value;else root.SeiriSyncCache=value;})(typeof window==='undefined'?globalThis:window,()=>{
 const started='seiri-sync-started',committed='seiri-sync-committed';
 function create(storage,journal){const put=(key,value)=>value===null?storage.removeItem(key):storage.setItem(key,value);
  async function clean(){await journal.clear();storage.removeItem(started);storage.removeItem(committed);}
  async function recover(){const j=await journal.get();if(!j)return false;if(storage.getItem(started)===j.id&&storage.getItem(committed)!==j.id)for(const [key,value]of Object.entries(j.before))put(key,value);await clean();return true;}
  async function apply(before,after,id,canApply=()=>true,onCommit=()=>{}){await journal.put({id,before,after});if(!canApply()||Object.entries(before).some(([k,v])=>storage.getItem(k)!==v)){await clean();return false;}
   try{storage.setItem(started,id);for(const [key,value]of Object.entries(after))put(key,value);storage.setItem(committed,id);}catch(error){try{for(const [key,value]of Object.entries(before))put(key,value);await clean();}catch{throw Error('Eşitleme geri alınamadı. Uygulamayı kapatmadan yedek al.');}throw error;}
   onCommit();
   // Tamamlanmış işlemde günlük temizliği başarısız olsa da veriyi geri çevirmeyiz.
   try{await clean();}catch{}return true;
  }return Object.freeze({recover,apply});
 }return Object.freeze({create});
});
