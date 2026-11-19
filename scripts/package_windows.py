#!/usr/bin/env python3
"""Resmi Windows çalışma zamanını doğrular ve taşınabilir ZIP üretir."""
from pathlib import Path
import hashlib,json,shutil,subprocess,urllib.request,zipfile,struct,os
from brand_windows import stamp_executable
ROOT=Path(__file__).resolve().parents[1];BASE=ROOT.parent
APP_METADATA=json.loads((ROOT/'package.json').read_text())
VERSION=APP_METADATA['devDependencies']['electron']
CACHE=BASE/'electron-cache';CACHE.mkdir(exist_ok=True)
name=f'electron-v{VERSION}-win32-x64.zip';url=f'https://github.com/electron/electron/releases/download/v{VERSION}/'
for item in ['SHASUMS256.txt',name]:
 if not (CACHE/item).exists():urllib.request.urlretrieve(url+item,CACHE/item)
expected=next(line.split()[0] for line in (CACHE/'SHASUMS256.txt').read_text().splitlines() if line.endswith(name))
actual=hashlib.sha256((CACHE/name).read_bytes()).hexdigest()
if actual!=expected:raise SystemExit('Çalışma zamanı SHA256 eşleşmedi. Paketleme durduruldu.')
subprocess.run(['python3',str(ROOT/'scripts/package_web.py')],check=True)
subprocess.run(['node',str(ROOT/'scripts/test.mjs')],check=True)
subprocess.run(['node',str(ROOT/'scripts/test_ui.mjs')],check=True)
subprocess.run(['node',str(ROOT/'scripts/test_study.mjs')],check=True)
subprocess.run(['node',str(ROOT/'scripts/test_security.mjs')],check=True)
subprocess.run(['node',str(ROOT/'scripts/test_planner.mjs')],check=True)
subprocess.run(['node',str(ROOT/'scripts/test_plan_transactions.mjs')],check=True)
subprocess.run(['node',str(ROOT/'scripts/test_migration.mjs')],check=True)
subprocess.run(['node',str(ROOT/'scripts/test_sound.mjs')],check=True)
subprocess.run(['node',str(ROOT/'scripts/test_motion.mjs')],check=True)
subprocess.run(['node',str(ROOT/'scripts/test_refinement.mjs')],check=True)
subprocess.run(['node',str(ROOT/'scripts/test_workspace.mjs')],check=True)
subprocess.run(['node',str(ROOT/'scripts/test_covers.mjs')],check=True)
subprocess.run(['node',str(ROOT/'scripts/test_notebook190.mjs')],check=True)
subprocess.run(['node',str(ROOT/'scripts/test_appearance111.mjs')],check=True)
subprocess.run(['node',str(ROOT/'scripts/test_reliability112.mjs')],check=True)
subprocess.run(['node',str(ROOT/'scripts/test_backup_roundtrip112.mjs')],check=True)
subprocess.run(['node',str(ROOT/'scripts/test_learning113.mjs')],check=True)
subprocess.run(['node',str(ROOT/'scripts/test_starter114.mjs')],check=True)
subprocess.run(['node',str(ROOT/'scripts/test_dom112.mjs')],check=True)
subprocess.run(['node',str(ROOT/'scripts/test_dom113.mjs')],check=True)
subprocess.run(['node',str(ROOT/'scripts/test_dom114.mjs')],check=True)
subprocess.run(['node',str(ROOT/'scripts/test_cloud115.mjs')],check=True)
subprocess.run(['node',str(ROOT/'scripts/test_dom115.mjs')],check=True)
# Üretim SDK bağımlılıkları kilit dosyasıyla kurulur; geliştirme araçları pakete girmez.
lock_hash=hashlib.sha256((ROOT/'package-lock.json').read_bytes()).hexdigest()[:20]
runtime_cache=BASE/'runtime-node-cache'/lock_hash
if not (runtime_cache/'.ready').exists():
 if runtime_cache.exists():shutil.rmtree(runtime_cache)
 runtime_cache.mkdir(parents=True)
 for f in ['package.json','package-lock.json']:shutil.copy(ROOT/f,runtime_cache/f)
 npm=shutil.which('npm.cmd' if os.name=='nt' else 'npm')
 if not npm:raise SystemExit('Üretim bağımlılıkları için npm gerekli.')
 subprocess.run([npm,'ci','--omit=dev','--ignore-scripts','--no-audit','--no-fund'],cwd=runtime_cache,check=True)
 (runtime_cache/'.ready').write_text('ok')
