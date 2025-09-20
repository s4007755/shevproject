(() => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

(() => {
  const wrap = document.querySelector('.hearts');
  if (!wrap) return;

  const COUNT = 64;
  const docW = () => window.innerWidth;

  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('span');
    el.className = 'heart';
    resetHeart(el);
    wrap.appendChild(el);
  }

  function resetHeart(el) {
    const left = Math.random() * (docW() - 40);
    const delay = -Math.random() * 12;
    const dur = 10 + Math.random() * 10;
    const size = 10 + Math.random() * 18;
    el.style.left = `${left}px`;
    el.style.animationDelay = `${delay}s`;
    el.style.animationDuration = `${dur}s`;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.opacity = String(0.6 + Math.random() * 0.4);
  }

  window.addEventListener('resize', () => {
    document.querySelectorAll('.heart').forEach(resetHeart);
  });
})();

(() => {
  const btn = document.getElementById('loveAdvanceBtn');
  const panel = document.getElementById('lovePanel');
  const panelText = document.getElementById('lovePanelText');
  if (!btn || !panel || !panelText) return;

  const phrases = [
    "I love you.",
    "I love you more.",
    "I love you more than that.",
    "I love you 100,000× more.",
    "I love you to the moon and back.",
    "I love you past every sunrise.",
    "I love you beyond the stars.",
    "I love you more than yesterday.",
    "I love you most in every moment.",
    "I love you endlessly.",
    "I love you in every timeline.",
    "I love you more than coffee (and I love coffee).",
    "I love you like oceans love the moon.",
    "I love you, always, always, always."
  ];

  let idx = 0;
  let hideTimer = null;

  btn.addEventListener('click', (e) => {
    panelText.textContent = phrases[idx % phrases.length];
    idx++;

    showPanel();

    spawnClickHeart(e.clientX, e.clientY);
  });

  function showPanel() {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    panel.setAttribute('aria-hidden', 'false');
    hideTimer = setTimeout(() => {
      panel.setAttribute('aria-hidden', 'true');
    }, 1100);
  }
})();

(() => {
  document.addEventListener('click', (e) => {
    if (e.button !== 0) return;

    spawnClickHeart(e.clientX, e.clientY);
  });
})();

function spawnClickHeart(x, y){
  const h = document.createElement('span');
  h.className = 'click-heart';
  const angle = Math.random() * Math.PI * 2;
  const dist = 50 + Math.random() * 70;
  const tx = Math.cos(angle) * dist;
  const ty = Math.sin(angle) * dist * -1;
  const size = 14 + Math.floor(Math.random() * 16);

  h.style.left = `${x}px`;
  h.style.top = `${y}px`;
  h.style.width = `${size}px`;
  h.style.height = `${size}px`;
  h.style.setProperty('--tx', `${tx}px`);
  h.style.setProperty('--ty', `${ty}px`);
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 1300);
}
