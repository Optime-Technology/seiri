'use strict';
/** Yalnızca resmî Seiri GitHub sürüm metadatasını okur; kod indirmez/çalıştırmaz. */
const https=require('node:https');
const endpoint='https://api.github.com/repos/Optime-Technology/seiri/releases?per_page=20';
function parts(value){const m=String(value).match(/^v?(\d+)\.(\d+)\.(\d+)$/);return m?m.slice(1).map(Number):null;}
function compare(a,b){const x=parts(a),y=parts(b);if(!x||!y)return 0;for(let i=0;i<3;i++)if(x[i]!==y[i])return x[i]>y[i]?1:-1;return 0;}
function choose(rows,current){if(!Array.isArray(rows)||!parts(current))throw Error('Sürüm bilgisi okunamadı.');const candidates=rows.filter(r=>r&&!r.draft&&parts(r.tag_name)&&typeof r.html_url==='string'&&r.html_url.startsWith('https://github.com/Optime-Technology/seiri/releases/tag/')&&compare(r.tag_name,current)>0).sort((a,b)=>compare(b.tag_name,a.tag_name));const r=candidates[0];return r?{available:true,version:r.tag_name.replace(/^v/,''),url:r.html_url,beta:!!r.prerelease}: {available:false,version:current};}
function check(current){return new Promise((resolve,reject)=>{const req=https.get(endpoint,{headers:{'User-Agent':'Seiri/'+current,'Accept':'application/vnd.github+json'},timeout:10000},response=>{if(response.statusCode!==200){response.resume();reject(Error('Sürüm hizmeti şu anda yanıt vermiyor.'));return;}let text='';response.setEncoding('utf8');response.on('data',chunk=>{text+=chunk;if(text.length>1024*1024)req.destroy(Error('Sürüm yanıtı çok büyük.'));});response.on('error',reject);response.on('end',()=>{try{resolve(choose(JSON.parse(text),current));}catch{reject(Error('Sürüm bilgisi okunamadı.'));}});});req.on('timeout',()=>req.destroy(Error('Sürüm kontrolü zaman aşımına uğradı.')));req.on('error',reject);});}
module.exports={parts,compare,choose,check};
