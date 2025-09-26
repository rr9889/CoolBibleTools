/* js.js — timeline-only page (robust JSON loading + smooth timeline)
   - Reads JSON URL from <script data-json="..."> or window.DATA_JSON_URL
   - Falls back to common filenames and parent paths
   - Renders eras, content, and milestone ticks
   - Smooth click/drag/keyboard interaction
*/

document.addEventListener('DOMContentLoaded', async () => {
  const ok = await initFromJSON();
  if (!ok) console.error('Timeline init failed: could not load JSON or required DOM nodes missing.');
});

async function initFromJSON() {
  // Pick up the JSON URL from the script tag or fallback candidates
  const thisScript = document.currentScript || Array.from(document.scripts).find(s => /js\.js(\?|$)/.test(s.src));
  const explicit   = (thisScript?.dataset?.json || window.DATA_JSON_URL || '').trim();

  const candidates = [
    explicit,
    './data.json',
    'data.json',
    '/CoolBibleTools/HCTimeline/data.json'
  ].filter(Boolean);

  const data = await loadJSON(candidates);
  if (!data) return false;

  // ... keep your existing init code that uses `data` ...
  // (no changes needed below this point)
  return true;
}

async function loadJSON(candidates){
  for (const url of candidates){
    try{
      if (!url) continue;
      const res = await fetch(url, { cache:'no-store' });
      console.log('[Data.json loader] trying:', url, res.status);
      if (!res.ok) continue;
      const txt = await res.text();
      const cleaned = txt.replace(/^\uFEFF/, '').replace(/,\s*([}\]])/g, '$1'); // strip BOM & trailing commas
      return JSON.parse(cleaned);
    }catch(err){
      console.warn('Failed to load', url, err);
    }
  }
  return null;
}


/* ---------- Load & init ---------- */
async function initFromJSON() {
  // DOM
  const scope      = document;
  const trackEl    = scope.querySelector('.era-track');
  const viewport   = scope.querySelector('.era-viewport');
  const tl         = scope.querySelector('#timeline');
  const tlTrack    = scope.querySelector('#tlTrack');
  const tlFill     = scope.querySelector('#tlFill');
  const tlThumb    = scope.querySelector('#tlThumb');
  const tlYear     = scope.querySelector('#tlYear');
  const eraBanner  = scope.querySelector('#eraBanner');

  if (!trackEl || !viewport || !tl || !tlTrack || !tlFill || !tlThumb || !tlYear || !eraBanner) return false;

  // Determine JSON URL from <script data-json="..."> or window.DATA_JSON_URL
  const thisScript = document.currentScript || Array.from(document.scripts).find(s => /js\.js(\?|$)/.test(s.src));
  const explicit = (thisScript && thisScript.dataset && thisScript.dataset.json) || (typeof window !== 'undefined' && window.DATA_JSON_URL) || null;

  const candidates = [
    explicit,
    './Data.json', './data.json', 'Data.json', 'data.json',
    '../Data.json', '../data.json',
    '/Data.json', '/data.json'
  ].filter(Boolean);

  const data = await loadJSON(candidates);
  if (!data) return false;

  /* Normalize eras & works */
  const ERAS = (data.eras || []).slice().sort((a,b)=>a.start-b.start);
  const LEG  = data.stance_legend || {};
  const WORKS = (data.works || []).slice().sort((a,b)=>a.year-b.year);

  // Group works by eraId
  const worksByEra = new Map();
  ERAS.forEach(e => worksByEra.set(e.id, []));
  WORKS.forEach(w => {
    if (!worksByEra.has(w.eraId)) worksByEra.set(w.eraId, []);
    worksByEra.get(w.eraId).push(w);
  });

  // Ensure pane count equals eras, fill content
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

  // CSS grid column count
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
  const leftPct       = y => ((y - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;

  const eraIndexFromYear = y => {
    for (let k=0;k<ERAS.length;k++){
      const e = ERAS[k];
      if (y >= e.start && y < e.end) return k;
    }
    return (y >= ERAS.at(-1).end) ? ERAS.length-1 : 0;
  };

  // Choose an anchor per era (avg of primary works, else middle of era)
  const anchors = ERAS.map(e => {
    const list = (worksByEra.get(e.id) || []);
    const prim = list.filter(w => w.primary);
    if (prim.length) {
      const avg = prim.reduce((s,w)=>s+w.year,0)/prim.length;
      return Math.round(avg);
    }
    return Math.round((e.start + e.end)/2);
  });

  /* Render ticks (dedup by year; clicking jumps) */
  renderTicks(tlTrack, WORKS, (year)=> goToYear(year, true), leftPct);

  /* State */
  let i = 0;
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
      console.log('[Data.json loader] trying:', url, res.status);
      if (!res.ok) continue;
      const txt = await res.text();
      // Defensive: strip BOM & tolerate trailing commas
      const cleaned = txt.replace(/^\uFEFF/, '')
                         .replace(/,\s*([}\]])/g, '$1');
      const obj = JSON.parse(cleaned);
      console.log('[Data.json loader] loaded:', url);
      return obj;
    }catch(err){
      console.warn('Failed to load', url, err);
    }
  }
  return null;
}

