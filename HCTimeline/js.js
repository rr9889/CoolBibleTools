// js.js — JSON-driven draggable timeline (defensive against missing DOM nodes)

(() => {
  const DATA_URL = './data.json'; // case-sensitive

  // boot on DOM ready (defer-safe)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  async function boot() {
    const refs = {
      banner:    document.getElementById('eraBanner') || null,
      track:     document.getElementById('tlTrack')   || null,
      fill:      document.getElementById('tlFill')    || null,
      thumb:     document.getElementById('tlThumb')   || null,
      yearBadge: document.getElementById('tlYear')    || null,
      viewport:  document.querySelector('.era-viewport') || null,
      trackEl:   document.querySelector('.era-track')    || null,
      panes:     Array.from(document.querySelectorAll('.era-pane')),
    };

    // If the core rail is missing, bail silently.
    if (!refs.track || !refs.thumb || !refs.fill || !refs.yearBadge || !refs.trackEl || !refs.viewport || refs.panes.length === 0) {
      console.warn('[timeline] required elements missing; aborting init.');
      return;
    }

    // Load JSON (defensive)
    let eras = [];
    let items = [];
    try {
      const res = await fetch(DATA_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const json = await res.json();

      eras = Array.isArray(json.eras) ? json.eras : [];
      items = Array.isArray(json.works) ? json.works : [];
    } catch (e) {
      console.error('Failed to load data.json:', e);
      safeSetText(refs.banner, 'Failed to load data');
      return;
    }

    // Normalize + sort items, keep only numeric years
    items = items
      .filter(w => Number.isFinite(Number(w.year)))
      .map(w => ({
        year: Number(w.year),
        author: w.author || '',
        work:   w.title  || '',
        note:   w.type   || '',
        view:   w.view   || '',
        url:    w.url    || '',
        image:  w.img    || '',
        primary: !!w.primary
      }))
      .sort((a,b)=>a.year-b.year);

    // If no items, nothing to render
    if (!items.length) {
      safeSetText(refs.banner, eras[0]?.label || 'Timeline');
      safeSetText(refs.yearBadge, '—');
      return;
    }

    // Years that actually have works
    const years = Array.from(new Set(items.map(i=>i.year))).sort((a,b)=>a-b);
    const byYear = new Map();
    for (const y of years) byYear.set(y, items.filter(i=>i.year===y));

    // Bounds (from actual data)
    const MIN_YEAR = years[0];
    const MAX_YEAR = years[years.length - 1];

    // Grid columns = # of eras in JSON (fallback 1)
    refs.trackEl.style.setProperty('--count', String(Math.max(1, eras.length || 1)));

    // Helpers
    const clamp01 = t => Math.max(0, Math.min(1, t));
    const lerp    = (a,b,t)=> a + (b-a)*t;
    const norm    = (x,a,b)=> (x-a)/(b-a);
    const posFromYear = y => clamp01(norm(y, MIN_YEAR, MAX_YEAR));
    const yearFromPos = p => Math.round(lerp(MIN_YEAR, MAX_YEAR, p));
    const ease = t => (t<.5)?4*t*t*t:1-Math.pow(-2*t+2,3)/2;

    const eraIndexFromYear = (y) => {
      for (let i=0;i<eras.length;i++){
        const e = eras[i];
        if (typeof e?.start === 'number' && typeof e?.end === 'number' && y >= e.start && y < e.end) return i;
      }
      return 0;
    };

    const nearestYearWithWorks = (y) => {
      if (byYear.has(y)) return y;
      // binary search for nearest
      let lo = 0, hi = years.length-1;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        const v = years[mid];
        if (v === y) return v;
        if (v < y) lo = mid + 1; else hi = mid - 1;
      }
      if (hi < 0) return years[0];
      if (lo >= years.length) return years[years.length-1];
      return Math.abs(years[lo] - y) < Math.abs(years[hi] - y) ? years[lo] : years[hi];
    };

    // Render primary tick marks (for any item marked primary:true in JSON)
    if (!refs.track.querySelector('.tick')) {
      const frag = document.createDocumentFragment();
      for (const y of years) {
        const primary = (byYear.get(y) || []).some(i => i.primary);
        if (!primary) continue;
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

    // State
    let pos = 0;
    let curYear = eras[0]?.anchor ?? years[0];
    curYear = nearestYearWithWorks(curYear);
    let curEraIndex = eraIndexFromYear(curYear);
    let dragging = false;
    let raf = 0;

    // Initial render
    pos = posFromYear(curYear);
    renderKnob(pos);
    renderYear(curYear);
    switchPane(curEraIndex);
    syncHeight();

    // Resize observer to keep viewport height correct
    const ro = new ResizeObserver(syncHeight);
    refs.panes.forEach(p => ro.observe(p));
    window.addEventListener('resize', syncHeight);

    // ========== RENDERING ==========
    function renderKnob(p){
      const pct = (p*100) + '%';
      safeSetStyle(refs.fill, 'width', pct);
      safeSetStyle(refs.thumb, 'left', pct);
      safeSetStyle(refs.yearBadge, 'left', pct);
    }

    function renderYear(y){
      // Year text
      safeSetText(refs.yearBadge, y <= 0 ? `${Math.abs(y)} BC` : `${y} AD`);
      // Era banner (guarded)
      const idx = eraIndexFromYear(y);
      if (eras[idx]?.label) safeSetText(refs.banner, eras[idx].label);

      // Inject the works for EXACT year into that era’s pane
      const pane = refs.panes[idx] || null;
      if (!pane) return;
      const body = pane.querySelector('.era-content') || pane;
      const list = byYear.get(y) || [];
      body.innerHTML = list.length ? list.map(renderCard).join('') :
        `<p>No entries recorded for ${y}.</p>`;

      // Update heading inside pane if present
      const h = pane.querySelector('.era-title');
      if (h) h.textContent = `${eras[idx]?.label ?? 'Era'} — ${y}`;
    }

    function renderCard(it){
      const viewLabel = ({
        material_veil_required: 'Material veil required',
        material_veil_expected: 'Material veil expected',
        cultural_symbol:       'Cultural symbol / principle',
        hair_only:             'Hair-only view',
        no_requirement:        'No requirement'
      })[it.view] || '';

      const link = it.url
        ? `<a href="${escapeHTML(it.url)}" target="_blank" rel="noopener">${escapeHTML(it.work)}</a>`
        : escapeHTML(it.work);

      return `
        <article style="margin:0 0 1.1rem">
          <div style="font-weight:800">${escapeHTML(String(it.year))} — ${escapeHTML(it.author)}</div>
          <div>${link}</div>
          ${viewLabel ? `<div style="font-weight:700;margin-top:.25rem">${escapeHTML(viewLabel)}</div>` : ''}
          ${it.note ? `<div style="color:#666;font-size:.95em;margin-top:.25rem">${escapeHTML(it.note)}</div>` : ''}
          ${it.image ? `<img src="${escapeHTML(it.image)}" alt="" style="max-width:100%;height:auto;border-radius:8px;margin:.25rem 0;">` : ''}
        </article>`;
    }

    function switchPane(eraIndex){
      curEraIndex = eraIndex;
      safeSetStyle(refs.trackEl, 'transform', `translateX(${-100 * eraIndex}%)`);
      syncHeight();
    }

    function syncHeight(){
      const pane = refs.panes[curEraIndex];
      if (!pane) return;
      safeSetStyle(refs.viewport, 'height', pane.scrollHeight + 'px');
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
        const yLive = yearFromPos(pos);
        renderYear(yLive);
        switchPane(eraIndexFromYear(yLive));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }

    function goToYear(y, animate){
      const snap = nearestYearWithWorks(y);
      curYear = snap;
      animateTo(snap);
    }

    // ========== INTERACTION ==========
    // click anywhere on the rail -> nearest recorded year
    refs.track.addEventListener('click', (e)=>{
      if (e.target && e.target.classList.contains('tick')) return;
      const r = refs.track.getBoundingClientRect();
      const p = clamp01((e.clientX - r.left) / r.width);
      goToYear(yearFromPos(p), true);
    });

    // drag knob
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
      goToYear(yearFromPos(pos), true);
    };
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    // keyboard on knob: prev/next recorded year
    refs.thumb.addEventListener('keydown', (e)=>{
      const idx = years.findIndex(y => y >= curYear);
      if (e.key === 'ArrowRight') {
        const next = years[Math.min(years.length - 1, (idx === -1 ? 0 : idx) + 1)];
        goToYear(next, true);
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft') {
        const i = (idx === -1 ? years.length - 1 : Math.max(0, idx - 1));
        const prev = years[i];
        goToYear(prev, true);
        e.preventDefault();
      }
      if (e.key === 'Home') { goToYear(years[0], true); e.preventDefault(); }
      if (e.key === 'End')  { goToYear(years[years.length-1], true); e.preventDefault(); }
    });

    // ==== small safe DOM helpers ====
    function safeSetText(el, txt){ if (el) el.textContent = txt; }
    function safeSetStyle(el, prop, val){ if (el && el.style) el.style[prop] = val; }
    function escapeHTML(s){
      return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    }
  }
})();
