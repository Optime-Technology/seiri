#!/usr/bin/env python3
"""Örnek kullanmadan sabit seed ile ses üretir. Gerekenler: numpy, scipy, ffmpeg.
Çalıştırma: python tools/generate_sounds.py
FFT renk eğimi, filtreler, damla seviyesi ve seed aşağıdan ayarlanabilir.
"""
from pathlib import Path
import argparse,hashlib,json,subprocess,tempfile
import numpy as np
from scipy.io import wavfile
from scipy.signal import welch
SEED=20261112
RATE=48000
DURATION=120
CROSSFADE=4
TARGET_LUFS=-25.0
ROOT=Path(__file__).resolve().parents[1]
def ff(args):
 return subprocess.run(['ffmpeg','-hide_banner','-nostdin',*args],capture_output=True,text=True,check=True)
def measure(path):
 r=ff(['-i',str(path),'-af','loudnorm=I=-25:TP=-3:LRA=7:print_format=json','-f','null','-'])
 return json.loads(r.stderr[r.stderr.rfind('{'):r.stderr.rfind('}')+1])
def signal(kind):
 rng=np.random.default_rng(SEED+(kind=='rain'));n=(DURATION+CROSSFADE)*RATE
 frequencies=np.fft.rfftfreq(n,1/RATE);safe=np.maximum(frequencies,1)
 # Güç spektrumu kahverengide 1/f², yağmurda 1/f^1.35.
 power=2 if kind=='brown' else 1.35
 amplitude=safe**(-power/2)
 # 20 Hz altını ve tizleri yumuşak Butterworth biçimli eğrilerle bastır.
 amplitude*=1/np.sqrt(1+(20/safe)**8)
 cutoff=6000 if kind=='brown' else 1800
 amplitude*=1/np.sqrt(1+(safe/cutoff)**8);amplitude[0]=0
 spectrum=np.fft.rfft(rng.normal(size=n));spectrum*=amplitude
 x=np.fft.irfft(spectrum,n=n);x/=np.std(x)
 if kind=='rain':
  # Seyrek, düşük seviyeli ve yumuşak zarflı sentetik damlalar.
  for _ in range(150):
   count=int(rng.uniform(.08,.22)*RATE);at=int(rng.integers(0,n-count))
   t=np.arange(count)/RATE;envelope=np.sin(np.pi*np.arange(count)/(count-1))**2
   drop=np.sin(2*np.pi*rng.uniform(240,850)*t)*envelope
   x[at:at+count]+=rng.uniform(.018,.045)*drop
 k=CROSSFADE*RATE;w=(.5-.5*np.cos(np.linspace(0,np.pi,k)))
 # Çıkışın son örneği x[k-1]'e; ilk örneği x[k]'ye komşudur.
 x=np.concatenate([x[k:DURATION*RATE],x[DURATION*RATE:]*(1-w)+x[:k]*w])
 x-=x.mean();return x.astype(np.float32)
def main():
 parser=argparse.ArgumentParser();parser.add_argument('--output',type=Path,default=ROOT/'web/audio');args=parser.parse_args();args.output.mkdir(parents=True,exist_ok=True)
 report={'seed':SEED,'sample_rate':RATE,'duration_seconds':DURATION,'crossfade_seconds':CROSSFADE,'target_lufs':TARGET_LUFS,'sounds':{}}
 with tempfile.TemporaryDirectory() as temp:
  temp=Path(temp)
  for kind in ['brown','rain']:
   x=signal(kind);raw=temp/(kind+'.wav');wavfile.write(raw,RATE,x)
   stats=measure(raw);gain=10**((TARGET_LUFS-float(stats['input_i']))/20)
   peak=float(stats['input_tp'])+20*np.log10(gain)
   if peak>-3.5:raise RuntimeError('Tepe sınırı için üretim parametrelerini düzelt.')
   x*=gain;wavfile.write(raw,RATE,x)
   artifacts=[]
   for extension,codec,bitrate in [('ogg','libopus','96k'),('m4a','aac','96k')]:
    dest=args.output/(kind+'.'+extension)
    ff(['-y','-fflags','+bitexact','-i',str(raw),'-map_metadata','-1','-c:a',codec,'-b:a',bitrate,'-flags:a','+bitexact','-fflags','+bitexact',str(dest)])
    measured=measure(dest)
    assert dest.stat().st_size<3_000_000
    assert -26<=float(measured['input_i'])<=-23
    assert float(measured['input_tp'])<=-3
    decoded=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',str(dest),'-f','f32le','-ac','1','-ar',str(RATE),'-'],capture_output=True,check=True).stdout,dtype='<f4')
    step=float(abs(decoded[-1]-decoded[0]));p99=float(np.quantile(abs(np.diff(decoded)),.99))
    assert step<p99
    artifacts.append({'decoded_seconds':len(decoded)/RATE,'decoded_loop_step':step,'decoded_step_p99':p99,'file':dest.name,'bytes':dest.stat().st_size,'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'integrated_lufs':float(measured['input_i']),'true_peak_dbtp':float(measured['input_tp'])})
   f,p=welch(x,fs=RATE,nperseg=16384);band=(f>=100)&(f<=1500)
   slope=float(np.polyfit(np.log2(f[band]),10*np.log10(p[band]),1)[0])
   # Döngü sınırı adımı, içerikteki doğal örnek adımlarıyla karşılaştırılır.
   report['sounds'][kind]={'spectrum_db_per_octave_100_1500hz':round(slope,3),'loop_step':float(abs(x[-1]-x[0])),'step_99_percentile':float(np.quantile(abs(np.diff(x)),.99)),'artifacts':artifacts}
   print(kind,artifacts,flush=True)
 (args.output/'analysis.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps(report,ensure_ascii=False,indent=2))
if __name__=='__main__':main()
