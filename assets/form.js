/* Offertformular: prüft die Eingaben und sendet sie an den Formular-Dienst.
   Funktioniert auch ohne JavaScript (normaler POST, Weiterleitung auf offerte-danke.html). */
(function(){
  var form=document.getElementById('offerte-form'); if(!form) return;
  var status=document.getElementById('of-status'), btn=document.getElementById('of-send');
  form.elements.t.value=String(Date.now());

  // Modell aus dem Link vorwählen (?modell=halfmoon | fullmoon)
  try{
    var m=new URLSearchParams(location.search).get('modell'), sel=form.elements.modell;
    if(m&&sel){[].forEach.call(sel.options,function(o){
      if(o.value.toLowerCase().indexOf(m.toLowerCase())===0) sel.value=o.value;
    });}
  }catch(e){}

  function say(msg,cls){status.textContent=msg;status.className='of-status '+(cls||'')}
  function mark(el,bad){var f=el.closest('.f'); if(f) f.classList.toggle('bad',bad)}

  form.addEventListener('submit',function(ev){
    ev.preventDefault();
    var ok=true, first=null;
    ['name','organisation','email'].forEach(function(n){
      var el=form.elements[n], v=(el.value||'').trim(), bad=!v;
      if(n==='email') bad=!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      mark(el,bad); if(bad){ok=false; first=first||el}
    });
    var cb=form.elements.datenschutz; mark(cb,!cb.checked); if(!cb.checked){ok=false; first=first||cb}
    if(!ok){say('Bitte füllen Sie die markierten Felder aus.','err'); if(first) first.focus(); return}

    var url=form.getAttribute('action')||'';
    if(url.indexOf('REPLACE-WORKER-URL')!==-1){say('Das Formular ist noch nicht aktiv.','err'); return}

    btn.disabled=true; say('Wird gesendet …');
    fetch(url,{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}})
      .then(function(r){return r.json().catch(function(){return{}}).then(function(j){return{ok:r.ok&&j.ok,j:j}})})
      .then(function(res){
        if(res.ok){ location.href='offerte-danke.html'; return }
        throw new Error('send');
      })
      .catch(function(){
        btn.disabled=false;
        say('Das Senden hat nicht geklappt. Bitte versuchen Sie es später erneut oder schreiben Sie uns über theshopmaker.ch.','err');
      });
  });
})();
