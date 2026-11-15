(function(){
  var d=document,root=d.documentElement;root.classList.add('js');
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ua=navigator.userAgent||'';
  var isAndroid=/Android/i.test(ua),isIOS=/iPhone|iPad|iPod/i.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  // the visitor's own store comes first and is highlighted
  if(isAndroid||isIOS)d.querySelectorAll(isAndroid?'.store.gp':'.store.as').forEach(function(a){a.classList.add('me')});

  // ---- equalizer ring ----
  var eq=d.getElementById('eq'),N=innerWidth<700?30:44,h='';
  for(var i=0;i<N;i++)h+='<b style="--a:'+(360/N*i).toFixed(1)+'deg;--d:-'+(Math.random()*1.6).toFixed(2)+'s"><i style="animation-duration:'+(.7+Math.random()*.9).toFixed(2)+'s"></i></b>';
  eq.innerHTML=h;

  // ---- screens ----
  var shots=[].slice.call(d.querySelectorAll('.screen img')),dots=[].slice.call(d.querySelectorAll('.dots i')),cap=d.getElementById('capt'),cur=0;
  var caps=['מספרים על מי השיר','המילים נכתבות בשבילכם','בוחרים סגנון, אווירה וכלים','מקבלים שתי גרסאות לבחירה','והופכים את השיר לקליפ'];
  function show(n){cur=n;shots.forEach(function(s,i){s.classList.toggle('on',i===n)});dots.forEach(function(s,i){s.classList.toggle('on',i===n)});cap.textContent=caps[n]}
  if(!reduce)setInterval(function(){show((cur+1)%shots.length)},3200);

  // ---- phone: steady automatic motion + drag / mouse impulse with spring ----
  var stage=d.getElementById('stage'),rig=d.getElementById('rig'),glare=d.getElementById('glare');
  var ry=-18,rx=6,vy=0,vx=0,off=0,offV=0,mx=0,my=0,drag=false,lx=0,t0=performance.now(),seen=true;
  stage.addEventListener('pointerdown',function(e){drag=true;lx=e.clientX});
  addEventListener('pointermove',function(e){
    if(drag){var dx=e.clientX-lx;lx=e.clientX;off+=dx*.45;offV=dx*.45}
    else if(e.pointerType==='mouse'){mx=(e.clientX/innerWidth-.5)*2;my=(e.clientY/innerHeight-.5)*2}
  },{passive:true});
  ['pointerup','pointercancel'].forEach(function(n){addEventListener(n,function(){drag=false})});
  new IntersectionObserver(function(en){seen=en[0].isIntersecting}).observe(stage);
  function frame(now){
    requestAnimationFrame(frame);if(!seen)return;
    var t=(now-t0)/1000;
    if(!drag){offV+=(-off)*.012;offV*=.93;off+=offV}
    var ty=-16+Math.sin(t*.55)*17+mx*14+off,tx=5+Math.sin(t*.4)*3-my*7;
    vy+=(ty-ry)*.06;vy*=.78;ry+=vy;vx+=(tx-rx)*.06;vx*=.78;rx+=vx;
    rig.style.transform='rotateX('+rx.toFixed(2)+'deg) rotateY('+ry.toFixed(2)+'deg)';
    glare.style.backgroundPosition=(50+ry*1.6).toFixed(1)+'% 0';
  }
  if(reduce)rig.style.transform='rotateX(4deg) rotateY(-14deg)';else requestAnimationFrame(frame);

  // ---- depth carousel ----
  var cf=d.getElementById('cf'),figs=[].slice.call(cf.children),tick=false;
  function lay(){tick=false;var c=cf.scrollLeft+cf.clientWidth/2;
    figs.forEach(function(f){var w=f.offsetWidth,k=(f.offsetLeft+w/2-c)/w,a=Math.min(Math.abs(k),2.5);
      f.style.transform='perspective(1000px) translateZ('+(-a*90).toFixed(1)+'px) rotateY('+Math.max(-48,Math.min(48,-k*34)).toFixed(1)+'deg) scale('+(1-Math.min(a,1.5)*.1).toFixed(3)+')';
      f.style.opacity=(1-Math.min(a,2)*.3).toFixed(2);f.style.zIndex=String(10-Math.round(a*3))})}
  cf.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(lay)}},{passive:true});
  figs.forEach(function(f){f.addEventListener('click',function(){cf.scrollTo({left:f.offsetLeft+f.offsetWidth/2-cf.clientWidth/2,behavior:reduce?'auto':'smooth'})})});
  addEventListener('resize',lay);if(innerWidth>=900){var m=figs[2];cf.scrollLeft=m.offsetLeft+m.offsetWidth/2-cf.clientWidth/2}else cf.scrollLeft=cf.scrollWidth;lay();setTimeout(lay,300);

  // ---- cards tilt (mouse only) ----
  d.querySelectorAll('.card').forEach(function(c){
    c.addEventListener('pointermove',function(e){if(e.pointerType!=='mouse'||reduce)return;var b=c.getBoundingClientRect(),x=(e.clientX-b.left)/b.width,y=(e.clientY-b.top)/b.height;
      c.style.setProperty('--mx',(x*100)+'%');c.style.setProperty('--my',(y*100)+'%');
      c.style.transform='rotateX('+((.5-y)*10).toFixed(1)+'deg) rotateY('+((x-.5)*12).toFixed(1)+'deg) translateZ(8px)'});
    c.addEventListener('pointerleave',function(){c.style.transform=''})});

  // ---- reveal + bottom bar ----
  var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15});
  d.querySelectorAll('.rv').forEach(function(e){io.observe(e)});
  var bar=d.getElementById('bar'),top=false,end=false;
  function sb(){bar.classList.toggle('show',!top&&!end)}
  new IntersectionObserver(function(en){top=en[0].isIntersecting;sb()}).observe(d.getElementById('stores'));
  new IntersectionObserver(function(en){end=en[0].isIntersecting;sb()}).observe(d.getElementById('stores2'));

  // ---- background particles ----
  var cv=d.getElementById('fx');if(reduce||!cv.getContext)return;
  var g=cv.getContext('2d'),W,H,dpr=Math.min(devicePixelRatio||1,2),P=[],n=innerWidth<700?26:60;
  function size(){W=cv.width=innerWidth*dpr;H=cv.height=innerHeight*dpr}
  size();addEventListener('resize',size);
  for(var j=0;j<n;j++)P.push({x:Math.random(),y:Math.random(),z:.2+Math.random()*.8,s:Math.random()*6.28});
  (function loop(now){requestAnimationFrame(loop);if(d.hidden)return;g.clearRect(0,0,W,H);
    for(var k=0;k<P.length;k++){var p=P[k];p.y-=.00035*p.z;if(p.y<-.03){p.y=1.03;p.x=Math.random()}
      var x=(p.x+Math.sin(now/2600+p.s)*.012)*W,y=p.y*H,r=(.6+p.z*1.9)*dpr;
      g.globalAlpha=.12+p.z*.5*(.6+.4*Math.sin(now/900+p.s));g.fillStyle='#2dff7a';g.beginPath();g.arc(x,y,r,0,6.283);g.fill()}
  })(0);
})();
