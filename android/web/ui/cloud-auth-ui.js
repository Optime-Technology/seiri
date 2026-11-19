'use strict';
/** Hesap durumu IPC ile okunur. Tokenlar DOM'a, yerel yedeğe veya localStorage'a konmaz. */
window.SeiriCloudAuth=(()=>{
 const bridge=window.ZamanDesktop;let state=null,busy=false,host=null,notice='';
 const escape=text=>String(text??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function accept(value){if(!value||typeof value.version!=='number'||state&&value.version<state.version)return;state=value;render();}
 function button(id,label,primary=false,disabled=false){return '<button type="button" id="'+id+'" class="'+(primary?'primary drawerSave':'outline drawerTest')+'" '+(disabled?'disabled':'')+'>'+label+'</button>';}
 function render(){if(!host?.isConnected||!host.hasAttribute('data-cloud-auth'))return;
  const s=state,status=s?(s.pending?'Tarayıcıda Google girişini tamamla.':s.checking?'Hesap doğrulanıyor…':s.verified?'Google hesabı ve kişisel çalışma alanı doğrulandı.':s.hasSession?'Oturum bu cihazda kayıtlı; sunucu doğrulaması bekleniyor.':'Google hesabıyla giriş yapılmadı.'):'Hesap durumu okunuyor…';
  host.innerHTML='<div class="drawerIntro"><h3>Hesap ve bağlantı</h3><p>Google ile giriş sistem tarayıcısında açılır. Oturum Android Keystore korumasıyla şifreli saklanır.</p></div><p id="cloudAuthStatus" role="status" aria-live="polite">'+escape(status)+'</p>'+(s?.user?'<div class="drawerIntro"><strong>'+escape(s.user.name||'Google hesabı')+'</strong><p>'+escape(s.user.email)+'</p></div>':'')+(s?.workspace?'<p>Kişisel alan: '+escape(s.workspace.name)+'</p>':'')+'<p class="drawerFootnote">Hesaba özel alan ve yerel aktarım seçenekleri aşağıdadır. Yerel profilin Google profilinden bağımsızdır.</p><p id="cloudAuthError" role="alert">'+escape(notice||s?.message||'')+'</p>'+
  (s?.pending?button('cloudCancel','Girişi iptal et',false,busy):s?.hasSession?button('cloudRefresh','Bağlantıyı doğrula',true,busy||s.checking)+button('cloudLogout','Bu cihazdan çıkış yap',false,busy):button('cloudSignIn','Google ile giriş yap',true,busy||!s?.configured||!s?.secureReady)+button('cloudRefresh','Yeniden kontrol et',false,busy)+button('cloudLogout','Kayıtlı oturumu temizle',false,busy))+
  '<details class="drawerIntro"><summary>Giriş dönüş adresi</summary><p>Proje yöneticisi: Supabase → Authentication → URL Configuration → Redirect URLs alanına aşağıdaki adresi ekle. Google Cloud içindeki Supabase callback adresini değiştirme.</p><input id="cloudRedirect" readonly aria-label="Supabase izin verilen dönüş adresi" value="com.zaman.ajanda://auth/callback/*"><p>Adresi seçip kopyalayabilirsin.</p></details>';
  for(const [id,method]of Object.entries({cloudSignIn:'cloudAuthSignIn',cloudRefresh:'cloudAuthRefresh',cloudCancel:'cloudAuthCancel',cloudLogout:'cloudAuthSignOut'})){const b=host.querySelector('#'+id);if(b)b.onclick=()=>act(method);}
  const input=host.querySelector('#cloudRedirect');input.onclick=()=>input.select();window.SeiriSync?.mount(host);
 }
 async function act(method){if(busy||typeof bridge?.[method]!=='function')return;busy=true;notice='';render();try{if(method==='cloudAuthSignOut'&&window.SeiriSync){if(window.ZamanStudy?.isWriting()&&!await window.ZamanStudy.closeWriter())throw Error();if(window.ZamanStudy?.getTimer()?.phase==='running'){notice='Çıkış yapmadan önce odak zamanlayıcısını duraklat.';return;}}const reply=await bridge[method]();accept(reply.state);if(!reply.ok)notice=reply.message||'İşlem tamamlanamadı. Yeniden dene.';else if(reply.revoked===false)notice='Bu cihazdaki oturum temizlendi. Sunucudaki çıkış bağlantı olmadığı için doğrulanamadı.';}catch{notice='Hesap işlemi tamamlanamadı. Yeniden dene.';}finally{busy=false;render();}}
 async function refreshInfo(){try{const reply=await bridge.cloudAuthInfo();accept(reply.state);}catch{notice='Hesap durumu okunamadı.';render();}}
 function mount(element){host=element;host.setAttribute('data-cloud-auth','');render();refreshInfo();}
 if(bridge?.cloudAuthInfo){bridge.onCloudAuthChanged?.(accept);refreshInfo();}
 // Başka ayar sekmesinin içeriği arka plandaki durum bildirimiyle değiştirilmez.
 const observer=new MutationObserver(()=>{if(host&&!host.querySelector('#cloudAuthStatus'))host.removeAttribute('data-cloud-auth');});observer.observe(document.body,{childList:true,subtree:true});
 return Object.freeze({mount});
})();
