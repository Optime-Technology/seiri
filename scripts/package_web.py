#!/usr/bin/env python3
"""Yerel web kaynaklarını güvenli masaüstü protokolü için hazırlar."""
from pathlib import Path
import shutil,re
ROOT=Path(__file__).resolve().parents[1];WEB=ROOT/'web';OUT=ROOT/'app'
OUT.mkdir(exist_ok=True);(OUT/'assets').mkdir(exist_ok=True)
for name in ['themes','fonts','audio']:shutil.copytree(WEB/name,OUT/name,dirs_exist_ok=True)
css=re.sub(r"@import\s+url\(['\"]https?[^;]+;",'',(WEB/'ui/style.css').read_text())
imports=[]
for folder in sorted((WEB/'fonts').iterdir()):
 if folder.is_dir():
  for f in sorted(folder.glob('*.css')):imports.append("@import url('/fonts/"+folder.name+'/'+f.name+"');")
shutil.copy(WEB/'ui/modern.css',OUT/'assets/modern.css')
shutil.copy(WEB/'ui/study.css',OUT/'assets/study.css')
shutil.copy(WEB/'ui/planning.css',OUT/'assets/planning.css')
shutil.copy(WEB/'ui/focus-notes.css',OUT/'assets/focus-notes.css')
shutil.copy(WEB/'ui/motion.css',OUT/'assets/motion.css')
shutil.copy(WEB/'ui/refinement.css',OUT/'assets/refinement.css')
shutil.copy(WEB/'ui/spacious.css',OUT/'assets/spacious.css')
shutil.copy(WEB/'ui/note-covers.css',OUT/'assets/note-covers.css')
shutil.copy(WEB/'ui/notebook-cards.css',OUT/'assets/notebook-cards.css')
shutil.copy(ROOT/'desktop/icon.png',OUT/'assets/seiri-icon.png')
(OUT/'assets/style.css').write_text('\n'.join(imports)+'\n'+css)
for name in ['checklist-model','cover-model','workspace-model','app','team','themes','ui-model','rocket','modern','study-model','sound-engine','study','privacy-model','privacy','planner-model','planner','quiet-ui','motion','note-covers','inline-images','checklists','note-export','workspace-ui']:
 s=(WEB/f'ui/{name}.js').read_text()
 if name=='team':s=s.replace('\nbootstrapCloud();','\nif(!window.ZamanMobile)bootstrapCloud();')
 (OUT/f'assets/{name}.js').write_text(s)
(OUT/'assets/platform.js').write_text('window.ZamanMobile=true;')
for name in ['reminder-planner','adapter']:shutil.copy(ROOT/f'desktop/{name}.js',OUT/f'assets/{name}.js')
html=(WEB/'ui/index.html').read_text().replace('<head>','<head><script src="/assets/platform.js"></script>',1)
html=html.replace('</body>','<script src="/assets/reminder-planner.js"></script><script src="/assets/adapter.js"></script></body>')
def extract_inline(match):
 name='boot-'+str(extract_inline.count)+'.js';extract_inline.count+=1
 (OUT/'assets'/name).write_text(match.group(1))
 return '<script src="/assets/'+name+'"></script>'
extract_inline.count=0
html=re.sub(r'<script>(.*?)</script>',extract_inline,html,flags=re.S)
html=html.replace('Bu tarayıcıda kaydediliyor','Bu bilgisayarda kaydediliyor').replace('Dosyalar bu tarayıcıda saklanır','Dosyalar bu bilgisayarda saklanır')
(OUT/'index.html').write_text(html)
print('Windows arayüzü hazır; yazı tipleri ve tema görselleri yerel pakette.')
