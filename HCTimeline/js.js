/* js.js — timeline-only page
   - Loads Data.json (fallback to data.json)
   - Renders eras, content, and milestone ticks
   - Smooth click/drag/keyboard timeline interaction
*/

document.addEventListener('DOMContentLoaded', async () => {
  const ok = await initFromJSON();
  if (!ok) {
    console.error('Timeline init failed: could not load JSON or required DOM nodes missing.');
  }
});

/* ---------- Load & init ---------- */
async function initFromJSON() {
  const data = await loadJSON(['./Data.json', './data.json']);
  if (!data) return false;

  const scope      = document; // timeline-only page
  const trackEl    = scope.querySelector('.era-track');
  const viewport   = scope.querySelector('.era-viewport');
  const tl         = scope.querySelector('#timeline');
  const tlTrack    = scope.querySelector('#tlTrack');
  const tlFill     = scope.querySelector('#tlFill');
  const tlThumb    = scope.querySelector('#tlThumb');
  const tlYear     = scope.querySelector('#tlYear');
  const eraBanner  = scope.querySelector('#eraBanner');

  if (!trackEl || !viewport || !tl || !tlTrack || !tlFill || !tlThumb || !tlYear || !eraBanner) return false;

  /* Normalize eras & works */
  const ERAS = (data.eras || []).slice().sort((a,b)=>a.start-b.start);
  const LEG  = data.stance_legend || {};
  const WORKS = (data.works || []).slice().sort((a,b)=>a.year-b.year);

  // Group works by eraId for fast access
  const worksByEra = new Map();
  ERAS.forEach(e => worksByEra.set(e.id, []));
  WORKS.forEach(w => {
    if (!worksByEra.has(w.eraId)) worksByEra.set(w.eraId, []);
    worksByEra.get(w.eraId).push(w);
  });

  // Ensure we have the right number of panes and fill content
  ensurePaneCount(trackEl, ERAS.length);
  const panes = Array.from(trackEl.querySelectorAll('.era-pane')).slice(0, ERAS.length);
  panes.forEach((pane, idx) => {
    const era = ERAS[idx];
    pane.id = `pane-${idx}`;
    pane.setAttribute('aria-label', era.label);
    const h = pane.querySelector('.era-title') || pane.querySelector('h3') || createHeading(pane);
    h.textContent = era.label;

    const body = pane.querySelector('.era-content') || createContentDiv(pane);
    body.innerHTML = buildEraHTML(worksByEra.get(era.id) || [], LEG);
  });

  // CSS grid column count == eras
  trackEl.style.setProperty('--count', String(ERAS.length));

  /* Timeline math */
  const MIN_YEAR = Math.min(...ERAS.map(e=>e.start), ...(WORKS.length?WORKS.map(w=>w.year):[ERAS[0].start]));
  const MAX_YEAR = Math.max(...ERAS.map(e=>e.end),   ...(WORKS.length?WORKS.map(w=>w.year):[ERAS.at(-1).end || ERAS.at(-1).start+50]));
  const clamp01       = t => Math.max(0, Math.min(1, t));
  const lerp          = (a,b,t)=> a + (b-a)*t;
  const norm          = (x,a,b)=> (x-a)/(b-a);
  const posFromYear   = y => clamp01(norm(y, MIN_YEAR, MAX_YEAR));
  const yearFromPos   = p => lerp(MIN_YEAR, MAX_YEAR, p);
  const ease          = t => (t<.5)?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
  const fmtYear       = y => (y <= 0 ? `${Math.abs(y)} BC` : `${Math.round(y)} AD`);

  const eraIndexFromYear = y => {
    for (let k=0;k<ERAS.length;k++){
      const e = ERAS[k];
      if (y >= e.start && y < e.end) return k;
    }
    return (y >= ERAS.at(-1).end) ? ERAS.length-1 : 0;
  };

  // Choose a nice anchor year per era (primary works avg -> fallback mid of era)
  const anchors = ERAS.map(e => {
    const list = (worksByEra.get(e.id) || []);
    const prim = list.filter(w => w.primary);
    if (prim.length) {
      const avg = prim.reduce((s,w)=>s+w.year,0)/prim.length;
      return Math.round(avg);
    }
    return Math.round((e.start + e.end)/2);
  });

  /* Render ticks from works (dedupe by year label) */
  renderTicks(tlTrack, WORKS);

  /* State */
  let i = 0;                       // current era index
  let pos = posFromYear(anchors[0]);
  let animRAF = null;
  let dragging = false;

  // observe pane size to adjust viewport height
  const setHeight = ()=> { viewport.style.height = panes[i].scrollHeight + 'px'; };
  const ro = new ResizeObserver(setHeight);
  panes.forEach(p => ro.observe(p));

  function renderPosition(p){
    const pct = (p*100) + '%';
    tlFill.style.width = pct;
    tlThumb.style.left = pct;
    tlYear.style.left  = pct;

    const y = Math.round(yearFromPos(p));
    tlYear.textContent = fmtYear(y);

    const idx = eraIndexFromYear(y);
    eraBanner.textContent = ERAS[idx].label;
    tlThumb.setAttribute('aria-valuemin', '0');
    tlThumb.setAttribute('aria-valuemax', String(ERAS.length-1));
    tlThumb.setAttribute('aria-valuenow', String(idx));
    tlThumb.setAttribute('aria-valuetext', `${ERAS[idx].label} — ${fmtYear(y)}`);
  }

  function setEraByYear(y){
    const idx = eraIndexFromYear(y);
    if (idx !== i){
      i = idx;
      trackEl.style.transform = `translateX(${-100 * i}%)`;
      panes[i]?.scrollTo?.({top:0, behavior:'auto'});
      setHeight();
    }
  }

  function goToYear(targetYear, animate){
    const start = pos;
    const end   = posFromYear(targetYear);
    const D     = animate ? 360 : 0;
    const t0    = performance.now();

    cancelAnimationFrame(animRAF);
    const step = now => {
      const t = D ? Math.min(1, (now - t0)/D) : 1;
      const e = D ? ease(t) : 1;
      pos = start + (end - start) * e;
      renderPosition(pos);
      setEraByYear(yearFromPos(pos));
      if (t < 1) animRAF = requestAnimationFrame(step);
    };
    animRAF = requestAnimationFrame(step);
  }

  /* Interactions */
  tlTrack.addEventListener('click', e=>{
    if (e.target.classList.contains('tick')) return; // ticks handle themselves
    const r = tlTrack.getBoundingClientRect();
    const p = clamp01((e.clientX - r.left) / r.width);
    goToYear(yearFromPos(p), true);
  });

  tlThumb.addEventListener('pointerdown', e=>{
    dragging = true; tl.classList.add('is-dragging');
    tlThumb.setPointerCapture?.(e.pointerId);
    cancelAnimationFrame(animRAF);
    e.preventDefault();
  });
  window.addEventListener('pointermove', e=>{
    if(!dragging) return;
    const r = tlTrack.getBoundingClientRect();
    pos = clamp01((e.clientX - r.left) / r.width);
    renderPosition(pos);
    setEraByYear(yearFromPos(pos));
  });
  const endDrag = ()=>{
    if(!dragging) return;
    dragging = false; tl.classList.remove('is-dragging');
    goToYear(yearFromPos(pos), true); // settle smoothly where released
  };
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  // Keyboard: jump between primary works (milestones) if available, else coarse step
  const primaryYearsSorted = WORKS.filter(w=>w.primary).map(w=>w.year).sort((a,b)=>a-b);
  tlThumb.addEventListener('keydown', e=>{
    const currentYear = Math.round(yearFromPos(pos));
    if (primaryYearsSorted.length){
      const idx = nearestIndex(primaryYearsSorted, currentYear);
      if(e.key === 'ArrowRight'){ goToYear(primaryYearsSorted[Math.min(primaryYearsSorted.length-1, idx+1)], true); e.preventDefault(); }
      if(e.key === 'ArrowLeft'){  goToYear(primaryYearsSorted[Math.max(0, idx-1)], true); e.preventDefault(); }
    } else {
      const step = Math.round((MAX_YEAR - MIN_YEAR)/12);
      if(e.key === 'ArrowRight'){ goToYear(Math.min(MAX_YEAR, currentYear + step), true); e.preventDefault(); }
      if(e.key === 'ArrowLeft'){  goToYear(Math.max(MIN_YEAR, currentYear - step), true); e.preventDefault(); }
    }
    if(e.key === 'Home'){ goToYear(ERAS[0].start, true); e.preventDefault(); }
    if(e.key === 'End'){  goToYear(ERAS.at(-1).end, true); e.preventDefault(); }
  });

  /* Init */
  const initYear = anchors[0];
  setEraByYear(initYear);
  pos = posFromYear(initYear);
  renderPosition(pos);
  setHeight();
  window.addEventListener('resize', setHeight);

  return true;
}

