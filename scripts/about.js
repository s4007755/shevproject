(() => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

/* Mobile nav */
(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('siteNav');
  const backdrop = document.getElementById('navBackdrop');
  if (!header || !toggle || !nav || !backdrop) return;

  function openNav(){ header.classList.add('nav-open'); toggle.setAttribute('aria-expanded','true'); backdrop.hidden = false; }
  function closeNav(){ header.classList.remove('nav-open'); toggle.setAttribute('aria-expanded','false'); backdrop.hidden = true; }
  function toggleNav(){ header.classList.contains('nav-open') ? closeNav() : openNav(); }

  toggle.addEventListener('click', toggleNav);
  nav.addEventListener('click', e => { if (e.target.tagName === 'A') closeNav(); });
  backdrop.addEventListener('click', closeNav);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
})();

/* Heart field background */
(() => {
  const c = document.getElementById('heartField');
  if (!c) return;
  const ctx = c.getContext('2d', { alpha:true });
  let W=0,H=0,dpr=Math.max(1,Math.min(2,window.devicePixelRatio||1));

  function resize(){ W=window.innerWidth; H=window.innerHeight; c.width=Math.floor(W*dpr); c.height=Math.floor(H*dpr); ctx.setTransform(dpr,0,0,dpr,0,0); }
  resize(); window.addEventListener('resize', resize);

  function drawHeartPath(ctx,s){
    const w=s,h=s,top=-h*.25,bottom=h*.45,left=-w*.5,right=w*.5;
    ctx.beginPath(); ctx.moveTo(0,bottom);
    ctx.bezierCurveTo(left*.6,bottom*.2,left,top,0,top+h*.18);
    ctx.bezierCurveTo(right,top,right*.6,bottom*.2,0,bottom);
    ctx.closePath();
  }
  function fillHeart(x,y,s,a){
    ctx.save(); ctx.translate(x,y); ctx.globalAlpha=a;
    const g=ctx.createLinearGradient(-s,-s,s,s); g.addColorStop(0,'#ff4d7e'); g.addColorStop(1,'#ff96b0');
    ctx.fillStyle=g; drawHeartPath(ctx,s); ctx.fill(); ctx.restore();
  }

  const hearts=[]; const MAX=160; const pointer={x:null,y:null,active:false}; const r=(a,b)=>a+Math.random()*(b-a);
  function makeHeart(x=r(0,W),y=r(0,H),burst=false){ const s=burst?r(18,30):r(10,22);
    hearts.push({x,y,s,vx:r(-.25,.25),vy:r(-.6,-.1),a:r(.6,1),life:r(4.5,7.5),t:0}); }

  for(let i=0;i<90;i++) makeHeart(r(0,W),r(H*.3,H));

  function step(dt){
    ctx.clearRect(0,0,W,H);
    if(hearts.length<MAX && Math.random()<.7) makeHeart();
    for(let i=0;i<hearts.length;i++){
      const h=hearts[i];
      if(pointer.active && pointer.x!=null){
        const dx=pointer.x-h.x, dy=pointer.y-h.y, d2=Math.max(80,dx*dx+dy*dy);
        h.vx += (dx/d2)*12; h.vy += (dy/d2)*12;
      }
      h.x+=h.vx; h.y+=h.vy; h.vy+=.01; h.t+=dt; h.a=Math.max(0,h.a-dt/h.life);
      if(h.x<-40) h.x=W+40; if(h.x>W+40) h.x=-40;
      if(h.y<-60 || h.a<=0){ h.x=r(0,W); h.y=H+r(10,120); h.vx=r(-.25,.25); h.vy=r(-.7,-.2); h.a=r(.6,1); h.life=r(4.5,7.5); h.t=0; }
      fillHeart(h.x,h.y,h.s,h.a);
    }
  }
  let last=performance.now();
  function loop(now=performance.now()){ const dt=Math.min(.05,(now-last)/1000); last=now; step(dt); requestAnimationFrame(loop); }
  requestAnimationFrame(loop);

  function setPointer(e,active){ const x=e.touches?e.touches[0].clientX:e.clientX; const y=e.touches?e.touches[0].clientY:e.clientY; pointer.x=x; pointer.y=y; pointer.active=active; }
  document.addEventListener('mousemove',e=>setPointer(e,true),{passive:true});
  document.addEventListener('mouseleave',()=>{pointer.active=false},{passive:true});
  document.addEventListener('touchmove',e=>setPointer(e,true),{passive:true});
  document.addEventListener('touchend',()=>{pointer.active=false},{passive:true});
  document.addEventListener('touchcancel',()=>{pointer.active=false},{passive:true});

  function burst(x,y,count=24){ for(let i=0;i<count;i++) makeHeart(x+r(-10,10),y+r(-10,10),true); }
  document.addEventListener('click',e=>{ burst(e.clientX,e.clientY,28); },{passive:true});
  const btn=document.getElementById('sparkBtn'); if(btn){ btn.addEventListener('click',()=>{ burst(window.innerWidth/2,140,36); }); }
})();

/* Timeline polish: uniform photo box + lightbox + expand */
(() => {
  const cards = document.querySelectorAll('.tl-card');
  if (!cards.length) return;

  // Reveal animation on scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target); }});
  }, {rootMargin:'0px 0px -10% 0px', threshold:.12});
  cards.forEach(c=>io.observe(c));

  // 1) Wrap images in a uniform aspect-ratio box + zoom button
  cards.forEach(card=>{
    const img = card.querySelector('.tl-photo');
    if(!img) return;

    const wrap = document.createElement('div');
    wrap.className = 'tl-photo-wrap';
    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);

    const zoom = document.createElement('button');
    zoom.className = 'tl-zoom';
    zoom.type = 'button';
    zoom.innerHTML = '↗';
    zoom.title = 'Open image';
    wrap.appendChild(zoom);

    zoom.addEventListener('click', ()=> openLightbox(card, img));
    img.addEventListener('click', ()=> openLightbox(card, img));
  });

  // 2) Expand/collapse for long text
  cards.forEach(card=>{
    const btn = card.querySelector('.btn-more');
    const para = card.querySelector('p');
    if(!btn || !para) return;

    // Only show "Read more" if it exceeds 3 lines (approx detection after paint)
    requestAnimationFrame(()=>{
      const lineHeight = parseFloat(getComputedStyle(para).lineHeight) || 22;
      const lines = Math.round(para.scrollHeight / lineHeight);
      if (lines <= 3) {
        btn.style.display = 'none';
      }
    });

    btn.addEventListener('click', ()=>{
      const expanded = card.classList.toggle('expanded');
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      btn.textContent = expanded ? 'Show less' : 'Read more';
    });
  });

  // 3) Lightbox logic (accessible)
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbCap = document.getElementById('lightboxCap');
  const lbClose = document.querySelector('.lightbox-close');

  function openLightbox(card, img){
    const full = card.getAttribute('data-full') || img.getAttribute('src');
    lbImg.src = full;
    const title = card.querySelector('h3')?.textContent?.trim() || '';
    const date  = card.querySelector('.tl-date')?.textContent?.trim() || '';
    lbCap.textContent = [title, date].filter(Boolean).join(' — ');
    lightbox.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){
    lightbox.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    lbImg.src = '';
    lbCap.textContent = '';
  }

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e)=>{ if(lightbox.getAttribute('aria-hidden')==='false' && (e.key==='Escape' || e.key==='Esc')) closeLightbox(); });
})();
