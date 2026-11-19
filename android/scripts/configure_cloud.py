#!/usr/bin/env python3
"""Yalnızca herkese açık Supabase bağlantı ayarını derleme ortamından okur."""
from pathlib import Path
from urllib.parse import urlsplit
import json,os,re
root=Path(__file__).resolve().parents[1]
url=os.environ.get('SEIRI_SUPABASE_URL','').rstrip('/')
key=os.environ.get('SEIRI_SUPABASE_PUBLISHABLE_KEY','')
u=urlsplit(url)
if u.scheme!='https' or not re.fullmatch(r'[a-z0-9]{20}\.supabase\.co',u.netloc) or u.path or u.query or u.fragment:
 raise SystemExit('SEIRI_SUPABASE_URL geçerli bir Supabase proje adresi olmalı.')
if not re.fullmatch(r'sb_publishable_[A-Za-z0-9_-]{20,200}',key):
 raise SystemExit('SEIRI_SUPABASE_PUBLISHABLE_KEY herkese açık publishable anahtarı olmalı; secret/service_role kabul edilmez.')
(root/'app/src/main/assets/cloud-config.json').write_text(json.dumps({'url':url,'publishableKey':key},indent=2)+'\n',encoding='utf-8')
print('Herkese açık proje bağlantısı hazır. Anahtar çıktıya yazılmadı.')