/* ---------- helpers ---------- */
async function loadJSON(candidates){
  for (const url of candidates){
    try{
      const res = await fetch(url, {cache:'no-store'});
      if (!res.ok) continue;
      const txt = await res.text();
      // Defensive: strip BOM & tolerate trailing commas
      const cleaned = txt.replace(/^\uFEFF/, '')
                         .replace(/,\s*([}\]])/g, '$1');
      return JSON.parse(cleaned);
    }catch(_e){ /* try next */ }
  }
  return null;
}

function ensurePaneCount(trackEl, count){
  let panes = Array.from(trackEl.querySelectorAll('.era-pane'));
  // add if needed
  while (panes.length < count){
    const pane = document.createElement('section');
    pane.className = 'era-pane';
    pane.setAttribute('role','region');
    pane.innerHTML = `<h3 class="era-title">Loading…</h3><div class="era-content" aria-busy="true"></div>`;
    trackEl.appendChild(pane);
    panes.push(pane);
  }
  // remove extras
  while (panes.length > count){
    panes.pop().remove();
  }
}

function createHeading(pane){
  const h = document.createElement('h3');
  h.className = 'era-title';
  pane.prepend(h);
  return h;
}
function createContentDiv(pane){
  const d = document.createElement('div');
  d.className = 'era-content';
  pane.appendChild(d);
  return d;
}

