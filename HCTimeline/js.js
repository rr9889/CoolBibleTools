/* ========= Drawer open/close (works even if there is no drawer) ========= */
document.addEventListener('DOMContentLoaded', () => {
  const openBtn  = document.getElementById('open-compare');
  const drawer   = document.getElementById('compare-drawer');
  const backdrop = document.getElementById('compare-backdrop');
  const closeBtn = document.getElementById('close-compare');
  let lastFocus  = null;
  let sliderInit = false;

  function openDrawer(){
    lastFocus = document.activeElement || null;
    document.body.classList.add('no-scroll');
    if (backdrop) backdrop.hidden = false;
    requestAnimationFrame(()=>{
      backdrop?.classList.add('is-open');
      drawer?.classList.add('is-open');
      drawer?.setAttribute('aria-hidden','false');
      if(!sliderInit){ initEraTimeline(drawer || document); sliderInit = true; }
      closeBtn?.focus();
    });
  }
  function closeDrawer(){
    backdrop?.classList.remove('is-open');
    drawer?.classList.remove('is-open');
    drawer?.setAttribute('aria-hidden','true');
    drawer?.addEventListener('transitionend', function tidy(e){
      if(e.propertyName === 'transform'){
        if (backdrop) backdrop.hidden = true;
        document.body.classList.remove('no-scroll');
        drawer.removeEventListener('transitionend', tidy);
      }
    });
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }

  openBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e=>{
    if(e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) closeDrawer();
  });

  // If this is a timeline-only page (no drawer), init immediately.
  if (!drawer && document.getElementById('timeline')) {
    if(!sliderInit){ initEraTimeline(document); sliderInit = true; }
  }

  // footer year (if present)
  const y = document.getElementById('y'); if(y) y.textContent = new Date().getFullYear();
});

