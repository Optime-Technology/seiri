/** Profil güvenliği, eski kayıt uyumu ve saat çakışmalarını sınar. */
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const base=new URL('../',import.meta.url),context=vm.createContext({});
vm.runInContext(fs.readFileSync(new URL('web/ui/ui-model.js',base),'utf8')+'\nthis.model=ZamanUIModel;',context);const model=context.model;
assert.equal(model.profile({name:'  Ada  ',bio:'x'.repeat(500)}).name,'Ada');assert.equal(model.profile({bio:'x'.repeat(500)}).bio.length,300);
for(const avatar of ['https://example.com/p.png','data:image/svg+xml;base64,PHN2Zz4=','javascript:alert(1)','data:image/jpeg;base64,'+'A'.repeat(240001)])assert.equal(model.profile({avatar}).avatar,'');
assert.equal(model.profile({avatar:'data:image/png;base64,aGVsbG8='}).avatar,'data:image/png;base64,aGVsbG8=');assert.equal(model.profile(null).name,'');
const e=(id,time,durationMinutes=60)=>({id,type:'event',time,durationMinutes});
let result=model.layout([e('a','09:00'),e('b','09:30'),e('c','10:00'),e('d','15:00')]);
assert.equal(result[0].columns,2);assert.equal(result[1].column,1);assert.equal(result[2].column,0);assert.equal(result[3].columns,1);
result=model.layout([e('late','23:30',120)]);assert.equal(result[0].end,1440);assert.equal(model.clock(1440),'00:00');
assert.equal(model.layout([e('bad','25:00'),{id:'note',type:'note',time:'09:00'}]).length,0);
assert.equal(model.layout([{id:'old',type:'event',time:'09:00'}])[0].end,600,'Eski kayıtlarda bir saat varsayılır');
assert.equal(model.layout([e('a','09:00'),e('b','10:00')])[0].columns,1,'Bitişte başlayan kayıt çakışmaz');
console.log('PASS: profil sınırları, avatar tür/URL/boyut filtreleri; boş profil; çakışan ve ardışık kayıtlar; gün sonu ve eski etkinlik uyumu.');
