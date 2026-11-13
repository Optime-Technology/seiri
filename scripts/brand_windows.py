#!/usr/bin/env python3
"""Windows PE simge/sürüm kaynaklarını yeniden kurar; kod bölümlerini değiştirmez.
Biçim: https://learn.microsoft.com/windows/win32/debug/pe-format
Simge grubu: https://devblogs.microsoft.com/oldnewthing/20120720-00/?p=7083
"""
from pathlib import Path
import struct
from collections import namedtuple
Leaf=namedtuple('Leaf','data codepage')
def align(n,to=4):return (n+to-1)//to*to

def headers(b):
 if b[:2]!=b'MZ':raise ValueError('PE başlığı yok')
 pe=struct.unpack_from('<I',b,0x3c)[0]
 if b[pe:pe+4]!=b'PE\0\0':raise ValueError('PE imzası yok')
 count=struct.unpack_from('<H',b,pe+6)[0];optional=pe+24;size=struct.unpack_from('<H',b,pe+20)[0]
 if struct.unpack_from('<H',b,optional)[0]!=0x20b:raise ValueError('PE32+ bekleniyor')
 table=optional+size;sections=[]
 for i in range(count):
  off=table+i*40;vs,va,raw,ptr=struct.unpack_from('<IIII',b,off+8);sections.append((vs,va,raw,ptr))
 return pe,optional,table,count,sections

def read_resources(b):
 pe,opt,table,count,sections=headers(b)
 def offset(rva):
  for vs,va,raw,ptr in sections:
   if va<=rva<va+max(vs,raw):return ptr+rva-va
  if rva<struct.unpack_from('<I',b,opt+60)[0]:return rva
  raise ValueError('Kaynak adresi bölüm dışında')
 rva,size=struct.unpack_from('<II',b,opt+112+16);root=offset(rva);result={}
 def walk(at,path,depth=0):
  if depth>8:raise ValueError('Kaynak ağacı çok derin')
  named,ids=struct.unpack_from('<HH',b,root+at+12)
  for i in range(named+ids):
   name,value=struct.unpack_from('<II',b,root+at+16+i*8)
   if name&0x80000000:
    pos=root+(name&0x7fffffff);length=struct.unpack_from('<H',b,pos)[0];name=b[pos+2:pos+2+length*2].decode('utf-16le')
   if value&0x80000000:walk(value&0x7fffffff,path+(name,),depth+1)
   else:
    data_rva,length,cp,_=struct.unpack_from('<IIII',b,root+value);pos=offset(data_rva);result[path+(name,)]=Leaf(bytes(b[pos:pos+length]),cp)
 walk(0,());return result

