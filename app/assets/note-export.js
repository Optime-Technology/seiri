'use strict';
/** Yalnızca kullanıcının seçtiği notu yerel dosya olarak indirir; ağ isteği göndermez. */
window.FocusNoteExport=(()=>{
 const escape=s=>String(s).replace(/[\\`*_{}[\]<>#+.!|~-]/g,'\\$&');
 function markdown(html){const root=document.createElement('div');root.innerHTML=sanitizeRich(html||'');
  function walk(node,depth=0){if(node.nodeType===Node.TEXT_NODE)return escape(node.textContent);if(node.nodeType!==Node.ELEMENT_NODE)return '';const inner=()=>[...node.childNodes].map(n=>walk(n,depth)).join(''),tag=node.tagName;
   if(tag==='BR')return '\n';if(/^H[1-6]$/.test(tag))return '\n\n'+'#'.repeat(Number(tag[1]))+' '+inner()+'\n\n';
   if(['STRONG','B'].includes(tag))return '**'+inner()+'**';if(['I','EM'].includes(tag))return '*'+inner()+'*';if(['S','STRIKE'].includes(tag))return '~~'+inner()+'~~';
   if(tag==='PRE'){const fence='`'.repeat(Math.max(3,...(node.textContent.match(/`+/g)||[]).map(s=>s.length+1)));return '\n\n'+fence+'\n'+node.textContent+'\n'+fence+'\n\n';}
   if(tag==='CODE'){const fence='`'.repeat(Math.max(1,...(node.textContent.match(/`+/g)||[]).map(s=>s.length+1)));return fence+' '+node.textContent+' '+fence;}
   if(tag==='BLOCKQUOTE')return '\n\n'+inner().trim().split('\n').map(s=>'> '+s).join('\n')+'\n\n';
   if(tag==='UL'||tag==='OL')return '\n'+[...node.children].map((li,i)=>'  '.repeat(depth)+(tag==='OL'?(i+1)+'. ':'- ')+[...li.childNodes].map(n=>walk(n,depth+1)).join('').trim()).join('\n')+'\n';
   if(['P','DIV'].includes(tag))return '\n\n'+inner()+'\n\n';return inner();
  }return [...root.childNodes].map(n=>walk(n)).join('').replace(/\n{3,}/g,'\n\n').trim();
 }
 function filename(title,extension){let name=String(title||'Not').replace(/[<>:"/\\|?*\x00-\x1f]/g,' ').replace(/\s+/g,' ').trim().slice(0,80).replace(/[. ]+$/,'');if(!name||/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(name))name='Not';return 'Seiri-'+name+'.'+extension;}
 function download(note,format){if(!note||note.type!=='note'||note.sensitive)throw Error('Bu kayıt not olarak dışa aktarılamaz.');if(!['txt','md'].includes(format))throw Error('Geçersiz biçim.');const body=format==='md'?markdown(note.bodyHtml||plainHTML(note.body||'')):String(note.body||'');const content=format==='md'?'# '+escape(note.title)+'\n\n'+(note.subject?escape(note.subject)+'\n\n':'')+body:String(note.title)+'\n'+(note.subject?note.subject+'\n':'')+'\n'+body;
  const url=URL.createObjectURL(new Blob([content+'\n'],{type:format==='md'?'text/markdown;charset=utf-8':'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=filename(note.title,format);a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 function show(note){if(!note)return;const d=document.createElement('dialog');d.className='workspaceDialog';d.setAttribute('aria-label','Notu dışa aktar');d.innerHTML='<form><div class="workspaceDialogHead"><h2>Notu dışa aktar</h2><button class="close" type="button" data-cancel aria-label="Kapat">×</button></div><label>Biçim<select name="format"><option value="txt">Düz metin (.txt)</option><option value="md">Markdown (.md)</option></select></label><p class="categorySafety">Dosya ekleri dahil edilmez. Markdown; başlık, kalın, italik ve listeleri korur. Yazı tipi ve vurgu renkleri metin dosyasında tutulmaz.</p><div class="workspaceActions"><button type="button" class="outline" data-cancel>Vazgeç</button><button class="primary">İndir</button></div></form>';document.body.append(d);d.querySelectorAll('[data-cancel]').forEach(b=>b.onclick=()=>d.close());d.addEventListener('close',()=>d.remove());d.querySelector('form').onsubmit=e=>{e.preventDefault();try{download(note,d.querySelector('select').value);d.close();}catch(error){toast(error.message);}};d.showModal();}
 return Object.freeze({show,download,markdown,filename});
})();
