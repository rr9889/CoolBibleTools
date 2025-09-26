// js.js — timeline-first, JSON-driven; robust to missing nodes

(() => {
  const DATA_URL = './data.json'; // case-sensitive; matches your repo

  // DOM ready + defer-safe
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  async function boot() {
    // Grab all the elements we need once
    const refs = {
      banner:    document.getElementById('eraBanner'),
      track:     document.getElementById('tlTrack'),
      fill:      document.getElementById('tlFill'),
      thumb:     document.getElementById('tlThumb'),
      yearBadge: document.getElementById('tlYear'),
      viewport:  document.querySelector('.era-viewport'),
      trackEl:   document.querySelector('.era-track'),
      panes:     Array.from(document.querySelectorAll('.era-pane')),
    };

    // Hard fail early if the timeline shell isn’t on the page
    const missing = Object.entries(refs).filter(([,v]) => !v || (Array.isArray(v) && !v.length));
    if (missing.length) {
      console.error('Timeline init aborted. Missing elements:', missing.map(([k]) => k));
      return;
    }

    // Load JSON
    let eras = [];
    let items = [];
    try {
      const res = await fetch(DATA_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const json = await res.json();
      eras  = json.eras || [];
      items = json.works ? json.works.map(w => ({
        // normalize the field names my renderer expects
        year:   Number(w.year),
        author: w.author,
        work:   w.title,            // title -> work
        note:   w.type || '',
        view:   w.view || '',
        url:    w.url || '',
        image:  w.img || '',
        primary: Boolean(w.primary)
      })) : [];
    } catch (err) {
      console.error('Failed to load data.json:', err);
      refs.banner && (refs.banner.textContent = 'Failed to load data');
      return;
    }

    // ---- Data prep ----
    // Keep only items with a valid numeric year
    items = items.filter(x => Number.isFinite(x.year)).sort((a,b)=>a.year-b.year);

    // Unique, sorted years that actually have works
    const years = Array.from(new Set(items.map(x => x.year))).sort((a,b)=>a-b);

    // Map year -> items
    const byYear = new Map();
    for (const y of years) byYear.set(y, items.filter(x => x.year === y));

    // Bounds
    const MIN_YEAR = years[0];
    const MAX_YEAR = years[years.length - 1];

    // Panes are per-era (5 shells in your HTML). Use eras array from JSON.
    // Ensure grid column count matches
    refs.trackEl.style.setProperty('--count', String(eras.length));

    // Utility
    const clamp01 = t => Math.max(0, Math.min(1, t));
    const lerp    = (a,b,t)=> a + (b-a)*t;
    const norm    = (x,a,b)=> (x-a)/(b-a);
    const posFromYear = y => clamp01(norm(y, MIN_YEAR, MAX_YEAR));
    const yearFromPos = p => Math.round(lerp(MIN_YEAR, MAX_YEAR, p));
    const ease = t => (t<.5)?4*t*t*t:1-Math.pow(-2*t+2,3)/2;

    const eraIndexFromYear = (y) => {
      for (let i=0;i<eras.length;i++){
        const e = eras[i];
        if (y >= e.start && y < e.end) return i;
      }
      return (y >= eras[eras.length-1].end) ? eras.length-1 : 0;
    };

    const nearestYearWithWorks = (y) => {
      // Fast path if exact match exists
      if (byYear.has(y)) return y;
      // Binary search for nearest value in sorted years
      let lo = 0, hi = years.length - 1;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        const val = years[mid];
        if (val === y) return val;
        if (val < y) lo = mid + 1; else hi = mid - 1;
      }
      // lo is first greater; hi is last smaller
      if (hi < 0) return years[0];
      if (lo >= years.length) return years[years.length - 1];
      return (Math.abs(years[lo] - y) < Math.abs(years[hi] - y)) ? years[lo] : years[hi];
    };

    // ---- Render ticks (primary years only) ----
    if (!refs.track.querySelector('.tick')) {
      const frag = document.createDocumentFragment();
      for (const y of years) {
        const isPrimary = (byYear.get(y) || []).some(it => it.primary);
        if (!isPrimary) continue;
        const left = (posFromYear(y) * 100) + '%';

        const tick = document.createElement('button');
        tick.type = 'button';
        tick.className = 'tick primary';
        tick.style.left = left;
        tick.title = String(y);
        tick.setAttribute('aria-label', String(y));
        tick.addEventListener('click', () => goToYear(y, true));
        frag.appendChild(tick);

        const lbl = document.createElement('div');
        lbl.textContent = String(y);
        Object.assign(lbl.style, {
          position:'absolute', top:'calc(100% + 26px)', left, transform:'translate(-50%,0)',
          fontSize:'11px', fontWeight:'800', color:'#333', pointerEvents:'none'
        });
        frag.appendChild(lbl);
      }
      refs.track.appendChild(frag);
    }

    // ---- State ----
    let pos = 0;                       // 0..1
    let curYear = eras[0]?.anchor ?? years[0];
    let curEraIndex = eraIndexFromYear(curYear);
    let dragging = false;
    let raf = 0;

    // Initial placement
    pos = posFromYear(curYear);
    renderKnob(pos);
    renderYear(curYear);
    switchPane(curEraIndex);

    // Keep viewport height synced to active pane
    const setHeight = () => {
      const pane = refs.panes[curEraIndex];
      if (!pane) return;
      refs.viewport.style.height = pane.scrollHeight + 'px';
    };
    const ro = new ResizeObserver(setHeight);
    refs.panes.forEach(p => ro.observe(p));
    setHeight();

    // ---- Rendering helpers ----
    function renderKnob(p){
      const pct = (p*100) + '%';
      refs.fill.style.width = pct;
      refs.thumb.style.left = pct;
      refs.yearBadge.style.left = pct;
    }

    function renderYear(y){
      // Guard every time; if any element is missing, just skip
      if (refs.yearBadge) refs.yearBadge.textContent = y <= 0 ? `${Math.abs(y)} BC` : `${y} AD`;
      const ei = eraIndexFromYear(y);
      if (refs.banner && eras[ei]) refs.banner.textContent = eras[ei].label;
      // Populate content for the selected year into its era pane
      const pane = refs.panes[ei];
      if (!pane) return;
      const body = pane.querySelector('.era-content') || pane;
      const list = byYear.get(y) || [];
      body.innerHTML = list.length ? list.map(renderCard).join('') :
        `<p>No entries recorded for ${y}.</p>`;
      // Keep the heading up to date
      const h = pane.querySelector('.era-title');
      if (h) h.textContent = `${eras[ei]?.label ?? 'Era'} — ${y}`;
    }

    function renderCard(it){
      const viewLabel = ({
        material_veil_required: 'Material veil required',
        material_veil_expected: 'Material veil expected',
        cultural_symbol: 'Cultural symbol / principle',
        hair_only: 'Hair-only view',
        no_requirement: 'No requirement'
      })[it.view] || '';
      const img = it.image ? `<img src="${it.image}" alt="" style="max-width:100%;height:auto;border-radius:8px;margin:.25rem 0;">` : '';
      const note = it.note ? `<div style="color:#666;font-size:.95em;margin-top:.25rem">${escapeHTML(it.note)}</div>` : '';
      const view = viewLabel ? `<div style="font-weight:700;margin-top:.25rem">${escapeHTML(viewLabel)}</div>` : '';
      const link = it.url ? `<a href="${it.url}" target="_blank" rel="noopener">${escapeHTML(it.work)}</a>` : escapeHTML(it.work);
      return `
        <article style="margin:0 0 1.1rem">
          <div style="font-weight:800">${escapeHTML(String(it.year))} — ${escapeHTML(it.author)}</div>
          <div>${link}</div>
          ${view}${note}${img}
        </article>`;
    }

    function switchPane(eraIndex){
      curEraIndex = eraIndex;
      refs.trackEl.style.transform = `translateX(${-100 * eraIndex}%)`;
      setHeight();
    }

    function animateTo(targetYear){
      const start = pos;
      const end = posFromYear(targetYear);
      const t0 = performance.now();
      const D = 360;

      cancelAnimationFrame(raf);
      const step = (now) => {
        const t = Math.min(1, (now - t0)/D);
        const e = ease(t);
        pos = start + (end - start) * e;
        renderKnob(pos);
        const yLive = Math.round(lerp(MIN_YEAR, MAX_YEAR, pos));
        renderYear(yLive);
        switchPane(eraIndexFromYear(yLive));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }

    // ---- Interactions ----
    refs.track.addEventListener('click', (e)=>{
      if ((e.target && e.target.classList.contains('tick'))) return;
      const r = refs.track.getBoundingClientRect();
      const p = clamp01((e.clientX - r.left) / r.width);
      const y = nearestYearWithWorks(yearFromPos(p));
      curYear = y;
      animateTo(y);
    });

    refs.thumb.addEventListener('pointerdown', (e)=>{
      dragging = true;
      refs.thumb.setPointerCapture?.(e.pointerId);
      document.querySelector('.timeline')?.classList.add('is-dragging');
      cancelAnimationFrame(raf);
      e.preventDefault();
    });
    window.addEventListener('pointermove', (e)=>{
      if (!dragging) return;
      const r = refs.track.getBoundingClientRect();
      pos = clamp01((e.clientX - r.left) / r.width);
      const yLive = yearFromPos(pos);
      renderKnob(pos);
      renderYear(yLive);
      switchPane(eraIndexFromYear(yLive));
    });
    const endDrag = ()=>{
      if (!dragging) return;
      dragging = false;
      document.querySelector('.timeline')?.classList.remove('is-dragging');
      const y = nearestYearWithWorks(yearFromPos(pos));
      curYear = y;
      animateTo(y);
    };
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    // Keyboard: move to previous/next recorded year
    refs.thumb.addEventListener('keydown', (e)=>{
      const idx = years.findIndex(y => y >= curYear);
      if (e.key === 'ArrowRight') {
        const next = years[Math.min(years.length - 1, (idx === -1 ? 0 : idx) + 1)];
        curYear = next;
        animateTo(next);
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft') {
        const i = (idx === -1 ? years.length - 1 : Math.max(0, idx - 1));
        const prev = years[i];
        curYear = prev;
        animateTo(prev);
        e.preventDefault();
      }
      if (e.key === 'Home') { curYear = years[0]; animateTo(curYear); e.preventDefault(); }
      if (e.key === 'End')  { curYear = years[years.length-1]; animateTo(curYear); e.preventDefault(); }
    });

    // Helpers
    function escapeHTML(s){
      return String(s).replace(/[&<>"']/g, m => ({
        '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
      }[m]));
    }
  }
})();
