(function(){
  var tiles=document.querySelectorAll('[data-gal]');
  tiles.forEach(function(t){
    var slides=[].slice.call(t.querySelectorAll('.mslide')),
        thumbs=[].slice.call(t.querySelectorAll('.mthumbs button')),
        count=t.querySelector('.mcount'),box=t.querySelector('.mph'),i=0,n=slides.length;
    if(n<2)return;
    function load(k){var im=slides[k].querySelector('img[data-src]');if(im){im.src=im.getAttribute('data-src');im.removeAttribute('data-src');}}
    function go(k){
      i=(k+n)%n;load(i);load((i+1)%n);
      slides.forEach(function(s,j){s.classList.toggle('is-on',j===i)});
      thumbs.forEach(function(b,j){if(j===i)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current')});
      if(count)count.textContent=(i+1)+' / '+n;
    }
    t.querySelector('.prev').addEventListener('click',function(){go(i-1)});
    t.querySelector('.next').addEventListener('click',function(){go(i+1)});
    thumbs.forEach(function(b,j){b.addEventListener('click',function(){go(j)})});
    box.setAttribute('tabindex','0');
    box.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){go(i-1);e.preventDefault()}else if(e.key==='ArrowRight'){go(i+1);e.preventDefault()}});
    var x0=null;
    box.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
    box.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>40)go(dx<0?i+1:i-1)},{passive:true});
    var warm=function(){load(1);t.removeEventListener('pointerenter',warm)};
    t.addEventListener('pointerenter',warm);
    if('IntersectionObserver' in window){new IntersectionObserver(function(en,o){if(en[0].isIntersecting){load(1);o.disconnect()}},{rootMargin:'300px'}).observe(t)}
  });
})();
