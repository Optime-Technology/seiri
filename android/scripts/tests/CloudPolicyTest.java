import com.zaman.ajanda.CloudPolicy;
public class CloudPolicyTest {
    interface Action { void run() throws Exception; }
    static void denied(Action a) throws Exception { try { a.run(); } catch(Exception expected) { return; } throw new Exception("Geçersiz OAuth girdisi kabul edildi."); }
    public static void main(String[] args) throws Exception {
        String nonce="a".repeat(64),redirect=CloudPolicy.redirect(nonce),origin="https://abcdefghijklmnopqrst.supabase.co";
        if(!"valid-code".equals(CloudPolicy.callback(redirect+"?code=valid-code",nonce,100,200).get("code")))throw new Exception();
        denied(()->CloudPolicy.callback(redirect+"?code=x",nonce,201,200));
        denied(()->CloudPolicy.callback(redirect.replace(nonce,"b".repeat(64))+"?code=x",nonce,100,200));
        denied(()->CloudPolicy.callback("https://evil.example/callback/"+nonce+"?code=x",nonce,100,200));
        denied(()->CloudPolicy.callback(redirect+"?code=x&code=y",nonce,100,200));
        denied(()->CloudPolicy.callback(redirect+"?code=x#access_token=leak",nonce,100,200));
        denied(()->CloudPolicy.callback("com.zaman.ajanda://attacker@auth/callback/"+nonce+"?code=x",nonce,100,200));
        String authorize=origin+"/auth/v1/authorize?provider=google&redirect_to="+java.net.URLEncoder.encode(redirect,"UTF-8")+"&code_challenge_method=s256&code_challenge="+"z".repeat(43);
        CloudPolicy.authorize(authorize,origin,nonce);
        denied(()->CloudPolicy.authorize(authorize.replace("provider=google","provider=evil"),origin,nonce));
        denied(()->CloudPolicy.authorize(authorize.replace(origin,"https://evil.example"),origin,nonce));
        denied(()->CloudPolicy.authorize(authorize.replace("s256","plain"),origin,nonce));
        denied(()->CloudPolicy.authorize(authorize.replace("code_challenge=","code_challenge=&extra="),origin,nonce));
        System.out.println("PASS: Android OAuth nonce/süre/host/PKCE; tekrar parametre, fragment, sahte sağlayıcı ve yönlendirme reddi (JVM). ");
    }
}