if not (ROOT/'desktop/cloud-config.json').exists():raise SystemExit('Önce ortam ayarlarıyla npm run configure:cloud çalıştırın.')
subprocess.run(['node',str(ROOT/'scripts/test_sync116.mjs')],check=True)
subprocess.run(['node',str(ROOT/'scripts/test_sync118.mjs')],check=True)
subprocess.run(['node',str(ROOT/'scripts/test_cloud_files116.mjs')],check=True)
subprocess.run(['node',str(ROOT/'scripts/test_dom116.mjs')],check=True)
OUT=ROOT/'dist/Seiri_Windows_x64'
if OUT.exists():shutil.rmtree(OUT)
OUT.mkdir(parents=True)
with zipfile.ZipFile(CACHE/name) as z:z.extractall(OUT)
(OUT/'electron.exe').rename(OUT/'Seiri.exe')
branding=stamp_executable(OUT/'Seiri.exe',ROOT/'desktop/icon.ico',version=APP_METADATA['version'],company=APP_METADATA['author'])
if os.environ.get('SEIRI_SIGN_PFX_BASE64'):
 if os.name!='nt':raise SystemExit('Imzalama Windows gerektirir.')
 subprocess.run(['powershell.exe','-NoProfile','-File',str(ROOT/'desktop/sign-windows.ps1'),'-Executable',str(OUT/'Seiri.exe')],check=True)
 branding['unsigned_custom_executable']=False
 branding['authenticode_verification']='passed'
if (OUT/'LICENSE').exists():(OUT/'LICENSE').rename(OUT/'LICENSE.electron')
(OUT/'resources/default_app.asar').unlink(missing_ok=True)
application=OUT/'resources/app';application.mkdir()
for folder in ['app','desktop']:shutil.copytree(ROOT/folder,application/folder)
shutil.copytree(runtime_cache/'node_modules',application/'node_modules')
metadata=json.loads((ROOT/'package.json').read_text());metadata.pop('devDependencies',None);metadata.pop('scripts',None)
(application/'package.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2))
shutil.copy(ROOT/'desktop/Windows-Kontrol.ps1',OUT/'Windows-Kontrol.ps1')
(OUT/'Windows-Kontrol.cmd').write_bytes(b'@echo off\r\npowershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Windows-Kontrol.ps1"\r\npause\r\n')
shutil.copytree(ROOT/'docs',OUT/'docs',dirs_exist_ok=True)
for file in ['README_TR.md','THIRD_PARTY_NOTICES.md']:shutil.copy(ROOT/file,OUT/file)
(OUT/'Kur.cmd').write_bytes(b'@echo off\r\npowershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Kur.ps1"\r\nif errorlevel 1 pause\r\n')
ps=(ROOT/'desktop/install.ps1').read_text()
(OUT/'Kur.ps1').write_text(ps,encoding='utf-8-sig')
pe=(OUT/'Seiri.exe').read_bytes();assert pe[:2]==b'MZ';offset=struct.unpack_from('<I',pe,0x3c)[0];assert pe[offset:offset+4]==b'PE\0\0';assert struct.unpack_from('<H',pe,offset+4)[0]==0x8664
report={**branding,'cloud_auth_unit_tests':'passed_mock_provider_and_local_http','cloud_auth_ui_tests':'passed_simulated_dom','google_login_end_to_end_tested':False,'multi_device_sync_enabled':True,'personal_sync_tests':'passed_two_simulated_clients_and_dom','cloud_file_tests':'passed_mock_storage_and_rpc','real_two_windows_device_sync_tested':False,'teams_sync_enabled':False,'android_web_sync_updated':True,'note_resolution':'field_lww_with_cloud_versions_and_delete_priority','sync118_automated_tests':'passed_simulated_clients_and_packaged_ui','real_android_windows_118_tested':False,'custom_executable_sha256':hashlib.sha256(pe).hexdigest(),'app_version':metadata['version'],'security_unit_tests':'passed_mock_os_provider','planner_tests':'passed','notebook_and_checklist_tests':'passed','onboarding_flow_image_tests':'passed_simulated_dom','starter_kit_validation':'passed','github_help_page_generated':True,'native_windows_preflight_executed':False,'learning_link_tests':'passed','note_history_trash_tests':'passed_simulated','update_checker_tests':'passed_mock_metadata','appearance_migration_tests':'passed','appearance_modes':['seiri','lofi','academic'],'reliability_tests':'passed','backup_roundtrip_tests':'passed','simulated_dom_smoke_test':'passed_mock_desktop','learning_dom_flow':'passed_mock_desktop','live_visual_review_completed':False,'physical_windows_security_tested':False,'electron':VERSION,'runtime_sha256':actual,'runtime_official_checksum_verified':True,'windows_exe_pe_x64_verified':True,'windows_runtime_tested':False,'frontend_and_reminder_tests':'passed'}
(ROOT/'DOGRULAMA.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));shutil.copy(ROOT/'DOGRULAMA.json',OUT/'DOGRULAMA.json')
binary=BASE/f'Seiri_Windows_{APP_METADATA["version"]}_x64.zip'
with zipfile.ZipFile(binary,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in sorted(OUT.rglob('*')):
  if p.is_file():z.write(p,Path(OUT.name)/p.relative_to(OUT))
source=BASE/'Seiri_Windows_Kaynak_Projesi.zip'
with zipfile.ZipFile(source,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in sorted(ROOT.rglob('*')):
  if p.is_file() and p.relative_to(ROOT).as_posix()!='desktop/cloud-config.json' and not p.name.startswith('.env') and not any(x in {'dist','node_modules','__pycache__','.git'} for x in p.relative_to(ROOT).parts):z.write(p,Path(ROOT.name)/p.relative_to(ROOT))
print(json.dumps({'binary':str(binary),'binary_bytes':binary.stat().st_size,'source':str(source),'source_bytes':source.stat().st_size,'checks':report},ensure_ascii=False,indent=2))