// Build paragraph-only content (no bullet lists)
function buildEraHTML(works, legend){
  if (!works || works.length === 0) return `<p>No entries available for this era.</p>`;
  const stancePhrase = stance => {
    switch(stance){
      case 'material_veil':     return 'advocates or assumes a material veil in worship';
      case 'legal_canonical':   return 'codifies or legislates head covering practice';
      case 'symbolic_cultural': return 'treats the veil as a local symbol, with a transcultural principle';
      case 'hair_only':         return 'argues that long hair itself is the covering';
      case 'feminist_critique': return 'critiques the passage as culturally bound or patriarchal';
      default:                  return legend?.[stance] || 'discusses the passage';
    }
  };

  return works
    .slice()
    .sort((a,b)=>a.year-b.year)
    .map(w=>{
      const yr = (w.year <= 0) ? `${Math.abs(w.year)} BC` : `${w.year} AD`;
      const title = escapeHTML(w.title || '');
      const author = escapeHTML(w.author || '');
      const s = stancePhrase(w.stance);
      const link = w.url ? `<a href="${w.url}" target="_blank" rel="noopener noreferrer">${title}</a>` : title;

      // Paragraph-first; optional thumb image below paragraph if provided
      const img = w.image ? `
        <figure>
          <img src="${w.image}" alt="${author} — ${title}" loading="lazy">
        </figure>` : '';

      return `<p><strong>${yr} — ${author}.</strong> ${link} ${s ? `— ${s}.` : ''}</p>${img}`;
    })
    .join('');
}

function renderTicks(tlTrack, works){
  // Avoid duplicates by year (prefer primary if any duplicate)
  const byYear = new Map();
  for (const w of works){
    if (!byYear.has(w.year)) byYear.set(w.year, w);
    else if (w.primary && !byYear.get(w.year).primary) byYear.set(w.year, w);
  }
  const items = Array.from(byYear.values()).sort((a,b)=>a.year-b.year);
  if (!items.length) return;

  const MIN = Math.min(...items.map(x=>x.year));
  const MAX = Math.max(...items.map(x=>x.year));
  const leftPct = y => ((y - MIN) / (MAX - MIN)) * 100;

  const frag = document.createDocumentFragment();
  for (const m of items){
    const tick = document.createElement('button');
    tick.type = 'button';
    tick.className = 'tick' + (m.primary ? ' primary' : '');
    tick.style.left = leftPct(m.year) + '%';
    tick.title = `${m.year} — ${m.author}: ${m.title}`;
    tick.setAttribute('aria-label', tick.title);
    tick.addEventListener('click', () => {
      // bubble up to main handler by dispatching a custom event with the target year
      const ev = new CustomEvent('timeline:goto', {detail:{year:m.year}, bubbles:true});
      tlTrack.dispatchEvent(ev);
    });
    frag.appendChild(tick);

    if (m.primary){
      const lbl = document.createElement('div');
      lbl.className = 'tick-label';
      lbl.style.left = leftPct(m.year) + '%';
      lbl.textContent = String(m.year);
      frag.appendChild(lbl);
    }
  }
  tlTrack.appendChild(frag);

  // Listen for custom goto events (from ticks)
  tlTrack.addEventListener('timeline:goto', (e)=>{
    const year = e.detail?.year;
    if (typeof year === 'number') {
      // delegate to click on rail at the computed position
      const fakeX = tlTrack.getBoundingClientRect().left + (leftPct(year)/100)*tlTrack.offsetWidth;
      const p = Math.max(0, Math.min(1, (fakeX - tlTrack.getBoundingClientRect().left) / tlTrack.offsetWidth));
      const goEvent = new CustomEvent('timeline:goto:pos', {detail:{p}, bubbles:true});
      tlTrack.dispatchEvent(goEvent);
    }
  });
  // Bridge: allow main init to hook this (overridden in initFromJSON)
  tlTrack.addEventListener('timeline:goto:pos', ()=>{/* no-op, hooked in init */});
}

function nearestIndex(arrSortedAsc, value){
  if (!arrSortedAsc.length) return 0;
  let lo = 0, hi = arrSortedAsc.length - 1;
  while (lo < hi){
    const mid = (lo + hi) >> 1;
    if (arrSortedAsc[mid] < value) lo = mid + 1; else hi = mid;
  }
  // choose closer of lo and lo-1
  if (lo > 0 && Math.abs(arrSortedAsc[lo-1] - value) <= Math.abs(arrSortedAsc[lo] - value)) return lo-1;
  return lo;
}

function escapeHTML(s){
  return String(s).replace(/[&<>"']/g, m => (
    m==='&'?'&amp;':m==='<'?'&lt;':m==='>'?'&gt;':m==='"'?'&quot;':'&#39;'
  ));
}

