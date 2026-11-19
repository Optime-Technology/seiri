#!/usr/bin/env python3
"""Açık lisanslı yazı tiplerini ve resmî Gradle başlatıcısını projeye alır."""
from pathlib import Path
import urllib.request, json, tarfile, io, concurrent.futures
ROOT=Path(__file__).resolve().parents[1]
FONTS={'nunito':[400,700,800,900],'space-mono':[400,700],'vt323':[400],'dm-sans':[400,500,600,700],'manrope':[400,500,600,700,800]}
def font(job):
 name,weights=job;meta=json.load(urllib.request.urlopen('https://registry.npmjs.org/@fontsource%2F'+name+'/latest',timeout=30));raw=urllib.request.urlopen(meta['dist']['tarball'],timeout=45).read();dest=ROOT/'web'/'fonts'/name;dest.mkdir(parents=True,exist_ok=True)
 with tarfile.open(fileobj=io.BytesIO(raw),mode='r:gz') as archive:
  for m in archive.getmembers():
   sub=m.name.removeprefix('package/');keep=sub in [str(w)+'.css' for w in weights] or sub.lower() in ['license','license.txt','ofl.txt'] or (sub.startswith('files/') and sub.endswith('.woff2') and any('-'+str(w)+'-normal.' in sub for w in weights))
   if keep and m.isfile():
    path=dest/sub;path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(archive.extractfile(m).read())
 print(name,meta['version'],flush=True);return (name,meta['version'])
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:versions=list(pool.map(font,FONTS.items()))
(ROOT/'web'/'fonts'/'versions.json').write_text(json.dumps(dict(versions),indent=2))
for sub in ['gradlew','gradlew.bat','gradle/wrapper/gradle-wrapper.jar']:
 path=ROOT/sub;path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(urllib.request.urlopen('https://raw.githubusercontent.com/gradle/gradle/v8.13.0/'+sub,timeout=30).read())
(ROOT/'gradlew').chmod(0o755)
print('Yazı tipleri ve Gradle başlatıcısı hazır.',flush=True)