function ensurePaneCount(trackEl, count){
  let panes = Array.from(trackEl.querySelectorAll('.era-pane'));
  // add
  while (panes.length < count){
    const pane = document.createElement('section');
    pane.className = 'era-pane';
    pane.setAttribute('role','region');
    pane.innerHTML = `<h3 class="era-title">Loading…</h3><div class="era-content" aria-busy="true"></div>`;
    trackEl.appendChild(pane);
    panes.push(pane);
  }
  // remove
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

      const img = w.image ? `
        <figure>
          <img src="${w.image}" alt="${author} — ${title}" loading="lazy">
        </figure>` : '';

      return `<p><strong>${yr} — ${author}.</strong> ${link} ${s ? `— ${s}.` : ''}</p>${img}`;
    })
    .join('');
}

/* Render ticks; clicking a tick calls goTo(year) directly */
function renderTicks(tlTrack, works, goToYearCb, leftPct){
  // Dedupe by year (prefer primary)
  const byYear = new Map();
  for (const w of works){
    if (!byYear.has(w.year)) byYear.set(w.year, w);
    else if (w.primary && !byYear.get(w.year).primary) byYear.set(w.year, w);
  }
  const items = Array.from(byYear.values()).sort((a,b)=>a.year-b.year);
  if (!items.length) return;

  const frag = document.createDocumentFragment();
  for (const m of items){
    const tick = document.createElement('button');
    tick.type = 'button';
    tick.className = 'tick' + (m.primary ? ' primary' : '');
    tick.style.left = leftPct(m.year) + '%';
    tick.title = `${m.year} — ${m.author}: ${m.title}`;
    tick.setAttribute('aria-label', tick.title);
    tick.addEventListener('click', () => goToYearCb(m.year));
    frag.appendChild(tick);

    if (m.primary){
      const lbl = document.createElement('div');
      lbl.className = 'tick-label';
      lbl.style.position = 'absolute';
      lbl.style.top = 'calc(100% + 26px)';
      lbl.style.left = leftPct(m.year) + '%';
      lbl.style.transform = 'translate(-50%,0)';
      lbl.style.fontSize = '11px';
      lbl.style.fontWeight = '800';
      lbl.style.color = '#333';
      lbl.style.whiteSpace = 'nowrap';
      lbl.style.pointerEvents = 'none';
      lbl.style.zIndex = '1';
      lbl.textContent = String(m.year);
      frag.appendChild(lbl);
    }
  }
  tlTrack.appendChild(frag);
}

function nearestIndex(arrSortedAsc, value){
  if (!arrSortedAsc.length) return 0;
  let lo = 0, hi = arrSortedAsc.length - 1;
  while (lo < hi){
    const mid = (lo + hi) >> 1;
    if (arrSortedAsc[mid] < value) lo = mid + 1; else hi = mid;
  }
  if (lo > 0 && Math.abs(arrSortedAsc[lo-1] - value) <= Math.abs(arrSortedAsc[lo] - value)) return lo-1;
  return lo;
}

function escapeHTML(s){
  return String(s).replace(/[&<>"']/g, m => (
    m==='&'?'&amp;':m==='<'?'&lt;':m==='>'?'&gt;':m==='"'?'&quot;':'&#39;'
  ));
}

