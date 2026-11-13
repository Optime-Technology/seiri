'use strict';
/** Özel metin taşımayan kamusal kayıt sözleşmesi. */
const ZamanPrivacyModel=(()=>{
 const publicName=e=>String(e.publicName||'Meşgul').slice(0,80);
 function canonical(e){if(!e.sensitive)return e;if(e.type!=='event'||!e.secret||e.secret.alg!=='A256GCM'||e.secret.v!==1||typeof e.secret.keyId!=='string'||typeof e.secret.data!=='string')throw Error('Hassas kayıt şifreli değil.');const out={};for(const k of ['id','type','date','time','category','scope','durationMinutes','reminder30','reminderDay','updated','completedAt','createdAt','timeZone','startAt','endAt','planTaskId','planParentId'])if(e[k]!==undefined)out[k]=e[k];return {...out,sensitive:true,publicName:publicName(e),title:publicName(e),body:'',bodyHtml:'',location:'',participants:'',attachments:[],planMode:'fixed',userPinned:true,secret:{v:1,alg:'A256GCM',keyId:e.secret.keyId,iv:e.secret.iv,tag:e.secret.tag,data:e.secret.data}};}
 const identity=text=>/(?:^|\D)[1-9]\d{10}(?!\d)/.test(text)||/(?:protokol|hasta\s*(?:no|numarası)|dosya\s*no)\s*[:#-]?\s*[a-z0-9-]{4,}/i.test(text);
 const autoCategory=name=>['poliklinik','müvekkil','yatırımcı'].includes(String(name).trim().toLocaleLowerCase('tr'));
 const icsFields=e=>e.sensitive?{title:'Meşgul',body:'',location:''}:{title:e.title,body:e.body||'',location:e.location||''};
 return {publicName,canonical,identity,autoCategory,icsFields};
})();
