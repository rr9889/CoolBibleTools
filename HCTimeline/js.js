// Timeline powered by JSON. Click/drag to a year to show ONLY that year's works.
// The JSON path comes from <script data-json="data.json">, default ./data.json.

(async function () {
  const scriptEl = document.currentScript;
  const dataPath = scriptEl?.getAttribute('data-json') || './data.json';

  // DOM refs
  const timeline = document.getElementById('timeline');
  const track    = document.getElementById('tlTrack');
  const fill     = document.getElementById('tlFill');
  const knob     = document.getElementById('tlThumb');
  const yrBadge  = document.getElementById('tlYear');
  const banner   = document.getElementById('banner');
  const yearH2   = document.getElementById('yearHeading');
  const worksEl  = document.getElementById('works');

  if (!timeline || !track || !fill || !knob || !yrBadge || !yearH2 || !worksEl) return;

  // Fetch data
  let raw;
  try {
    const res = await fetch(dataPath, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    raw = await res.json();
  } catch (err) {
    console.error('Failed to load data.json:', err);
    banner.textContent = 'Failed to load data';
    return;
  }

  // Accept either array or {items:[...]}
  const items = Array.isArray(raw) ? raw : Array.isArray(raw.items) ? raw.items : [];
  if (!items.length) { banner.textContent = 'No data'; return; }

  // Normalize & group by exact year
  const cleanYear = (y) => Number(String(y).trim().replace(/[^\-0-9]/g, ''));
  const byYear = new Map();
  items.forEach(r => {
    const y = cleanYear(r.year);
    if (Number.isNaN(y)) return;
    const entry = {
      year: y,
      author: r.author || '',
      work: r.work || r.title || '',
      view: r.view || '',
      note: r.note || r.notes || '',
      url: r.url || '',
      image: r.image || '',
      primary: !!r.primary
    };
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y).push(entry);
  });

  if (byYear.size === 0) { banner.textContent = 'No valid year entries'; return; }

  const years = [...byYear.keys()].sort((a,b)=>a-b);
  const MIN = years[0], MAX = years[years.length-1];

  const clamp01 = t => Math.max(0, Math.min(1, t));
  const posFromYear = y => (MAX === MIN) ? 0.5 : (y - MIN) / (MAX - MIN);
  const yearFromPos = p => Math.round(MIN + p * (MAX - MIN));
  const fmtYear = y => (y <= 0 ? `${Math.abs(y)} BC` : `${y} AD`);

  // Build ticks + non-overlapping labels
  let lastLabelX = -Infinity;
  const minPxBetweenLabels = 46;
  const rect = () => track.getBoundingClientRect();

  years.forEach(y => {
    const p = posFromYear(y) * 100;

    const tick = document.createElement('button');
    tick.type = 'button';
    tick.className = 'tick' + (byYear.get(y).some(v => v.primary) ? ' primary' : '');
    tick.style.left = p + '%';
    tick.setAttribute('aria-label', `Go to ${fmtYear(y)}`);
    tick.addEventListener('click', () => goToYear(y, true));
    track.appendChild(tick);

    const r = rect();
    const x = r.left + r.width * (p / 100);
    if (x - lastLabelX >= minPxBetweenLabels) {
      const lbl = document.createElement('div');
      lbl.className = 'tick-label';
      lbl.style.left = p + '%';
      lbl.textContent = String(y);
      track.appendChild(lbl);
      lastLabelX = x;
    }
  });

  // State
  let index = 0; // index in years[]

  function renderYear(y, animate = true) {
    index = years.indexOf(y);
    if (index < 0) index = 0;
    const p = posFromYear(years[index]) * 100;
    if (animate) {
      knob.style.left = p + '%';
      fill.style.width = p + '%';
      yrBadge.style.left = p + '%';
    } else {
      // temporarily remove transitions for an instant set
      const t1 = knob.style.transition, t2 = fill.style.transition, t3 = yrBadge.style.transition;
      knob.style.transition = fill.style.transition = yrBadge.style.transition = 'none';
      knob.style.left = p + '%'; fill.style.width = p + '%'; yrBadge.style.left = p + '%';
      void knob.offsetWidth; // reflow
      knob.style.transition = t1; fill.style.transition = t2; yrBadge.style.transition = t3;
    }
    yrBadge.textContent = fmtYear(years[index]);
    yearH2.textContent = fmtYear(years[index]);
    banner.textContent = 'Year view';
    renderWorks(years[index]);

    // a11y
    knob.setAttribute('aria-valuemin', '0');
    knob.setAttribute('aria-valuemax', String(years.length - 1));
    knob.setAttribute('aria-valuenow', String(index));
    knob.setAttribute('aria-valuetext', fmtYear(years[index]));
  }

  function renderWorks(y) {
    const list = byYear.get(y) || [];
    worksEl.innerHTML = '';
    if (!list.length) {
      const p = document.createElement('p'); p.textContent = 'No entries for this year.'; worksEl.appendChild(p); return;
    }
    list.forEach(w => {
      const card = document.createElement('article');
      card.className = 'work';

      const img = document.createElement('img');
      img.className = 'thumb';
      img.alt = w.author || 'Image'; 
      img.src = w.image || 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
      card.appendChild(img);

      const body = document.createElement('div');

      const h3 = document.createElement('h3');
      h3.innerHTML = `${esc(w.author)} — <em>${esc(w.work)}</em>`;
      body.appendChild(h3);

      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = [w.view, w.note].filter(Boolean).join(' · ');
      body.appendChild(meta);

      if (w.url) {
        const p = document.createElement('p');
        p.className = 'note';
        const a = document.createElement('a');
        a.href = w.url; a.target = '_blank'; a.rel = 'noopener';
        a.textContent = 'Source';
        p.appendChild(a);
        body.appendChild(p);
      }

      card.appendChild(body);
      worksEl.appendChild(card);
    });
  }

  function esc(s){ return String(s || '').replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }

  // click anywhere on rail -> go to nearest available year
  track.addEventListener('click', (e) => {
    if (e.target.classList.contains('tick')) return; // ticks already handle
    const r = rect();
    const p = clamp01((e.clientX - r.left) / r.width);
    const y = yearFromPos(p);
    goToNearest(y, true);
  });

  // dragging
  let dragging = false;
  knob.addEventListener('pointerdown', (e) => {
    dragging = true; timeline.classList.add('dragging');
    knob.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  });
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const r = rect();
    const p = clamp01((e.clientX - r.left) / r.width);
    const yRaw = yearFromPos(p);
    const y = nearestYear(yRaw);
    // live render without transitions
    renderYear(y, false);
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false; timeline.classList.remove('dragging');
    renderYear(years[index], true); // settle with animation at current year
  };
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  // keyboard
  knob.addEventListener('keydown', (e) => {
    const step = (d)=>{ index = Math.max(0, Math.min(years.length-1, index + d)); renderYear(years[index], true); };
    if (e.key === 'ArrowRight') { step(+1); e.preventDefault(); }
    if (e.key === 'ArrowLeft')  { step(-1); e.preventDefault(); }
    if (e.key === 'Home')       { renderYear(years[0], true); e.preventDefault(); }
    if (e.key === 'End')        { renderYear(years[years.length-1], true); e.preventDefault(); }
  });

  function nearestYear(y){
    let n = years[0], best = Math.abs(n - y);
    for (const v of years){ const d = Math.abs(v - y); if (d < best){ best = d; n = v; } }
    return n;
  }
  function goToNearest(y, animate){ renderYear(nearestYear(y), animate); }

  // init at first year
  renderYear(years[0], false);
})();
