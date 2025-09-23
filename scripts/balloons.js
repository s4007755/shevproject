(() => {
  const stage = document.getElementById('bpStage');
  const scoreEl = document.getElementById('bpScore');
  const missedEl = document.getElementById('bpMissed');
  const missCapEl = document.getElementById('bpMissCap');
  const waveEl = document.getElementById('bpWave');
  const bestEl = document.getElementById('bpBest');
  const totalEl = document.getElementById('bpTotal');
  const statusEl = document.getElementById('bpStatus');

  const meterFill = document.getElementById('bpMeterFill');
  const meterText = document.getElementById('bpMeterText');

  const waveFill = document.getElementById('bpWaveFill');
  const waveTimeText = document.getElementById('bpWaveTime');

  const toast = document.getElementById('bpToast');
  const toastText = document.getElementById('bpToastText');
  const waveBanner = document.getElementById('bpWaveBanner');

  const btnStart = document.getElementById('bpStart');
  const btnReset = document.getElementById('bpReset');
  const btnMute = document.getElementById('bpMute');
  const modeSel = document.getElementById('bpMode');

  const over = document.getElementById('bpOver');
  const overScore = document.getElementById('bpFinalScore');
  const overNotes = document.getElementById('bpFinalNotes');
  const overBest = document.getElementById('bpFinalBest');
  const btnRestart = document.getElementById('bpRestart');
  const btnViewNotes = document.getElementById('bpViewNotes');
  const btnCloseOver = document.getElementById('bpCloseOver');
  const notesListEl = document.getElementById('bpNotesList');

  if (!stage) return;

  const LS = {
    BEST: 'bp_bestScore',
    TOTAL: 'bp_totalKisses',
    MUTE: 'bp_muted',
    NOTES: 'bp_notesHistory'
  };

const NOTES = [
  "You’re my daily smile 💖","You glow brighter than stars ✨","One pop = one kiss 💋",
  "Forever my favorite person ❤️","You make everything softer 🌸","Your laugh is my melody 🎶",
  "I love you more, always 💞","Certified cutest in the universe 🌟","Hug voucher redeemed 🤗",
  "I choose you every time 💘","You’re my gentle sunrise 🌅","Stunning. Always. 😍",
  "You + me = home 🏡","I’m proud of you 💗","I’m always on your team",
  "You’re my safe place 🏠","Can’t stop thinking about you 💭💕","You’re pure magic ✨",
  "You’re my favorite hello 💕","You’re sunshine in human form ☀️","I still get butterflies around you 🦋",
  "You’re my daily dream come true 🌙","Holding your hand is my favorite place ✋❤️","You’re my safe forever 🏡",
  "I’m yours, always & forever 🔒💘","You + me = happiness formula 🧪💞","Every day with you is my best day 🌸",
  "I’ll always choose you in every lifetime ♾️",
  "One balloon = one kiss 😘","Free cuddle voucher 🤗","Your laugh makes me melt 🎶",
  "You’re dangerously cute 😏💕","Staring at you is my hobby 👀💖","You’re my personal favorite flavor 🍯",
  "Guess what? I love you more 💋","You look illegal levels of cute 🚨😍","You’re my happy addiction 🔥💞",
  "Pop = surprise hug 💓",
  "I’m so proud of you 💗","You amaze me every single day ✨","You make hard days softer 🌸",
  "You’re stronger than you know 💪❤️","You inspire me endlessly 🌟","I believe in you, always",
  "You make the world brighter 🌍💡","You’re a masterpiece 🎨","My heart is your cheerleader 📣💘",
  "You’re more than enough 💞",
  "You’re my forever person ❤️","Home is wherever you are 🏠","You’re my favorite chapter 📖💖",
  "I’ll love you in every universe 🌌","You’re my once-in-a-lifetime 🌹","You’re the love story I always wanted 💘",
  "I’m lucky to have you 🍀","You’re my soft place to land 🌤️","I’ll never stop choosing you 💍",
  "You + me = destiny ✨",
  "Pop = cute attack 😆","You’re my favorite cutie 🤪❤️","Can’t stop thinking about your face 😍",
  "You = perfection 🍕💞","You make my heart giggle 😂💕","My cutie 🎀",
  "I share my life with you 🍟❤️","Even my bad jokes are for you 😅","Pop = selfie together 🤳💘",
  "You’re the sprinkles on my ice cream 🍨✨",
  "You’re pure magic ✨","You’re a real-life daydream 🌙","You’re stardust and sunshine 🌟☀️",
  "You glow brighter than galaxies 🌌","You’re my lucky star 🌠","You make the ordinary extraordinary 💫",
  "You’re my sweetest song 🎶","You’re a wish come true 🌈","You’re my perfect plot twist 📚💖",
  "You sparkle more than diamonds 💎✨",
  "Hug dispenser: unlimited 🤗","You’re my cuddle headquarters 🛋️💞","You’re my favorite view 👀❤️",
  "You’re the reason I smile randomly 😊","You’re my person. Always.","My love language? You 💌",
  "You’re my daily dose of happy ☀️","Loving you is my best talent 🏆💕","You’re my soulmate, no refunds 💕",
  "You’re my treasure chest of joy ❤️",
  "Pop = forehead kiss 😘","Pop = piggyback ride 🐷💖","I call dibs on you forever 🙋‍♂️💕",
  "You’re my favorite human bean 🌱❤️","You make my cheeks hurt from smiling 😁💘",
  "You + me = unstoppable duo 🦸‍♀️🦸‍♂️","You’re my partner in all crimes (cute ones) 🕵️‍♀️❤️",
  "Pop = “I love you” said 100 times 💋",
  "I’d choose you in every universe 🌌","You’re the dream I never want to wake from 🌙",
  "Pop = extra long hug 🤗","You’re the light to my lantern 🏮❤️","You’re my safe harbor ⛵💞",
  "You’re my fairy tale ending 📖✨","You’re the rhythm to my heartbeat ❤️🎶",
  "You’re my forever adventure 🌍💘","Pop = secret whispered “I love you” 💭💋",
  "You’re my always and forever 💍",
  "You’re my favorite notification 📱💕","You’re my daily miracle 🌸","Pop = tongue kiss 😚",
  "You make the world colorful 🌈","You’re my reason to believe in love ❤️",
  "You’re the warm blanket on my cold days 🛌💘","You’re my lucky charm 🍀",
  "You’re my favorite plot in the story 📖💕","Pop = silly compliment fest 🤭",
  "You’re my happily ever after 💖",
  "You’re my sweetest chaos 🌪️💕","You’re my safe adventure 🗺️❤️","You’re my cozy hoodie 🧥💞","You’re my daily excitement 🎢💘","You’re my secret superpower 🦸‍♂️💖",
  "You’re my endless playlist 🎧💕","You’re the sparkle in my eyes 👁️✨",
  "You’re my perfect mess 🎀💞",
  "You’re my candy crush 🍬💘","You’re my soft morning light 🌅","Pop = bedtime together 📖❤️",
  "You’re the hug I crave 🤗","You’re my never-ending favorite 💞","You’re my sunshine on cloudy days ☁️☀️",
  "You’re my constant miracle ✨","You’re my safe adventure 🏞️","Pop = secret wink 😉💖",
  "You’re the reason love songs make sense 🎶❤️",
  "You’re my love lottery win 🎟️💘","You’re my blanket partner 🏰💞","You’re my moonlight glow 🌙✨",
  "Pop = playful chase 🏃‍♀️💕","You’re my daily comfort ☕❤️","You’re my perfect chaos 🌪️💖",
  "You’re my better half ","You’re my forever comfort food 🍜💘","Pop = whispered secret 💭❤️",
  "You’re the magic in my every day ✨💞",
  "You’re my rainbow after the rain 🌈","You’re my bedtime thought 🌙💤","You’re my miracle wrapped in skin 💖", "📜💕","You’re my everyday Valentine 💌❤️","You’re my laughter medicine 😂💘",
  "You’re my infinite cuddle supply 🛋️🤗","You’re my constant muse 🎨✨","You’re my soft lullaby 🌙🎶",
  "You’re my reason to believe 🌟","You’re my lucky coin ","You’re my safe space playlist 🎧❤️",
  "You’re my smile generator 😁💖","You’re my spark of joy ✨","Pop = kiss energy 💕",
  "You’re my cozy blanket in winter ❄️❤️","You’re my fireworks show 🎆💘","You’re my favorite chapter title 📖💕",
  "You’re my forever promise 🔒💞",
  "You’re my ocean wave 🌊💘","You’re my heartbeat song ❤️🎶","You’re my dream 🌌✨",
  "You’re my pocket full of sunshine ☀️💕","Pop = inside 🤭","You’re my cozy fireplace warmth 🔥❤️",
  "You’re my golden hour glow 🌅💞","You’re my happily always 💖","You’re my constant wonder 🌟",
  "You’re my sweetest forever 🍯❤️"
];

  const POWERUPS = [
    { key: 'freeze', icon: '⏸️', label: 'Freeze (3s)' },
    { key: 'double', icon: '✨', label: 'Double Kisses (10s)' },
    { key: 'burst',  icon: '💥', label: 'Heartburst' }
  ];

  let AC = null, master = null, muted = false;
  function initAC(){
    if (!AC) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) {
        AC = new Ctx();
        master = AC.createGain();
        master.gain.value = 0.5;
        master.connect(AC.destination);
      }
    }
  }
  function tone({freq=600, time=0.08, type='sine', gain=0.10}={}){
    if (muted || !AC || !master) return;
    const o = AC.createOscillator();
    const g = AC.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = gain;
    o.connect(g).connect(master);
    o.start();
    o.stop(AC.currentTime + time);
  }
  function popSound(){
    if (muted || !AC || !master) return;
    const o = AC.createOscillator();
    const g = AC.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(680, AC.currentTime);
    o.frequency.exponentialRampToValueAtTime(260, AC.currentTime + 0.09);
    g.gain.setValueAtTime(0.08, AC.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + 0.12);
    o.connect(g).connect(master);
    o.start();
    o.stop(AC.currentTime + 0.13);
  }
  function chime(){ tone({freq:880, time:0.12, type:'sine', gain:0.07}); }
  function failSound(){ tone({freq:220, time:0.12, type:'square', gain:0.06}); }
  function gameOverSound(){ tone({freq:240, time:0.18, gain:0.07}); setTimeout(()=>tone({freq:180, time:0.18, gain:0.07}),160); }

  const WAVE_DURATION = 20000;
  const BREAK_DURATION = 3000;
  let running = false;
  let inWave = false;

  let spawnIntervalId = null;
  let waveTimeoutId = null;
  let breakTimeoutId = null;
  let waveTimerId = null;

  let score = 0;
  let kisses = 0;
  let missed = 0;
  let missCap = 5;
  let wave = 1;
  let best = parseInt(localStorage.getItem(LS.BEST) || '0', 10);
  let total = parseInt(localStorage.getItem(LS.TOTAL) || '0', 10);

  let waveSpeedScale = 1;
  let waveSpawnEvery = 900;

  let freezeUntil = 0;
  let doubleUntil = 0;

  let collectedNotes = [];
  let combo = 0;
  let lastPopTime = 0;

  muted = localStorage.getItem(LS.MUTE) === '1';
  bestEl.textContent = String(best);
  totalEl.textContent = String(total);
  btnMute.textContent = muted ? '🔇' : '🔊';
  btnMute.setAttribute('aria-pressed', muted ? 'true' : 'false');

  const savedHistory = JSON.parse(localStorage.getItem(LS.NOTES) || '[]');

  function rnd(min, max){ return Math.random() * (max - min) + min; }
  function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }
  function now(){ return performance.now(); }

  function setStatus(text){ statusEl.textContent = text; }
  function setScore(v){
    score = v; scoreEl.textContent = String(score);
    if (score > best){ best = score; bestEl.textContent = String(best); localStorage.setItem(LS.BEST, String(best)); }
  }
  function setKisses(v){
    kisses = v;
    const pct = Math.min(100, (kisses % 25) * 4);
    meterFill.style.width = pct + '%';
    meterText.textContent = `Kisses sent: ${kisses}`;
  }
  function setMissed(v){
    missed = Math.max(0, v);
    missedEl.textContent = String(missed);
    if (missed >= missCap) endGame();
  }

  function showToast(msg, ms=1200){
    toastText.textContent = msg;
    toast.setAttribute('aria-hidden', 'false');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.setAttribute('aria-hidden', 'true'), ms);
  }

  function showWaveBanner(n){
    waveBanner.textContent = `Wave ${n}`;
    waveBanner.classList.add('show');
    waveBanner.setAttribute('aria-hidden','false');
    setTimeout(() => {
      waveBanner.classList.remove('show');
      waveBanner.setAttribute('aria-hidden','true');
    }, 1100);
  }

  function spawnPopHearts(x, y, count=10){
    for (let i=0;i<count;i++){
      const h = document.createElement('span');
      h.className = 'bp-pop-heart';
      const ang = Math.random() * Math.PI * 2;
      const dist = rnd(30, 90);
      h.style.left = x + 'px';
      h.style.top = y + 'px';
      h.style.setProperty('--tx', `${Math.cos(ang)*dist}px`);
      h.style.setProperty('--ty', `${Math.sin(ang)*-dist}px`);
      stage.appendChild(h);
      setTimeout(()=> h.remove(), 900);
    }
  }

  function spawnNote(x, y, text){
    const n = document.createElement('div');
    n.className = 'bp-note';
    n.textContent = text;
    n.style.left = x + 'px';
    n.style.top = y + 'px';
    stage.appendChild(n);
    setTimeout(()=> n.remove(), 1600);
  }

  function setFreeze(active){
    const paused = active;
    stage.querySelectorAll('.bp-balloon').forEach(b => {
      b.style.animationPlayState = paused ? 'paused' : 'running';
    });
  }

  function applyPowerup(key, atX, atY){
    if (key === 'freeze'){
      freezeUntil = now() + 3000;
      setFreeze(true);
      showToast("⏸️ Freeze (3s)");
      chime();
      setTimeout(() => { if (now() >= freezeUntil) setFreeze(false); }, 3100);
    } else if (key === 'double'){
      doubleUntil = now() + 10000;
      showToast("✨ Double Kisses (10s)");
      chime();
    } else if (key === 'burst'){
      const rect = stage.getBoundingClientRect();
      const cx = atX, cy = atY;
      const R = 140;
      const candidates = [];
      stage.querySelectorAll('.bp-balloon').forEach(b => {
        const br = b.getBoundingClientRect();
        const bx = br.left - rect.left + br.width/2;
        const by = br.top - rect.top + br.height/2;
        const d = Math.hypot(bx - cx, by - cy);
        if (d <= R) candidates.push({b, bx, by});
      });

      let popped = 0;
      candidates.forEach(({b, bx, by}) => {
        if (!document.body.contains(b)) return;
        initAC(); popSound();
        const isPower = b.dataset.power;
        if (isPower){
        } else {
          const note = pick(NOTES);
          collectedNotes.push(note);
          const newHist = [...savedHistory, note].slice(-50);
          localStorage.setItem(LS.NOTES, JSON.stringify(newHist));
          spawnNote(bx, by, note);
        }
        spawnPopHearts(bx, by, 8);
        b.remove();
        popped++;
      });

      const mult = now() < doubleUntil ? 2 : 1;
      const bonus = Math.min(5, popped) * mult;
      if (bonus > 0){
        setScore(score + bonus);
        showToast(`💥 Heartburst! +${bonus}`, 1000);
      } else {
        showToast("💥 Heartburst!", 900);
      }
      chime();
    }
  }

  function handleCombo(){
    const t = now();
    if (t - lastPopTime < 900){ combo++; } else { combo = 1; }
    lastPopTime = t;
    if (combo > 0 && combo % 5 === 0){
      setScore(score + 2 * (now() < doubleUntil ? 2 : 1));
      showToast(`Combo x${combo}! +2 💖`, 900);
      chime();
    }
  }

  function popBalloon(b, x, y){
    initAC(); popSound();

    let delta = b.classList.contains('gold') ? 2 : 1;
    if (now() < doubleUntil) delta *= 2;
    setScore(score + delta);
    setKisses(kisses + 1);
    total += 1; localStorage.setItem(LS.TOTAL, String(total)); totalEl.textContent = String(total);

    const isPower = b.dataset.power;
    if (isPower){
      applyPowerup(isPower, x, y);
      spawnNote(x, y, POWERUPS.find(p=>p.key===isPower)?.label || "Power!");
    } else {
      const note = pick(NOTES);
      collectedNotes.push(note);
      const newHist = [...savedHistory, note].slice(-50);
      localStorage.setItem(LS.NOTES, JSON.stringify(newHist));
      spawnNote(x, y, note);
    }

    spawnPopHearts(x, y, b.classList.contains('gold') ? 14 : 10);
    handleCombo();
    b.remove();
  }

  function balloonMissed(b){
    if (!b.dataset.power) {
      setMissed(missed + 1);
      failSound();
    }
    b.remove();
  }

  function makeBalloon(){
    const b = document.createElement('div');
    b.className = 'bp-balloon';

    const roll = Math.random();
    if (roll < 0.08){
      b.classList.add('power');
      const p = pick(POWERUPS);
      b.dataset.power = p.key;
      const ic = document.createElement('span');
      ic.className = 'bp-icon';
      ic.textContent = p.icon;
      b.appendChild(ic);
    } else if (roll < 0.20){
      b.classList.add('gold');
    }

    const sizeRoll = Math.random();
    if (sizeRoll < 0.15) b.classList.add('xl');
    else if (sizeRoll < 0.45) b.classList.add('l');
    else if (sizeRoll < 0.75) b.classList.add('m');
    else b.classList.add('s');

    const stageW = stage.clientWidth;
    const bw = b.classList.contains('xl') ? 56 : b.classList.contains('l') ? 40 : b.classList.contains('m') ? 30 : 22;
    const left = rnd(8, stageW - bw - 8);
    b.style.left = `${left}px`;

    const baseDur = (modeSel.value === 'hard' ? 7.5 : 9.5);
    const variance = rnd(-1.0, 1.0);
    const dur = Math.max(4.0, (baseDur - (wave - 1) * 0.6 + variance) / waveSpeedScale);
    b.style.animationDuration = `${dur}s`;

    const s = document.createElement('span');
    s.className = 'bp-string';
    b.appendChild(s);

    b.addEventListener('click', (e) => {
      const rect = stage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      popBalloon(b, x, y);
    }, { once: true });

    b.addEventListener('animationend', () => balloonMissed(b));

    stage.appendChild(b);

    if (now() < freezeUntil) b.style.animationPlayState = 'paused';
  }

  let waveStartTs = 0;

  function computeWaveParams(){
    const hard = modeSel.value === 'hard';
    const baseSpawn = hard ? 820 : 980;
    const spawnStep = hard ? 70 : 55;
    waveSpawnEvery = Math.max(360, baseSpawn - (wave - 1) * spawnStep);
    waveSpeedScale = 1 + (wave - 1) * (hard ? 0.12 : 0.09);
  }

  function startWave(){
    if (!running) return;
    inWave = true;
    waveEl.textContent = String(wave);
    showWaveBanner(wave);
    setStatus(`Wave ${wave}`);

    computeWaveParams();
    waveStartTs = performance.now();

    spawnIntervalId = setInterval(() => {
      if (!running || !inWave) return;
      makeBalloon();
    }, waveSpawnEvery);

    clearInterval(waveTimerId);
    waveTimerId = setInterval(() => {
      const t = performance.now();
      const elapsed = Math.min(WAVE_DURATION, t - waveStartTs);
      const pct = Math.max(0, Math.min(100, (elapsed / WAVE_DURATION) * 100));
      waveFill.style.width = `${pct}%`;
      const remain = Math.max(0, (WAVE_DURATION - elapsed) / 1000);
      waveTimeText.textContent = `Wave time: ${remain.toFixed(1)}s`;
    }, 100);

    clearTimeout(waveTimeoutId);
    waveTimeoutId = setTimeout(() => endWave(), WAVE_DURATION);
  }

  function endWave(){
    inWave = false;
    clearInterval(spawnIntervalId); spawnIntervalId = null;
    clearInterval(waveTimerId); waveTimerId = null;
    waveFill.style.width = '0%';
    waveTimeText.textContent = `Wave time: 20.0s`;
    setStatus('Intermission');

    if (now() < freezeUntil){
      freezeUntil = 0;
      setFreeze(false);
    }

    breakTimeoutId = setTimeout(() => {
      if (!running) return;
      wave += 1;
      startWave();
    }, BREAK_DURATION);
  }

  function startGame(){
    if (running) return;
    running = true;
    combo = 0; lastPopTime = 0;
    collectedNotes = [];
    setStatus('Get ready…');

    const mode = modeSel.value;
    missCap = mode === 'hard' ? 5 : 7;
    missCapEl.textContent = String(missCap);

    wave = 1;
    freezeUntil = 0;
    doubleUntil = 0;

    setTimeout(() => { if (running) startWave(); }, 350);
    initAC();
  }

  function endGame(){
    if (!running) return;
    running = false;
    inWave = false;

    clearInterval(spawnIntervalId); spawnIntervalId = null;
    clearInterval(waveTimerId); waveTimerId = null;
    clearTimeout(waveTimeoutId); waveTimeoutId = null;
    clearTimeout(breakTimeoutId); breakTimeoutId = null;

    setFreeze(false);

    setStatus('Stopped');
    overScore.textContent = String(score);
    overNotes.textContent = String(collectedNotes.length);
    overBest.textContent = String(best);
    over.setAttribute('aria-hidden', 'false');
    gameOverSound();
  }

  function resetGame(){
    running = false;
    inWave = false;

    clearInterval(spawnIntervalId); spawnIntervalId = null;
    clearInterval(waveTimerId); waveTimerId = null;
    clearTimeout(waveTimeoutId); waveTimeoutId = null;
    clearTimeout(breakTimeoutId); breakTimeoutId = null;

    setScore(0);
    setKisses(0);
    setMissed(0);
    wave = 1;
    waveEl.textContent = "1";
    setStatus('Ready');
    freezeUntil = 0;
    doubleUntil = 0;
    collectedNotes = [];
    combo = 0; lastPopTime = 0;
    stage.querySelectorAll('.bp-balloon,.bp-pop-heart,.bp-note').forEach(el => el.remove());
    toast.setAttribute('aria-hidden', 'true');
    over.setAttribute('aria-hidden', 'true');
    waveFill.style.width = '0%';
    waveTimeText.textContent = `Wave time: 20.0s`;
  }

  btnStart.addEventListener('click', () => {
    resetGame();
    startGame();
  });
  btnReset.addEventListener('click', resetGame);

  btnRestart.addEventListener('click', () => {
    over.setAttribute('aria-hidden', 'true');
    resetGame();
    startGame();
  });
  btnViewNotes.addEventListener('click', () => {
    if (notesListEl.hidden){
      const items = collectedNotes.length
        ? collectedNotes.map(t => `<div class="item">• ${t}</div>`).join('')
        : `<div class="item">No notes collected yet — pop more hearts! 💖</div>`;
      notesListEl.innerHTML = items;
      notesListEl.hidden = false;
    } else {
      notesListEl.hidden = true;
    }
  });
  btnCloseOver.addEventListener('click', () => over.setAttribute('aria-hidden', 'true'));

  btnMute.addEventListener('click', () => {
    muted = !muted;
    localStorage.setItem(LS.MUTE, muted ? '1' : '0');
    btnMute.textContent = muted ? '🔇' : '🔊';
    btnMute.setAttribute('aria-pressed', muted ? 'true' : 'false');
  });

  bestEl.textContent = String(best);
  totalEl.textContent = String(total);
  setScore(0);
  setKisses(0);
  setMissed(0);
  setStatus('Ready');
})();
