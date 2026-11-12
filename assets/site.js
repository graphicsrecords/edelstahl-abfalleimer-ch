/* Edelstahl-Abfalleimer.ch – Seitenverhalten und Klick-Messung
   Klicks auf "Offerte anfragen" werden als Ereignis gemeldet, sobald Google Analytics
   oder Google Tag Manager auf der Seite eingebunden ist. Ohne Analytics passiert nichts. */
(function(){
  var h=document.getElementById('top');
  var els=[].slice.call(document.querySelectorAll('.rv'));
  function check(){
    if(h && !h.hasAttribute('data-solid')) h.classList.toggle('solid',window.scrollY>40);
    var lim=window.innerHeight*0.92;
    els=els.filter(function(e){
      if(e.getBoundingClientRect().top<lim){e.classList.add('in');return false}
      return true;
    });
  }
  check();
  window.addEventListener('scroll',check,{passive:true});
  window.addEventListener('resize',check);
  window.addEventListener('load',check);
  setTimeout(check,400);

  [].forEach.call(document.querySelectorAll('.gallery,.hero-rail'),function(g){
    var r=g.querySelector('.rail');
    [].forEach.call(g.querySelectorAll('.bar button'),function(b){
      b.addEventListener('click',function(){
        r.scrollBy({left:(+b.getAttribute('data-dir'))*r.clientWidth*0.8,behavior:'smooth'});
      });
    });
  });

  document.addEventListener('click',function(ev){
    var a=ev.target.closest&&ev.target.closest('a[data-track]');
    if(!a) return;
    var name=a.getAttribute('data-track');
    try{
      window.dataLayer=window.dataLayer||[];
      window.dataLayer.push({event:'offerte_click',link_name:name,link_url:a.href});
      if(typeof window.gtag==='function'){window.gtag('event','offerte_click',{link_name:name,link_url:a.href});}
    }catch(e){}
  });
})();
