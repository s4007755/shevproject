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
