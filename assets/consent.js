/* Edelstahl-Abfalleimer.ch – Einwilligung und Messung
   Solange GA_ID und ADS_ID leer sind, setzt die Website keine Cookies, zeigt kein Banner
   und lädt keine Fremdskripte. Sobald eine ID eingetragen ist, erscheint das Banner und
   Google lädt erst nach Klick auf "Akzeptieren". */
(function(){
  var GA_ID='';            // z. B. 'G-XXXXXXXXXX' (Google Analytics 4)
  var ADS_ID='';           // z. B. 'AW-XXXXXXXXXX' (Google Ads)
  var ADS_LABEL='';        // Conversion-Label für offerte_click, z. B. 'AbC-D_efG-h12345'
  var KEY='ea_consent_v1';
  var active=!!(GA_ID||ADS_ID);
  var show=function(sel,on){[].forEach.call(document.querySelectorAll(sel),function(e){if(on)e.removeAttribute('hidden');else e.setAttribute('hidden','')})};
  show('[data-consent-on]',active); show('[data-consent-off]',!active);
  if(!active) return;
  window.dataLayer=window.dataLayer||[];
  function gtag(){window.dataLayer.push(arguments)}
  window.gtag=gtag;
  gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  function get(){try{return localStorage.getItem(KEY)}catch(e){return null}}
  function set(v){try{localStorage.setItem(KEY,v)}catch(e){}}
  function load(){
    if(window.__gl) return; window.__gl=1;
    gtag('consent','update',{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});
    var s=document.createElement('script'); s.async=true;
    s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(GA_ID||ADS_ID);
    document.head.appendChild(s);
    gtag('js',new Date());
    if(GA_ID) gtag('config',GA_ID,{anonymize_ip:true});
    if(ADS_ID) gtag('config',ADS_ID);
  }
  document.addEventListener('click',function(ev){
    if(!ADS_ID||!ADS_LABEL||get()!=='yes') return;
    var a=ev.target.closest&&ev.target.closest('a[data-track]');
    if(a) gtag('event','conversion',{send_to:ADS_ID+'/'+ADS_LABEL});
  });
  function banner(){
    if(document.getElementById('ea-cb')) return;
    var st=document.createElement('style');
    st.textContent='#ea-cb{position:fixed;left:1rem;right:1rem;bottom:1rem;z-index:99;max-width:560px;margin:0 auto;background:#0a1730;color:#dfe6f5;border:1px solid rgba(255,255,255,.2);border-radius:10px;padding:1rem 1.2rem;box-shadow:0 12px 40px rgba(0,0,0,.45);font:400 .88rem/1.55 Inter,system-ui,sans-serif}#ea-cb a{color:#fff;text-decoration:underline}#ea-cb div{display:flex;gap:.6rem;margin-top:.8rem}#ea-cb button{flex:1;padding:.6rem 1rem;border-radius:6px;border:1px solid rgba(255,255,255,.35);background:transparent;color:#fff;font:inherit;font-weight:500;cursor:pointer}#ea-cb button.ok{background:#fff;color:#0a1730}';
    document.head.appendChild(st);
    var b=document.createElement('div'); b.id='ea-cb'; b.setAttribute('role','dialog'); b.setAttribute('aria-label','Cookies und Messung');
    b.innerHTML='<p style="margin:0">Wir möchten mit Google Analytics und Google Ads messen, wie die Website genutzt wird, um sie und unsere Werbung zu verbessern. Das geschieht nur mit Ihrer Einwilligung. Details in der <a href="datenschutz.html">Datenschutzerklärung</a>.</p><div><button type="button" data-v="no">Ablehnen</button><button type="button" class="ok" data-v="yes">Akzeptieren</button></div>';
    b.addEventListener('click',function(e){var v=e.target.getAttribute&&e.target.getAttribute('data-v'); if(!v) return; set(v); b.remove(); if(v==='yes') load();});
    document.body.appendChild(b);
  }
  document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('[data-consent-open]')){e.preventDefault();try{localStorage.removeItem(KEY)}catch(x){} banner();}});
  var c=get();
  if(c==='yes') load(); else if(c!=='no') banner();
})();
