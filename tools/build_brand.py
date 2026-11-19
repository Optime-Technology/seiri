#!/usr/bin/env python3
"""Tek marka kaynağından SVG, Windows PNG/ICO ve arayüz sürüm bilgisi üretir."""
from pathlib import Path
import json
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[1]
# Yol noktaları hem vektör hem raster simgede aynıdır; hazır görsel kullanılmaz.
shapes=[
 ('#dce8a8',[('M',26,68),('Q',20,82,32,94),('Q',44,82,38,68),('Z',)]),
 ('#c784ad',[('M',21,40),('Q',7,48,7,66),('L',23,60),('Z',)]),
 ('#c784ad',[('M',43,40),('Q',57,48,57,66),('L',41,60),('Z',)]),
 ('#d596bd',[('M',32,4),('C',17,18,16,34,20,57),('L',25,68),('L',39,68),('L',44,57),('C',48,34,47,18,32,4),('Z',)]),
 ('#edc9e2',[('M',32,4),('Q',23,14,21,24),('Q',32,28,43,24),('Q',41,14,32,4),('Z',)]),
 ('#b776a0',[('M',25,67),('L',39,67),('L',40,72),('L',24,72),('Z',)]),
 ('#bc79a4',[('M',32,51),('Q',36,62,32,78),('Q',28,62,32,51),('Z',)])]
def path_string(commands):return ' '.join(c[0]+(' '.join(str(x) for x in c[1:])) for c in commands)
paths=''.join('<path'+(' class="rocketFlame"' if i==0 else '')+' d="'+path_string(c)+'" fill="'+color+'"/>' for i,(color,c) in enumerate(shapes))
svg='<svg class="brandRocket" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 96" fill="none" aria-hidden="true"><defs><linearGradient id="__PREFIX__Body"><stop stop-color="#edc9e2"/><stop offset="1" stop-color="#c784ad"/></linearGradient></defs>'+paths+'<circle cx="32" cy="38" r="8" fill="#bd7ea6"/><circle cx="32" cy="38" r="5.8" fill="#fff9f5"/></svg>'
(ROOT/'desktop/brand-rocket.svg').write_text(svg)
meta=json.loads((ROOT/'package.json').read_text())
brand={'name':meta['productName'],'company':meta['author'],'version':meta['version'],'svg':svg}
(ROOT/'web/ui/brand.js').write_text("'use strict';\n/** Paket bilgisi ve roket tools/build_brand.py ile üretilir. */\nwindow.SeiriBrand=(()=>{const b="+json.dumps(brand,ensure_ascii=False)+";return Object.freeze({...b,rocket:prefix=>b.svg.replaceAll('__PREFIX__',String(prefix).replace(/[^a-z0-9-]/gi,''))});})();\n")
def polygon(commands):
 points=[];at=(0,0);start=None
 for c in commands:
  op=c[0];nums=c[1:]
  if op=='M':at=tuple(nums);start=at;points.append(at)
  elif op=='L':at=tuple(nums);points.append(at)
  elif op in ['Q','C']:
   old=at;end=tuple(nums[-2:])
   for step in range(1,41):
    t=step/40;u=1-t
    if op=='Q':points.append(tuple(u*u*old[i]+2*u*t*nums[i]+t*t*end[i] for i in range(2)))
    else:points.append(tuple(u**3*old[i]+3*u*u*t*nums[i]+3*u*t*t*nums[i+2]+t**3*end[i] for i in range(2)))
   at=end
  elif op=='Z':points.append(start)
 return [(round(x*12),round(y*12)) for x,y in points]
rocket=Image.new('RGBA',(64*12,96*12));draw=ImageDraw.Draw(rocket)
for color,commands in shapes:draw.polygon(polygon(commands),fill=color)
for radius,color in [(8,'#bd7ea6'),(5.8,'#fff9f5')]:draw.ellipse(tuple(round(v*12) for v in (32-radius,38-radius,32+radius,38+radius)),fill=color)
rocket=rocket.rotate(-25,resample=Image.Resampling.BICUBIC,expand=True);rocket.thumbnail((790,790),Image.Resampling.LANCZOS)
master=Image.new('RGBA',(1024,1024));ImageDraw.Draw(master).rounded_rectangle((16,16,1008,1008),radius=225,fill='#fff7fb')
master.alpha_composite(rocket,((1024-rocket.width)//2,(1024-rocket.height)//2))
master.save(ROOT/'desktop/seiri-icon-master.png')
master.resize((256,256),Image.Resampling.LANCZOS).save(ROOT/'desktop/icon.png')
master.save(ROOT/'desktop/icon.ico',sizes=[(16,16),(24,24),(32,32),(48,48),(64,64),(128,128),(256,256)])
print('Pembe Seiri roketi ve sürüm bilgisi üretildi:',meta['version'])
