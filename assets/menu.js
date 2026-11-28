/* Edelstahl-Abfalleimer.ch – Menü: Auswahlmenüs, mobiles Menü, Kopfzeile beim Scrollen, Fusszeilen-Gruppen */
(function(){
  var h=document.getElementById('top'); if(!h) return;
  var dds=[].slice.call(h.querySelectorAll('.dd'));
  var burger=h.querySelector('.hz-burger');
  function closeAll(except){dds.forEach(function(d){if(d!==except){d.classList.remove('open');var b=d.querySelector('.dd-btn');if(b)b.setAttribute('aria-expanded','false');}});}
  dds.forEach(function(d){
    var b=d.querySelector('.dd-btn');
    b.addEventListener('click',function(e){e.stopPropagation();var hov=window.matchMedia('(hover:hover) and (min-width:861px)').matches;var o=hov?true:!d.classList.contains('open');closeAll(d);d.classList.toggle('open',o);b.setAttribute('aria-expanded',o?'true':'false');});
    d.addEventListener('mouseenter',function(){if(window.matchMedia('(hover:hover) and (min-width:861px)').matches){closeAll(d);d.classList.add('open');b.setAttribute('aria-expanded','true');}});
    d.addEventListener('mouseleave',function(){if(window.matchMedia('(hover:hover) and (min-width:861px)').matches){d.classList.remove('open');b.setAttribute('aria-expanded','false');}});
  });
  document.addEventListener('click',function(e){if(!h.contains(e.target)){closeAll();setMenu(false);}});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeAll();setMenu(false);}});
  function setMenu(o){h.classList.toggle('menu-open',o);if(burger){burger.setAttribute('aria-expanded',o?'true':'false');burger.setAttribute('aria-label',o?'Menü schliessen':'Menü öffnen');}document.documentElement.classList.toggle('menu-lock',o);}
  if(burger) burger.addEventListener('click',function(e){e.stopPropagation();setMenu(!h.classList.contains('menu-open'));});
  h.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a');if(a){closeAll();setMenu(false);}});

  /* Fusszeile: Gruppen am Handy ein- und ausklappbar, am Desktop immer offen */
  var mq=window.matchMedia('(max-width:900px)');
  var cols=[].slice.call(document.querySelectorAll('footer.fz details.fz-col'));
  function sync(){cols.forEach(function(c){if(!mq.matches){c.open=true;}else if(!c.hasAttribute('data-init')){c.open=false;c.setAttribute('data-init','1');}});}
  cols.forEach(function(c){c.querySelector('summary').addEventListener('click',function(e){if(!mq.matches)e.preventDefault();});});
  sync(); (mq.addEventListener?mq.addEventListener('change',sync):mq.addListener(sync));
})();
