// Single timeline. Click a year => show ONLY that year's works.
// Expects data in ./data.json (override path via data-json attribute on this script).

(async function () {
  const scriptEl = document.currentScript;
  const dataPath = scriptEl?.getAttribute('data-json') || './data.json';

  // DOM
  const tl = document.getElementById('timeline');
  const track = document.getElementById('tlTrack');
  const fill = document.getElementById('tlFill');
  const knob = document.getElementById('tlThumb');
  const yearBadge = document.getElementById('tlYear');
  const banner = document.getElementById('eraBanner');
  const yearHeading = document.getElementById('yearHeading');
  const worksWrap = document.getElementById('works');

  if (!tl || !track || !fill || !knob || !yearBadge || !banner || !yearHeading || !worksWrap) return;

  // Load data
  let raw;
  try {
    const res = await fetch(dataPath, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    raw = await res.json();
  } catch (err) {
    console.error('Failed to load Data.json:', err);
    banner.textContent = 'Failed to load data';
    return;
  }

  // Accept either {items:[...]} or {milestones:[...]} or a plain array
  const items = Array.isArray(raw) ? raw
               : Array.isArray(raw.items) ? raw.items
               : Array.isArray(raw.milestones) ? raw.milestones
               : [];

  // Normalize + group by exact year
  const sanitize = (n) => Number(String(n).trim().replace(/[^\-0-9]/g, ''));
  const map = new Map();
  items.forEach(it => {
    const year = sanitize(it.year);
    if (Number.isNaN(year)) return;
    const obj = {
      year,
      author: it.author || '',
      title: it.title || '',
      work: it.work || it.title || '',
      view: it.view || '',
      note: it.note || it.notes || '',
      url: it.url || '',
      image: it.image || '',
      primary: !!it.primary
    };
    if (!map.has(year)) map.set(year, []);
    map.get(year).push(obj);
  });

  if (map.size === 0) {
    banner.textContent = 'No data';
    return;
  }

  const years = [...map.keys()].sort((a,b)=>a-b);
  const MIN = years[0];
  const MAX = years[years.length-1];
  const posFromYear = y => (MAX === MIN) ? 0.5 : (y - MIN) / (MAX - MIN);
  const yearFromPos = p => Math.round(MIN + p * (MAX - MIN));
  const fmtYear = y => (y <= 0 ? `${Math.abs(y)} BC` : `${y} AD`);
  const clamp01 = t => Math.max(0, Math.min(1, t));

  // Build ticks. Add labels that don't collide (≥ 46px apart).
  let lastLabelX = -Infinity;
  const rectFor = () => track.getBoundingClientRect();
  const labelMinGap = 46;

  years.forEach((y, idx) => {
    const p = posFromYear(y) * 100;

    // tick button
    const tick = document.createElement('button');
    tick.type = 'button';
    tick.className = 'tick' + (map.get(y).some(x=>x.primary) ? ' primary' : '');
    tick.style.left = p + '%';
    tick.setAttribute('aria-label', `Go to year ${fmtYear(y)}`);
    tick.addEventListener('click', () => goToYear(y, true));
    track.appendChild(tick);

    // label (avoid overlap by checking pixel distance)
    const r = rectFor();
    const x = r.left + r.width * (p/100);
    if (x - lastLabelX >= labelMinGap) {
      const lbl = document.createElement('div');
      lbl.className = 'tick-label';
      lbl.style.left = p + '%';
      lbl.textContent = String(y);
      track.appendChild(lbl);
      lastLabelX = x;
    }
  });

  // State
  let idx = 0;               // index in years[]
  let dragging = false;

  // Render helpers
  function renderKnobToYear(y, animate=true) {
    idx = Math.max(0, Math.min(years.length-1, years.indexOf(y)));
    const p = posFromYear(years[idx]) * 100;
    if (animate) {
      knob.style.left = p + '%';
      fill.style.width = p + '%';
      yearBadge.style.left = p + '%';
    } else {
      knob.style.transition = 'none';
      fill.style.transition = 'none';
      yearBadge.style.transition = 'none';
      knob.style.left = p + '%';
      fill.style.width = p + '%';
      yearBadge.style.left = p + '%';
      // force reflow then restore
      void knob.offsetWidth;
      knob.style.transition = '';
      fill.style.transition = '';
      yearBadge.style.transition = '';
    }
    yearBadge.textContent = fmtYear(years[idx]);
    banner.textContent = 'Year view';
    renderDetails(years[idx]);
    knob.setAttribute('aria-valuemin', '0');
    knob.setAttribute('aria-valuemax', String(years.length-1));
    knob.setAttribute('aria-valuenow', String(idx));
    knob.setAttribute('aria-valuetext', fmtYear(years[idx]));
  }

  function renderDetails(y) {
    const works = map.get(y) || [];
    yearHeading.textContent = fmtYear(y);
    worksWrap.innerHTML = '';

    works.forEach(w => {
      const card = document.createElement('article');
      card.className = 'work';

      const img = document.createElement('img');
      img.className = 'thumb';
      img.alt = w.author ? `${w.author}` : 'Artwork';
      img.src = w.image || 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
      card.appendChild(img);

      const body = document.createElement('div');

      const h3 = document.createElement('h3');
      h3.innerHTML = `${w.author ? `${escapeHtml(w.author)} — ` : ''}<em>${escapeHtml(w.work || w.title)}</em>`;
      body.appendChild(h3);

      if (w.view || w.note) {
        const meta = document.createElement('div');
        meta.className = 'meta';
        meta.textContent = [w.view, w.note].filter(Boolean).join(' · ');
        body.appendChild(meta);
      }

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
      worksWrap.appendChild(card);
    });

    if (works.length === 0) {
      const p = document.createElement('p');
      p.textContent = 'No entries for this year.';
      worksWrap.appendChild(p);
    }
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, m => (
      { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[m]
    ));
  }

  // Interactions
  function goToYear(y, animate) { renderKnobToYear(y, animate); }

  // clicking anywhere on rail -> nearest year
  track.addEventListener('click', (e) => {
    if (e.target.classList.contains('tick')) return; // ticks already handled
    const r = track.getBoundingClientRect();
    const p = clamp01((e.clientX - r.left) / r.width);
    const y = yearFromPos(p);
    // find nearest real year
    let nearest = years[0];
    let best = Math.abs(nearest - y);
    for (const v of years) {
      const d = Math.abs(v - y);
      if (d < best) { best = d; nearest = v; }
    }
    goToYear(nearest, true);
  });

  // dragging knob
  knob.addEventListener('pointerdown', (e) => {
    dragging = true; tl.classList.add('dragging');
    knob.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  });
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const r = track.getBoundingClientRect();
    const p = clamp01((e.clientX - r.left) / r.width);
    // live move (no snap) but find nearest displayed year for details
    const yRaw = yearFromPos(p);
    let nearest = years[0], best = Math.abs(nearest - yRaw);
    for (const v of years) { const d = Math.abs(v - yRaw); if (d < best){best=d; nearest=v;} }
    // render without transition
    const px = (posFromYear(nearest) * 100) + '%';
    knob.style.left = px;
    fill.style.width = px;
    yearBadge.style.left = px;
    yearBadge.textContent = fmtYear(nearest);
    renderDetails(nearest);
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false; tl.classList.remove('dragging');
    // ensure we snap to the *current* nearest year (already rendered)
    const current = yearHeading.textContent.replace(/[^\-0-9]/g,'');
    const y = Number(current) || years[0];
    goToYear(y, true);
  };
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  // keyboard
  knob.addEventListener('keydown', (e) => {
    const move = (delta) => {
      const ni = Math.max(0, Math.min(years.length-1, idx + delta));
      goToYear(years[ni], true);
    };
    if (e.key === 'ArrowRight') { move(+1); e.preventDefault(); }
    if (e.key === 'ArrowLeft')  { move(-1); e.preventDefault(); }
    if (e.key === 'Home')       { goToYear(years[0], true); e.preventDefault(); }
    if (e.key === 'End')        { goToYear(years[years.length-1], true); e.preventDefault(); }
  });

  // init at the FIRST year in the file
  goToYear(years[0], false);

})();