/* ========= Timeline + Era logic (data-driven via Data.json) ========= */
async function initEraTimeline(scope){
  // DOM
  const trackElAll = scope.querySelector('.era-track');          // sliding content container
  const allPanes   = Array.from(scope.querySelectorAll('.era-pane'));
  const viewport   = scope.querySelector('.era-viewport');

  const tl        = scope.querySelector('#timeline');
  const tlTrack   = scope.querySelector('#tlTrack');
  const tlFill    = scope.querySelector('#tlFill');
  const tlThumb   = scope.querySelector('#tlThumb');
  const tlYear    = scope.querySelector('#tlYear');
  const eraBanner = scope.querySelector('#eraBanner');

  if(!tl || !tlTrack || !tlThumb || !tlFill || !tlYear || !eraBanner || !trackElAll || !viewport) return;

  // -------- Load JSON --------
  let data;
  try {
    const res = await fetch('./data.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (err) {
    console.error('Failed to load Data.json:', err);
    // graceful fallback: do nothing (UI stays usable, just no ticks)
    return;
  }

  // Validate/normalize
  const ERAS = (Array.isArray(data.eras) ? data.eras : [])
    .map(e => ({
      label: e.label ?? e.key ?? 'Era',
      start: Number(e.start ?? 0),
      end:   Number(e.end   ?? 0),
      anchor: Number(e.anchor ?? (e.start ?? 0) )
    }))
    // Sort ascending by start to match the visual order (Antiquity → … → Modern)
    .sort((a,b)=> a.start - b.start);

  const WORKS = Array.isArray(data.works) ? data.works : [];

  // If the page has more panes than ERAS, hide extras to keep the slider width correct
  const panes = allPanes.slice(0, ERAS.length);
  const extraPanes = allPanes.slice(ERAS.length);
  extraPanes.forEach(p => { p.style.display = 'none'; });

  const trackEl = trackElAll;
  trackEl.style.setProperty('--count', String(panes.length));

  // -------- Build milestone ticks from works --------
  // Primary works = labeled ticks; non-primary = faint ticks
  const worksWithYear = WORKS.filter(w => Number.isFinite(w.year));
  const primary = worksWithYear.filter(w => w.primary);
  const secondary = worksWithYear.filter(w => !w.primary);

  // Timeline bounds from eras + all works
  const MIN_YEAR = Math.min(
    ...ERAS.map(e=>e.start),
    ...(worksWithYear.length ? worksWithYear.map(w=>w.year) : [new Date().getFullYear()])
  );
  const MAX_YEAR = Math.max(
    ...ERAS.map(e=>e.end),
    ...(worksWithYear.length ? worksWithYear.map(w=>w.year) : [new Date().getFullYear()])
  );

  // Helpers
  const clamp01 = t => Math.max(0, Math.min(1, t));
  const lerp    = (a,b,t)=> a + (b-a)*t;
  const norm    = (x,a,b)=> (x-a)/(b-a);
  const posFromYear = y => clamp01(norm(y, MIN_YEAR, MAX_YEAR));
  const yearFromPos = p => lerp(MIN_YEAR, MAX_YEAR, p);
  const ease    = t => (t<.5)?4*t*t*t:1-Math.pow(-2*t+2,3)/2;

  function eraIndexFromYear(y){
    for(let k=0;k<ERAS.length;k++){
      const e=ERAS[k]; if(y >= e.start && y < e.end) return k;
    }
    return (y >= ERAS[ERAS.length-1].end) ? ERAS.length-1 : 0;
  }

  // -------- Render ticks --------
  function renderTicks(){
    // clear any previous
    tlTrack.querySelectorAll('.tick, .tick-label').forEach(n => n.remove());

    const frag = document.createDocumentFragment();

    // Secondary (faint) ticks
    secondary.forEach(w=>{
      const leftPct = (posFromYear(w.year)*100) + '%';
      const tick = document.createElement('button');
      tick.type = 'button';
      tick.className = 'tick';
      tick.style.left = leftPct;
      tick.title = `${w.year} — ${w.author}: ${w.title}`;
      tick.setAttribute('aria-label', `${w.year}: ${w.author} — ${w.title}`);
      tick.addEventListener('click', ()=> goToYear(w.year, true));
      frag.appendChild(tick);
    });

    // Primary (labeled) ticks
    primary.forEach(w=>{
      const leftPct = (posFromYear(w.year)*100) + '%';
      const tick = document.createElement('button');
      tick.type = 'button';
      tick.className = 'tick primary';
      tick.style.left = leftPct;
      tick.title = `${w.year} — ${w.author}: ${w.title}`;
      tick.setAttribute('aria-label', `${w.year}: ${w.author} — ${w.title}`);
      tick.addEventListener('click', ()=> goToYear(w.year, true));
      frag.appendChild(tick);

      const lbl = document.createElement('div');
      lbl.className = 'tick-label';
      lbl.textContent = String(w.year);
      Object.assign(lbl.style, {
        position:'absolute',
        top:'calc(100% + 26px)',
        left:leftPct,
        transform:'translate(-50%,0)',
        fontSize:'11px',
        fontWeight:'800',
        color:'#333',
        whiteSpace:'nowrap',
        pointerEvents:'none',
        zIndex:'1'
      });
      frag.appendChild(lbl);
    });

    tlTrack.appendChild(frag);
  }

  // -------- State & rendering --------
  let i = 0;                               // current era index
  let pos = posFromYear(ERAS[0]?.anchor ?? MIN_YEAR);
  let animRAF = null;
  let dragging = false;

  const setHeight = ()=> { viewport.style.height = panes[i].scrollHeight + 'px'; };
  const ro = new ResizeObserver(setHeight);
  panes.forEach(p=> ro.observe(p));

  function renderPosition(p){
    const pct = (p*100) + '%';
    tlFill.style.width = pct;
    tlThumb.style.left = pct;
    tlYear.style.left  = pct;

    const y = Math.round(yearFromPos(p));
    tlYear.textContent = (y <= 0 ? `${Math.abs(y)} BC` : `${y} AD`);

    const idx = eraIndexFromYear(y);
    eraBanner.textContent = ERAS[idx]?.label ?? '';
    tlThumb.setAttribute('aria-valuenow', String(idx));
    tlThumb.setAttribute('aria-valuetext', `${ERAS[idx]?.label ?? ''} — ${tlYear.textContent}`);
  }

  function setEraByYear(y){
    const idx = eraIndexFromYear(y);
    if(idx !== i){
      i = idx;
      trackElAll.style.transform = `translateX(${-100 * i}%)`;
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
      if(t < 1) animRAF = requestAnimationFrame(step);
    };

    animRAF = requestAnimationFrame(step);
  }

  // -------- Interactions --------
  tlTrack.addEventListener('click', e=>{
    if(e.target.classList.contains('tick')) return;
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
    goToYear(yearFromPos(pos), true);
  };
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  // Keyboard: step between **primary** milestones by year
  tlThumb.addEventListener('keydown', e=>{
    const currentYear = Math.round(yearFromPos(pos));
    const primYears = primary.map(w=>w.year).sort((a,b)=>a-b);
    const nearestIndex = (() => {
      let idx = primYears.findIndex(y=> y >= currentYear);
      if(idx === -1) idx = primYears.length - 1;
      return idx;
    })();

    if(e.key === 'ArrowRight'){
      const next = Math.min(primYears.length-1, nearestIndex + 1);
      if (primYears.length) goToYear(primYears[next], true);
      e.preventDefault();
    }
    if(e.key === 'ArrowLeft'){
      const prev = Math.max(0, nearestIndex - 1);
      if (primYears.length) goToYear(primYears[prev], true);
      e.preventDefault();
    }
    if(e.key === 'Home'){ goToYear(ERAS[0]?.start ?? MIN_YEAR, true); e.preventDefault(); }
    if(e.key === 'End'){  goToYear(ERAS.at(-1)?.end ?? MAX_YEAR, true); e.preventDefault(); }
  });

  // -------- Init --------
  renderTicks();
  const initYear = ERAS[0]?.anchor ?? MIN_YEAR;
  setEraByYear(initYear);
  pos = posFromYear(initYear);
  renderPosition(pos);
  setHeight();

  window.addEventListener('resize', setHeight);
}