def build_resources(leaves,rva):
 tree={}
 for path,leaf in leaves.items():
  node=tree
  for name in path[:-1]:node=node.setdefault(name,{})
  node[path[-1]]=leaf
 def keys(node):return sorted(node,key=lambda k:(0,str(k)) if isinstance(k,str) else (1,k))
 nodes=[];at=0
 def directories(node):
  nonlocal at
  pos=at;at+=16+8*len(node);nodes.append((node,pos))
  for name in keys(node):
   if isinstance(node[name],dict):directories(node[name])
 directories(tree);positions={id(node):pos for node,pos in nodes};out=bytearray(align(at));names={}
 for node,pos in nodes:
  for name in keys(node):
   if isinstance(name,str) and name not in names:
    names[name]=len(out);encoded=name.encode('utf-16le');out+=struct.pack('<H',len(encoded)//2)+encoded
 out+=bytes(align(len(out))-len(out));entries=[]
 for node,pos in nodes:
  named=sum(isinstance(k,str) for k in node);struct.pack_into('<IIHHHH',out,pos,0,0,0,0,named,len(node)-named)
  for i,name in enumerate(keys(node)):
   value=node[name];entry=pos+16+i*8;name_value=0x80000000|names[name] if isinstance(name,str) else name
   if isinstance(value,dict):value_offset=0x80000000|positions[id(value)]
   else:value_offset=len(out);out+=bytes(16);entries.append((value_offset,value))
   struct.pack_into('<II',out,entry,name_value,value_offset)
 for pos,leaf in entries:
  out+=bytes(align(len(out))-len(out));payload=len(out);out+=leaf.data;struct.pack_into('<IIII',out,pos,rva+payload,len(leaf.data),leaf.codepage,0)
 return bytes(out)

def version_resource(version,company):
 parts=[int(x) for x in version.split('.')];parts=(parts+[0]*4)[:4];ms=(parts[0]<<16)|parts[1];ls=(parts[2]<<16)|parts[3]
 def block(key,value=b'',children=(),kind=1,value_length=None):
  data=bytearray(struct.pack('<HHH',0,len(value)//2 if value_length is None and kind else len(value) if value_length is None else value_length,kind)+key.encode('utf-16le')+b'\0\0');data+=bytes(align(len(data))-len(data));data+=value
  for child in children:data+=bytes(align(len(data))-len(data));data+=child
  struct.pack_into('<H',data,0,len(data));return bytes(data)
 values={'CompanyName':company,'FileDescription':'Seiri — Notes and Focus','FileVersion':version,'InternalName':'Seiri','OriginalFilename':'Seiri.exe','ProductName':'Seiri','ProductVersion':version,'LegalCopyright':company}
 strings=[block(k,(v+'\0').encode('utf-16le')) for k,v in values.items()]
 string_info=block('StringFileInfo',children=[block('040904B0',children=strings)])
 var_info=block('VarFileInfo',children=[block('Translation',struct.pack('<HH',1033,1200),kind=0)])
 fixed=struct.pack('<13I',0xfeef04bd,0x10000,ms,ls,ms,ls,0x3f,0,0x40004,1,0,0,0)
 return block('VS_VERSION_INFO',fixed,[string_info,var_info],kind=0)

def stamp_executable(exe,ico,version='1.4.0',company='Optime Technology'):
 exe=Path(exe);b=bytearray(exe.read_bytes());pe,opt,table,count,sections=headers(b);leaves=read_resources(b)
 untouched={k:v for k,v in leaves.items() if k[0] not in {3,14,16}};leaves=dict(untouched)
 icon=Path(ico).read_bytes();reserved,kind,icons=struct.unpack_from('<HHH',icon)
 if reserved or kind!=1 or not 1<=icons<=30:raise ValueError('Geçersiz ICO')
 group=bytearray(struct.pack('<HHH',0,1,icons))
 for i in range(icons):
  at=6+i*16;size,off=struct.unpack_from('<II',icon,at+8);payload=icon[off:off+size]
  if len(payload)!=size:raise ValueError('Eksik ICO görseli')
  leaves[(3,i+1,1033)]=Leaf(payload,0);group+=icon[at:at+12]+struct.pack('<H',i+1)
 leaves[(14,1,1033)]=Leaf(bytes(group),0);leaves[(16,1,1033)]=Leaf(version_resource(version,company),1200)
 section_align,file_align=struct.unpack_from('<II',b,opt+32);new_va=align(max(va+max(vs,raw) for vs,va,raw,ptr in sections),section_align);new_header=table+count*40;first_raw=min(ptr for vs,va,raw,ptr in sections if raw and ptr)
 if new_header+40>min(first_raw,struct.unpack_from('<I',b,opt+60)[0]):raise ValueError('Yeni PE kaynağı için başlık alanı yok')
 resources=build_resources(leaves,new_va);new_raw=align(len(b),file_align);raw_size=align(len(resources),file_align);b+=bytes(new_raw-len(b))+resources+bytes(raw_size-len(resources));b[new_header:new_header+40]=struct.pack('<8sIIIIIIHHI',b'.ffres\0\0',len(resources),new_va,raw_size,new_raw,0,0,0,0,0x40000040)
 struct.pack_into('<H',b,pe+6,count+1);struct.pack_into('<I',b,opt+56,align(new_va+len(resources),section_align));struct.pack_into('<I',b,opt+8,struct.unpack_from('<I',b,opt+8)[0]+raw_size);struct.pack_into('<II',b,opt+112+16,new_va,len(resources))
 # Yeni paket kendi markasıyla imzasızdır; eski çalışma zamanı sertifikası taşınmaz.
 struct.pack_into('<II',b,opt+112+32,0,0);struct.pack_into('<I',b,opt+64,0);checksum=0
 for at in range(0,len(b),2):
  word=b[at]|((b[at+1] if at+1<len(b) else 0)<<8);checksum=(checksum+word);checksum=(checksum&0xffff)+(checksum>>16)
 checksum=(checksum&0xffff)+(checksum>>16);struct.pack_into('<I',b,opt+64,(checksum&0xffff)+len(b));exe.write_bytes(b)
 actual=read_resources(b)
 for k,v in untouched.items():
  if actual.get(k)!=v:raise ValueError('Mevcut PE kaynağı değişmiş')
 if actual[(14,1,1033)].data!=bytes(group):raise ValueError('Simge grubu doğrulanamadı')
 for i in range(icons):
  if actual[(3,i+1,1033)]!=leaves[(3,i+1,1033)]:raise ValueError('Simge doğrulanamadı')
 if 'Seiri'.encode('utf-16le') not in actual[(16,1,1033)].data or company.encode('utf-16le') not in actual[(16,1,1033)].data:raise ValueError('Marka bilgisi doğrulanamadı')
 return {'icon_sizes':icons,'company':company,'product_name':'Seiri','exe_resources_verified':True,'unsigned_custom_executable':True}
