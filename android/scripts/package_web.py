#!/usr/bin/env python3
"""Güncel Seiri arayüzü, ortak eşitleme motoru ve Android uyarlamasını paketler."""
from pathlib import Path
import shutil,re,subprocess
ROOT=Path(__file__).resolve().parents[1];WEB=ROOT/'web';OUT=ROOT/'app/src/main/assets'
OUT.mkdir(parents=True,exist_ok=True);
if (ROOT/'licenses').exists():shutil.copytree(ROOT/'licenses',OUT/'licenses',dirs_exist_ok=True)
shutil.copy(ROOT/'THIRD_PARTY_NOTICES.md',OUT/'THIRD_PARTY_NOTICES.md')
(OUT/'assets').mkdir(exist_ok=True)
for folder in ['themes','fonts','audio']:shutil.copytree(WEB/folder,OUT/folder,dirs_exist_ok=True)
for name in ['seiri-icon.png','brand-rocket.svg']:shutil.copy(WEB/'ui'/name,OUT/'assets'/name)
for file in (WEB/'ui').iterdir():
 if file.suffix in ['.js','.css']:shutil.copy(file,OUT/'assets'/file.name)
css=(WEB/'ui/style.css').read_text();css=re.sub(r"@import\s+url\(['\"]https?[^;]+;",'',css)
imports=["@import url('/fonts/"+f.relative_to(WEB/'fonts').as_posix()+"');" for f in sorted((WEB/'fonts').rglob('*.css'))]
(OUT/'assets/style.css').write_text('\n'.join(imports)+'\n'+css)
brand=(OUT/'assets/brand.js').read_text();brand=re.sub(r'"version":\s*"[^"]+"','"version": "1.18.0"',brand);(OUT/'assets/brand.js').write_text(brand)
team=(OUT/'assets/team.js').read_text().replace('\nbootstrapCloud();','\nif(!window.ZamanMobile)bootstrapCloud();');(OUT/'assets/team.js').write_text(team)
for name in ['android','reminder-planner']:shutil.copy(ROOT/'native'/f'{name}.js',OUT/'assets'/f'{name}.js')
html=(WEB/'ui/index.html').read_text().replace('Bu tarayıcıda kaydediliyor','Bu telefonda kaydediliyor').replace('Dosyalar bu tarayıcıda saklanır','Dosyalar bu telefonda saklanır').replace('<head>','<head><script src="/assets/android-cloud.js"></script>',1)
index=0
def extract(match):
 global index
 name='boot-'+str(index)+'.js';index+=1;(OUT/'assets'/name).write_text(match.group(1));return '<script src="/assets/'+name+'"></script>'
html=re.sub(r'<script>(.*?)</script>',extract,html,flags=re.S)
html=html.replace('</body>','<script src="/assets/reminder-planner.js"></script><script src="/assets/android.js"></script><link rel="stylesheet" href="/assets/android117.css"></body>')
(OUT/'index.html').write_text(html)
subprocess.run(['node',str(ROOT/'scripts/build_cloud.mjs')],check=True,cwd=ROOT)
print('Seiri 1.18 Android arayüzü ve yerel varlıkları hazır.')
