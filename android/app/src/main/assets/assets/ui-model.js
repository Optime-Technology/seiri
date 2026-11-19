'use strict';
/** Profil doğrulaması ve çakışan etkinliklerin saat çizelgesine yerleşimi. */
const ZamanUIModel=(()=>{
 const emptyProfile={name:'',email:'',phone:'',occupation:'',location:'',bio:'',avatar:''};
 function profile(input={}){const result={};for(const [name,max] of Object.entries({name:80,email:120,phone:30,occupation:80,location:80,bio:300}))result[name]=typeof input?.[name]==='string'?input[name].trim().slice(0,max):'';result.avatar=typeof input?.avatar==='string'&&input.avatar.length<=240000&&/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/.test(input.avatar)?input.avatar:'';return result;}
 function layout(entries){const items=entries.filter(e=>e.type==='event'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(e.time||'')).map(e=>{const [h,m]=e.time.split(':').map(Number),start=h*60+m;return {entry:e,start,end:Math.min(1440,start+Math.max(15,Math.min(180,Number(e.durationMinutes)||60))),column:0,columns:1};}).sort((a,b)=>a.start-b.start||b.end-a.end||a.entry.id.localeCompare(b.entry.id));let group=[],ends=[];const finish=()=>{group.forEach(x=>x.columns=ends.length);group=[];ends=[];};for(const item of items){if(group.length&&item.start>=Math.max(...ends))finish();let col=ends.findIndex(end=>end<=item.start);if(col<0)col=ends.length;item.column=col;ends[col]=item.end;group.push(item);}finish();return items;}
 const clock=minutes=>String(Math.floor(minutes/60)%24).padStart(2,'0')+':'+String(minutes%60).padStart(2,'0');
 return {emptyProfile,profile,layout,clock};
})();
