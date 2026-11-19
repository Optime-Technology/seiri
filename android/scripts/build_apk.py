#!/usr/bin/env python3
"""Android SDK araçlarıyla bağımlılıksız bir test APK'sı derler ve imzasını doğrular."""
from pathlib import Path
import argparse,os,subprocess,shutil,zipfile,xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--sdk',default=os.environ.get('ANDROID_HOME') or os.environ.get('ANDROID_SDK_ROOT'));parser.add_argument('--output',default=str(ROOT/'build/outputs/Seiri-1.18.0-test.apk'));args=parser.parse_args()
if not args.sdk:raise SystemExit('--sdk ile Android SDK dizinini belirt veya ANDROID_HOME tanımla.')
SDK=Path(args.sdk).expanduser().resolve();TOOLS=SDK/'build-tools/36.0.0';PLATFORM=SDK/'platforms/android-36/android.jar'
if not PLATFORM.exists() or not (TOOLS/'lib/d8.jar').exists():raise SystemExit('Android SDK Platform 36 ve Build Tools 36.0.0 kurulu olmalı.')
BUILD=ROOT/'build/cli';CLASSES=BUILD/'classes';GEN=BUILD/'generated';DEX=BUILD/'dex';OUT=Path(args.output).resolve();OUT.parent.mkdir(parents=True,exist_ok=True)
if BUILD.exists():shutil.rmtree(BUILD)
for folder in [CLASSES,GEN,DEX]:folder.mkdir(parents=True,exist_ok=True)
def run(command):
 result=subprocess.run([str(v) for v in command],cwd=ROOT,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
 if result.stdout.strip():print(result.stdout.strip(),flush=True)
 if result.returncode:raise SystemExit('Derleme adımı başarısız: '+str(command[0]))
 return result.stdout
run(['python3',ROOT/'scripts/package_web.py'])
run(['node',ROOT/'scripts/test_static117.mjs'])
run(['node',ROOT/'scripts/test_cloud117.mjs'])
run(['node',ROOT/'scripts/test_sync118.mjs'])
ET.register_namespace('android','http://schemas.android.com/apk/res/android');manifest=ET.parse(ROOT/'app/src/main/AndroidManifest.xml');manifest.getroot().set('package','com.zaman.ajanda');manifest.write(BUILD/'AndroidManifest.xml',encoding='utf-8',xml_declaration=True)
run([TOOLS/'aapt2','compile','--dir',ROOT/'app/src/main/res','-o',BUILD/'resources.zip'])
run([TOOLS/'aapt2','link','-I',PLATFORM,'--manifest',BUILD/'AndroidManifest.xml','--java',GEN,'--min-sdk-version','26','--target-sdk-version','36','--version-code','1180','--version-name','1.18.0','--debug-mode','-o',BUILD/'unsigned.apk',BUILD/'resources.zip'])
sources=sorted((ROOT/'app/src/main/java').rglob('*.java'))+sorted(GEN.rglob('*.java'))
compiler=['javac'] if shutil.which('javac') else ['java','com.sun.tools.javac.Main']
run([*compiler,'-encoding','UTF-8','-source','11','-target','11','-classpath',PLATFORM,'-d',CLASSES,*sources])
TEST_CLASSES=BUILD/'policy-tests';TEST_CLASSES.mkdir(exist_ok=True)
run([*compiler,'-encoding','UTF-8','-classpath',CLASSES,'-d',TEST_CLASSES,ROOT/'scripts/tests/CloudPolicyTest.java'])
run(['java','-cp',str(CLASSES)+os.pathsep+str(TEST_CLASSES),'CloudPolicyTest'])
run(['java','-cp',TOOLS/'lib/d8.jar','com.android.tools.r8.D8','--lib',PLATFORM,'--min-api','26','--output',DEX,*sorted(CLASSES.rglob('*.class'))])
with zipfile.ZipFile(BUILD/'unsigned.apk','a',compression=zipfile.ZIP_DEFLATED,compresslevel=7) as package:
 for file in DEX.glob('*.dex'):package.write(file,file.name)
 for file in sorted((ROOT/'app/src/main/assets').rglob('*')):
  if file.is_file():package.write(file,'assets/'+file.relative_to(ROOT/'app/src/main/assets').as_posix())
run([TOOLS/'zipalign','-f','4',BUILD/'unsigned.apk',BUILD/'aligned.apk'])
KEY=ROOT/'debug-signing/zaman-debug.keystore';KEY.parent.mkdir(parents=True,exist_ok=True)
if not KEY.exists():run(['keytool','-genkeypair','-keystore',KEY,'-storepass','android','-alias','androiddebugkey','-keypass','android','-dname','CN=Android Debug,O=Android,C=US','-keyalg','RSA','-keysize','2048','-validity','10000'])
run([TOOLS/'apksigner','sign','--ks',KEY,'--ks-pass','pass:android','--key-pass','pass:android','--ks-key-alias','androiddebugkey','--v1-signing-enabled','true','--v2-signing-enabled','true','--v3-signing-enabled','true','--out',OUT,BUILD/'aligned.apk'])
run([TOOLS/'apksigner','verify','--verbose',OUT]);run([TOOLS/'zipalign','-c','4',OUT]);badging=subprocess.check_output([str(TOOLS/'aapt2'),'dump','badging',str(OUT)],text=True);print('\n'.join(badging.splitlines()[:9]));print('APK hazır:',OUT,'('+str(OUT.stat().st_size)+' bayt)')
