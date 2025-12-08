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
    "I love you more than coffee.",
    "I love you more than boba tea",
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

(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('siteNav');
  const backdrop = document.getElementById('navBackdrop');
  if (!header || !toggle || !nav || !backdrop) return;

  function openNav() {
    header.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
    backdrop.hidden = false;
  }
  function closeNav() {
    header.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    backdrop.hidden = true;
  }
  function toggleNav() {
    const isOpen = header.classList.contains('nav-open');
    isOpen ? closeNav() : openNav();
  }

  toggle.addEventListener('click', toggleNav);

  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') closeNav();
  });
  backdrop.addEventListener('click', closeNav);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });
})();

/* ====== Daily Quiz logic ====== */
(() => {
  const container = document.querySelector('.quiz-card');
  if (!container) return;

  const options = container.querySelectorAll('.btn-option');
  const toast = container.querySelector('#quizToast');
  const toastText = container.querySelector('#quizToastText');

const wrongSnark = [
  "Cute, but no one beams light into my soul like Shev does 🌟",
  "Adorable guess, but Shev’s magic is literally unmatched 💖",
  "Close… but nothing makes my world sparkle like Shev’s smile ✨",
  "Cute thought, but only Shev makes me feel like every day is a little miracle 🌈",
  "Almost… but only Shev can make time slow down just by being herself ⏳💗",
  "Adorable guess, but the real hero of my heart is Shev ❤️‍🔥",
  "Close… but only Shev has the power to make me smile without even trying 😊💫",
  "Creative, but Shev’s presence turns every second into pure magic ✨💞",
  "Adorable, but Shev makes every ordinary day feel like a masterpiece 🎨💖",
];

  function showToast(text){
    toastText.textContent = text;
    toast.setAttribute('aria-hidden', 'false');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      toast.setAttribute('aria-hidden', 'true');
    }, 2500);
  }

  function lockIn(){
    options.forEach(btn => btn.disabled = true);
  }

  options.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const isCorrect = btn.hasAttribute('data-correct');

      if (isCorrect){
        btn.classList.remove('wrong', 'shake');
        btn.classList.add('correct');
        showToast("Fact: Every single day, Shev makes life brighter just by being herself.💞");
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        for (let i = 0; i < 10; i++){
          if (typeof spawnClickHeart === 'function'){
            spawnClickHeart(cx, cy);
          }
        }
        options.forEach(o => { if (o !== btn) o.classList.add('wrong'); });
        lockIn();
      } else {
        btn.classList.add('wrong', 'shake');
        setTimeout(() => btn.classList.remove('shake'), 360);
        const line = wrongSnark[(Math.random()*wrongSnark.length)|0];
        showToast(line);
        if (typeof spawnClickHeart === 'function'){
          const rect = btn.getBoundingClientRect();
          spawnClickHeart(rect.left + rect.width/2, rect.top + rect.height/2);
        }
      }
    });
  });
})();
