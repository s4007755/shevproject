(() => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

(() => {
  const timeEls = document.querySelectorAll('.clock-time');
  const dateEls = document.querySelectorAll('.clock-date');

  function fmt(zone, opts) {
    return new Intl.DateTimeFormat('en-AU', { timeZone: zone, ...opts });
  }

  function tick() {
    timeEls.forEach((el, i) => {
      const zone = el.getAttribute('data-zone');
      const now = new Date();
      el.textContent = fmt(zone, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(now);
      const dateEl = el.parentElement.querySelector('.clock-date');
      if (dateEl) {
        dateEl.textContent = fmt(zone, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }).format(now);
      }
    });
  }
  tick();
  setInterval(tick, 1000);
})();

(() => {
  const calTitle = document.getElementById('calTitle');
  const calGrid = document.getElementById('calGrid');
  const prevBtn = document.getElementById('prevMonth');
  const nextBtn = document.getElementById('nextMonth');

  let view = new Date();
  view.setDate(1);

  const isMilestone = (y, m, d) => (m === 11 && d === 19);

  function render() {
    const year = view.getFullYear();
    const month = view.getMonth();

    const monthName = new Intl.DateTimeFormat('en', { month: 'long' }).format(view);
    calTitle.textContent = `${monthName} ${year}`;

    calGrid.innerHTML = '';
    const firstDayDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();

    const startDate = 1 - firstDayDow;
    const totalCells = 42;

    const today = new Date();
    const tY = today.getFullYear();
    const tM = today.getMonth();
    const tD = today.getDate();

    for (let i = 0; i < totalCells; i++) {
      const dayNum = startDate + i;
      const cellDate = new Date(year, month, dayNum);
      const cY = cellDate.getFullYear();
      const cM = cellDate.getMonth();
      const cD = cellDate.getDate();

      const inThisMonth = (cM === month);

      const cell = document.createElement('button');
      cell.className = 'cal-cell';
      cell.setAttribute('role', 'gridcell');
      cell.tabIndex = inThisMonth ? 0 : -1;

      if (!inThisMonth) cell.classList.add('other-month');

      const dow = cellDate.getDay();
      if (dow === 0 || dow === 6) cell.classList.add('weekend');

      if (cY === tY && cM === tM && cD === tD) {
        cell.classList.add('today');
        cell.setAttribute('aria-current', 'date');
      }

      const num = document.createElement('span');
      num.className = 'cal-num';
      num.textContent = String(cD);
      cell.appendChild(num);

      if (isMilestone(cY, cM, cD)) {
        const badge = document.createElement('span');
        badge.className = 'milestone';
        badge.innerHTML = '♥';
        badge.title = 'Visiting the cutie';
        cell.appendChild(badge);

        const caption = document.createElement('span');
        caption.className = 'milestone-caption';
        caption.textContent = 'Visiting the cutie';
        cell.appendChild(caption);
        cell.setAttribute('aria-label', `December 19, ${cY}: Visiting the cutie`);
      } else {
        cell.setAttribute('aria-label', `${new Intl.DateTimeFormat('en', { dateStyle: 'full' }).format(cellDate)}`);
      }

      calGrid.appendChild(cell);
    }
  }

  prevBtn.addEventListener('click', () => {
    view.setMonth(view.getMonth() - 1);
    render();
  });
  nextBtn.addEventListener('click', () => {
    view.setMonth(view.getMonth() + 1);
    render();
  });

  render();
})();

/* ===== Countdown to Dec 19, 5:00 PM Edmonton ===== */
(() => {
  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minsEl  = document.getElementById('cdMinutes');
  const secsEl  = document.getElementById('cdSeconds');
  const whenLocalEl = document.getElementById('cdWhenLocal');
  if (!daysEl || !hoursEl || !minsEl || !secsEl || !whenLocalEl) return;

  const TZ = 'America/Edmonton';

  function nextTargetUtcMs(now = new Date()){
    const yNow = now.getFullYear();
    const thisYearMs = edmontonWallTimeToUTCms(yNow, 12, 19, 17, 0, 0);
    const isPast = Date.now() > thisYearMs;
    const y = isPast ? yNow + 1 : yNow;
    return edmontonWallTimeToUTCms(y, 12, 19, 17, 0, 0);
  }

  function edmontonWallTimeToUTCms(year, month, day, hour, minute, second){
    let guess = Date.UTC(year, month - 1, day, hour, minute, second);
    let off1 = tzOffsetMinutes(new Date(guess), TZ);
    let utc = guess - off1 * 60_000;
    let off2 = tzOffsetMinutes(new Date(utc), TZ);
    return guess - off2 * 60_000;
  }

  function tzOffsetMinutes(utcDate, timeZone){
    const fmt = new Intl.DateTimeFormat('en-CA', {
      timeZone, hour12: false,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    const parts = fmt.formatToParts(utcDate).reduce((acc,p) => (acc[p.type]=p.value, acc), {});
    const asIfLocalUTC = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
    return (asIfLocalUTC - utcDate.getTime()) / 60000;
  }

  function setWhenLabel(targetMs){
    const target = new Date(targetMs);
    const edmontonLabel = new Intl.DateTimeFormat('en-CA', {
      timeZone: TZ, weekday:'long', month:'long', day:'numeric', year:'numeric',
      hour:'numeric', minute:'2-digit'
    }).format(target);
    whenLocalEl.textContent = `${edmontonLabel} (Edmonton)`;
  }

  const targetMs = nextTargetUtcMs();
  setWhenLabel(targetMs);

  function update(){
    const diff = targetMs - Date.now();
    if (diff <= 0){
      daysEl.textContent = '0'; hoursEl.textContent = '0'; minsEl.textContent = '0'; secsEl.textContent = '0';
      const row = document.getElementById('countdownRow');
      if (row) row.style.boxShadow = '0 0 0 4px rgba(255,150,176,.18) inset';
      return;
    }
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = String(days);
    hoursEl.textContent = String(hours).padStart(2,'0');
    minsEl.textContent  = String(minutes).padStart(2,'0');
    secsEl.textContent  = String(seconds).padStart(2,'0');
  }

  update();
  setInterval(update, 1000);
})();

/* ===== Weather ===== */
(() => {
  const LOCS = [
    {
      name: "Mornington",
      lat: -38.217, lon: 145.038,
      sel: {
        emoji: "#wxMornEmoji", summary: "#wxMornSummary",
        t: "#wxMornTemp", f: "#wxMornFeels", h: "#wxMornHum", w: "#wxMornWind"
      }
    },
    {
      name: "Edmonton",
      lat: 53.5461, lon: -113.4938,
      sel: {
        emoji: "#wxEdmEmoji", summary: "#wxEdmSummary",
        t: "#wxEdmTemp", f: "#wxEdmFeels", h: "#wxEdmHum", w: "#wxEdmWind"
      }
    }
  ];

  function codeToSummary(code){
    if ([0].includes(code))            return { text: "Clear sky",           emoji: "☀️" };
    if ([1].includes(code))            return { text: "Mainly clear",        emoji: "🌤️" };
    if ([2].includes(code))            return { text: "Partly cloudy",       emoji: "⛅"  };
    if ([3].includes(code))            return { text: "Overcast",            emoji: "☁️"  };
    if ([45,48].includes(code))        return { text: "Foggy",               emoji: "🌫️" };
    if ([51,53,55].includes(code))     return { text: "Drizzle",             emoji: "🌦️" };
    if ([56,57].includes(code))        return { text: "Freezing drizzle",    emoji: "🥶"  };
    if ([61,63,65].includes(code))     return { text: "Rain",                emoji: "🌧️" };
    if ([66,67].includes(code))        return { text: "Freezing rain",       emoji: "🧊"  };
    if ([71,73,75].includes(code))     return { text: "Snow",                emoji: "❄️"  };
    if ([77].includes(code))           return { text: "Snow grains",         emoji: "🌨️" };
    if ([80,81,82].includes(code))     return { text: "Rain showers",        emoji: "🌧️" };
    if ([85,86].includes(code))        return { text: "Snow showers",        emoji: "🌨️" };
    if ([95].includes(code))           return { text: "Thunderstorm",        emoji: "⛈️" };
    if ([96,99].includes(code))        return { text: "Thunderstorm w/ hail",emoji: "⛈️" };
    return { text: "—", emoji: "❓" };
  }

  async function fetchWx({lat, lon}){
    const params = new URLSearchParams({
      latitude: lat, longitude: lon,
      current: "temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,wind_speed_10m",
      timezone: "auto"
    });
    const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);
    return res.json();
  }

  function fill(sel, data){
    const c = data.current;
    const { text, emoji } = codeToSummary(c.weather_code);

    const $ = (q) => document.querySelector(q);
    $(sel.emoji).textContent = emoji;
    $(sel.summary).textContent = text;
    $(sel.t).textContent = Math.round(c.temperature_2m);
    $(sel.f).textContent = Math.round(c.apparent_temperature);
    $(sel.h).textContent = Math.round(c.relative_humidity_2m);
    $(sel.w).textContent = typeof c.wind_speed_10m === "number" ? c.wind_speed_10m.toFixed(1) : "—";
  }

  function showError(sel, err){
    const $ = (q) => document.querySelector(q);
    $(sel.emoji).textContent = "⚠️";
    $(sel.summary).textContent = "Weather unavailable";
    $(sel.t).textContent = "—";
    $(sel.f).textContent = "—";
    $(sel.h).textContent = "—";
    $(sel.w).textContent = "—";
    console.error(err);
  }

  LOCS.forEach(async (loc) => {
    try {
      const data = await fetchWx(loc);
      fill(loc.sel, data);
    } catch (e) {
      showError(loc.sel, e);
    }
  });
})();


