'use strict';
/** Geçiş yedeğinden yalnızca normal içerik seçilir; kaynak dosya hiçbir zaman değiştirilmez. */
const {sensitive,refs}=require('./sync-model.cjs');
function sanitizeTransfer(backup){const b=structuredClone(backup);if(!Array.isArray(b.entries)||!Array.isArray(b.files)||!Array.isArray(b.categories))throw Error('Geçiş yedeği geçersiz.');const privateIds=new Set(b.entries.filter(sensitive).map(e=>e.id)),privateTasks=new Set(b.entries.filter(sensitive).map(e=>e.planTaskId).filter(Boolean));const safe=v=>!sensitive(v)&&!privateIds.has(v.noteId)&&!privateTasks.has(v.id)&&!privateTasks.has(v.taskId);
 b.entries=b.entries.filter(e=>!sensitive(e));b.study=b.study||{};b.study.tasks=(b.study.tasks||[]).filter(safe);b.study.sessions=(b.study.sessions||[]).filter(safe);b.study.completions=(b.study.completions||[]).filter(c=>!privateIds.has(c.entryId)&&!privateTasks.has(c.entryId));b.study.timer=null;b.noteHistory=(b.noteHistory||[]).filter(r=>!privateIds.has(r.id)).map(r=>({...r,items:r.items.filter(v=>!sensitive(v.note))}));delete b.planner;delete b.profile;
 const referenced=new Set([...b.entries,...b.noteHistory.flatMap(r=>r.items.map(v=>v.note)),...b.study.tasks.map(t=>t.sourceEvent).filter(Boolean)].flatMap(refs).map(f=>f.id));b.files=b.files.filter(f=>referenced.has(f.id));
 return{backup:b,counts:{notes:b.entries.filter(e=>e.type==='note').length,events:b.entries.filter(e=>e.type==='event').length,tasks:b.study.tasks.length,files:b.files.length,excluded:privateIds.size}};
}
module.exports={sanitizeTransfer};
