(() => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('siteNav');
  const backdrop = document.getElementById('navBackdrop');
  if (!header || !toggle || !nav || !backdrop) return;

  function openNav(){ header.classList.add('nav-open'); toggle.setAttribute('aria-expanded', 'true'); backdrop.hidden = false; }
  function closeNav(){ header.classList.remove('nav-open'); toggle.setAttribute('aria-expanded', 'false'); backdrop.hidden = true; }
  function toggleNav(){ header.classList.contains('nav-open') ? closeNav() : openNav(); }

  toggle.addEventListener('click', toggleNav);
  nav.addEventListener('click', (e) => { if (e.target.tagName === 'A') closeNav(); });
  backdrop.addEventListener('click', closeNav);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });
})();

(() => {
  const c = document.getElementById('heartField');
  if (!c) return;
  const ctx = c.getContext('2d', { alpha: true });

  let W = 0, H = 0, dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  function resize(){
    W = window.innerWidth;
    H = window.innerHeight;
    c.width = Math.floor(W * dpr);
    c.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  function drawHeartPath(ctx, s){
    const w = s;
    const h = s;
    const top = -h * 0.25;
    const bottom = h * 0.45;
    const left = -w * 0.5;
    const right = w * 0.5;

    ctx.beginPath();
    ctx.moveTo(0, bottom);
    ctx.bezierCurveTo(left * 0.6, bottom * 0.2, left, top, 0, top + h * 0.18);
    ctx.bezierCurveTo(right, top, right * 0.6, bottom * 0.2, 0, bottom);
    ctx.closePath();
  }

  function fillHeart(x, y, s, alpha){
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = alpha;
    const g = ctx.createLinearGradient(-s, -s, s, s);
    g.addColorStop(0, '#ff4d7e');
    g.addColorStop(1, '#ff96b0');
    ctx.fillStyle = g;
    drawHeartPath(ctx, s);
    ctx.fill();
    ctx.restore();
  }

  const hearts = [];
  const MAX = 160;
  const pointer = { x: null, y: null, active: false };
  const rand = (a, b) => a + Math.random() * (b - a);

  function makeHeart(x = rand(0, W), y = rand(0, H), burst=false){
    const s = burst ? rand(18, 30) : rand(10, 22);
    hearts.push({
      x, y, s,
      vx: rand(-0.25, 0.25),
      vy: rand(-0.6, -0.1),
      a: rand(0.6, 1),
      life: rand(4.5, 7.5),
      t: 0
    });
  }

  for (let i = 0; i < 90; i++) makeHeart(rand(0, W), rand(H * 0.3, H));

  function step(dt){
    ctx.clearRect(0, 0, W, H);

    if (hearts.length < MAX && Math.random() < 0.7) makeHeart();

    for (let i = 0; i < hearts.length; i++){
      const h = hearts[i];

      if (pointer.active && pointer.x != null){
        const dx = pointer.x - h.x;
        const dy = pointer.y - h.y;
        const d2 = Math.max(80, dx*dx + dy*dy);
        h.vx += (dx / d2) * 12;
        h.vy += (dy / d2) * 12;
      }

      h.x += h.vx;
      h.y += h.vy;
      h.vy += 0.01;
      h.t += dt;
      h.a = Math.max(0, h.a - dt / h.life);

      if (h.x < -40) h.x = W + 40;
      if (h.x > W + 40) h.x = -40;

      if (h.y < -60 || h.a <= 0){
        h.x = rand(0, W);
        h.y = H + rand(10, 120);
        h.vx = rand(-0.25, 0.25);
        h.vy = rand(-0.7, -0.2);
        h.a = rand(0.6, 1);
        h.life = rand(4.5, 7.5);
        h.t = 0;
      }

      fillHeart(h.x, h.y, h.s, h.a);
    }
  }

  let last = performance.now();
  function loop(now = performance.now()){
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    step(dt);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  function setPointerFromEvent(e, active){
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    pointer.x = x;
    pointer.y = y;
    pointer.active = active;
  }
  document.addEventListener('mousemove', (e) => setPointerFromEvent(e, true), { passive: true });
  document.addEventListener('mouseleave', () => { pointer.active = false; }, { passive: true });
  document.addEventListener('touchmove', (e) => setPointerFromEvent(e, true), { passive: true });
  document.addEventListener('touchend', () => { pointer.active = false; }, { passive: true });
  document.addEventListener('touchcancel', () => { pointer.active = false; }, { passive: true });

  function burst(x, y, count = 24){
    for (let i = 0; i < count; i++) makeHeart(x + rand(-10, 10), y + rand(-10, 10), true);
  }

  document.addEventListener('click', (e) => {
    burst(e.clientX, e.clientY, 28);
  }, { passive: true });

  const btn = document.getElementById('sparkBtn');
  if (btn){
    btn.addEventListener('click', () => {
      burst(window.innerWidth / 2, 140, 36);
    });
  }
})();

(() => {
  const cards = document.querySelectorAll('.tl-card');
  if (!cards.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  cards.forEach(c => io.observe(c));
})();

(() => {
  const nums = document.querySelectorAll('.stat-num');
  if (!nums.length) return;

  function animate(el){
    const target = +el.getAttribute('data-target') || 0;
    const start = 0;
    const dur = 1200 + Math.random()*600;
    const t0 = performance.now();
    function step(t){
      const p = Math.min(1, (t - t0)/dur);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(start + ease * target).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        animate(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  nums.forEach(n => io.observe(n));
})();
