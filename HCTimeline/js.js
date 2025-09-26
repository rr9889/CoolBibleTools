/* =======================================================
   js.js — Timeline-only (works with Data.json + styles.css)
   - Builds eras & milestones from ./Data.json
   - Smooth drag/click interactions
   - No hardcoded dates or content
   ======================================================= */

document.addEventListener('DOMContentLoaded', async () => {
  const jsonUrl = './Data.json';

  try {
    const res = await fetch(jsonUrl, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Basic validation - look for 'works' instead of 'milestones'
    if (!data || !Array.isArray(data.eras) || !Array.isArray(data.works)) {
      throw new Error('Invalid JSON shape: expected { eras:[], works:[] }');
    }

    initTimelineFromData(document, data);
  } catch (err) {
    console.error('Failed to load Data.json:', err);
    // Minimal fallback UI message
    const banner = document.getElementById('eraBanner');
    const year   = document.getElementById('tlYear');
    if (banner) banner.textContent = 'Data load failed';
    if (year)   year.textContent   = '—';
  }
});

/* ---------------- Core ---------------- */

function initTimelineFromData(root, data) {
  // DOM refs
  const timeline   = root.getElementById('timeline');
  const tlTrack    = root.getElementById('tlTrack');
  const tlFill     = root.getElementById('tlFill');
  const tlThumb    = root.getElementById('tlThumb');
  const tlYear     = root.getElementById('tlYear');
  const eraBanner  = root.getElementById('eraBanner');

  const viewport   = root.querySelector('.era-viewport');
  const trackEl    = root.querySelector('.era-track'); // content panes track

  if (!timeline || !tlTrack || !tlFill || !tlThumb || !tlYear || !eraBanner || !viewport || !trackEl) {
    console.warn('Missing required DOM nodes for the timeline.');
    return;
  }

  // Normalize + sort eras by start year
  const ERAS = [...data.eras]
    .map(e => ({
      label: String(e.label),
      start: Number(e.start),
      end:   Number(e.end),
      anchor: Number(e.anchor ?? e.start)
    }))
    .sort((a,b) => a.start - b.start);

  // Convert works to milestones format and prepare milestones; sort by year
  const MILESTONES = [...data.works]
    .map(w => ({
      id: w.id || `${w.year}-${w.author}`,
      year: Number(w.year),
      label: `${w.author}: ${w.title}`,
      era_label: ERAS.find(era => w.eraId === era.id)?.label || '',
      primary: !!w.primary,
      view: String(w.stance || ''),
      url: w.url || '',
      image: w.image || '',
      author: w.author || '',
      title: w.title || '',
      stance: w.stance || ''
    }))
    .sort((a,b) => a.year - b.year);

  // Compute bounds
  const minEraStart = Math.min(...ERAS.map(e => e.start));
  const maxEraEnd   = Math.max(...ERAS.map(e => e.end));
  const minMil      = MILESTONES.length ? Math.min(...MILESTONES.map(m => m.year)) : minEraStart;
  const maxMil      = MILESTONES.length ? Math.max(...MILESTONES.map(m => m.year)) : maxEraEnd;

  const MIN_YEAR = Math.min(minEraStart, minMil);
  const MAX_YEAR = Math.max(maxEraEnd, maxMil);

  // Helpers
  const clamp01 = t => Math.max(0, Math.min(1, t));
  const lerp    = (a,b,t)=> a + (b-a)*t;
  const norm    = (x,a,b)=> (x-a)/(b-a);
  const posFromYear = y => clamp01(norm(y, MIN_YEAR, MAX_YEAR));
  const yearFromPos = p => lerp(MIN_YEAR, MAX_YEAR, p);
  const ease    = t => (t<.5)?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
  const fmtYear = y => (y <= 0 ? `${Math.abs(Math.round(y))} BC` : `${Math.round(y)} AD`);

  // Map any year → era index
  function eraIndexFromYear(y) {
    for (let k = 0; k < ERAS.length; k++) {
      const e = ERAS[k];
      if (y >= e.start && y < e.end) return k;
    }
    return (y >= ERAS[ERAS.length - 1].end) ? ERAS.length - 1 : 0;
  }

  // Ensure the content panes match number of ERAS
  syncPanesToEras(trackEl, ERAS);

  // After syncing, get fresh pane refs
  const panes = Array.from(trackEl.querySelectorAll('.era-pane'));
  trackEl.style.setProperty('--count', String(ERAS.length));

  // Populate era titles + content paragraphs from milestones (no bullet lists)
  populateEraContent(panes, ERAS, MILESTONES);

  // Render milestone ticks
  renderTicks(tlTrack, MILESTONES, posFromYear);

  // State
  let i = 0; // current era index
  let pos = posFromYear(ERAS[0].anchor);
  let animRAF = null;
  let dragging = false;

  // a11y slider range
  tlThumb.setAttribute('aria-valuemin', '0');
  tlThumb.setAttribute('aria-valuemax', String(ERAS.length - 1));

  // Height sync to active pane
  const setHeight = () => { viewport.style.height = panes[i].scrollHeight + 'px'; };
  const ro = new ResizeObserver(setHeight);
  panes.forEach(p => ro.observe(p));
  window.addEventListener('resize', setHeight);

  // Rendering
  function renderPosition(p) {
    const pct = (p * 100) + '%';
    tlFill.style.width = pct;
    tlThumb.style.left = pct;
    tlYear.style.left  = pct;

    const y = yearFromPos(p);
    tlYear.textContent = fmtYear(y);

    const idx = eraIndexFromYear(y);
    eraBanner.textContent = ERAS[idx].label;

    tlThumb.setAttribute('aria-valuenow', String(idx));
    tlThumb.setAttribute('aria-valuetext', `${ERAS[idx].label} — ${fmtYear(y)}`);
  }

  function setEraByYear(y) {
    const idx = eraIndexFromYear(y);
    if (idx !== i) {
      i = idx;
      trackEl.style.transform = `translateX(${-100 * i}%)`;
      panes[i]?.scrollTo?.({ top: 0, behavior: 'auto' });
      setHeight();
    }
  }

  function goToYear(targetYear, animate) {
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

  // Interactions
  tlTrack.addEventListener('click', e => {
    // ticks handle their own click
    if (e.target && e.target.classList && e.target.classList.contains('tick')) return;
    const r = tlTrack.getBoundingClientRect();
    const p = clamp01((e.clientX - r.left) / r.width);
    goToYear(yearFromPos(p), true);
  });

  tlThumb.addEventListener('pointerdown', e => {
    dragging = true;
    timeline.classList.add('is-dragging');
    tlThumb.setPointerCapture?.(e.pointerId);
    cancelAnimationFrame(animRAF);
    e.preventDefault();
  });
  window.addEventListener('pointermove', e => {
    if (!dragging) return;
    const r = tlTrack.getBoundingClientRect();
    pos = clamp01((e.clientX - r.left) / r.width);
    renderPosition(pos);
    setEraByYear(yearFromPos(pos));
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    timeline.classList.remove('is-dragging');
    goToYear(yearFromPos(pos), true);
  };
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  // Keyboard: step through primary milestones
  tlThumb.addEventListener('keydown', e => {
    const currentYear = Math.round(yearFromPos(pos));
    const primaryYears = MILESTONES
      .filter(m => m.primary)
      .map(m => m.year)
      .sort((a,b) => a - b);

    const nearestIndex = (() => {
      let idx = primaryYears.findIndex(y => y >= currentYear);
      if (idx === -1) idx = primaryYears.length - 1;
      return idx;
    })();

    if (e.key === 'ArrowRight') {
      const next = Math.min(primaryYears.length - 1, nearestIndex + 1);
      goToYear(primaryYears[next], true);
      e.preventDefault();
    }
    if (e.key === 'ArrowLeft') {
      const prev = Math.max(0, nearestIndex - 1);
      goToYear(primaryYears[prev], true);
      e.preventDefault();
    }
    if (e.key === 'Home') { goToYear(ERAS[0].start, true); e.preventDefault(); }
    if (e.key === 'End')  { goToYear(ERAS[ERAS.length - 1].end, true); e.preventDefault(); }
  });

  // Init
  const initYear = ERAS[0].anchor ?? ERAS[0].start;
  setEraByYear(initYear);
  pos = posFromYear(initYear);
  renderPosition(pos);
  setHeight();

  // Make tick buttons functional AFTER init
  tlTrack.querySelectorAll('.tick').forEach(btn => {
    const y = Number(btn.getAttribute('data-year'));
    btn.addEventListener('click', () => goToYear(y, true));
  });
}

/* ---------------- Helpers ---------------- */

/** Ensure the .era-track has one .era-pane per era in order; create/remove as needed. */
function syncPanesToEras(trackEl, ERAS) {
  let panes = Array.from(trackEl.querySelectorAll('.era-pane'));
  const diff = ERAS.length - panes.length;

  if (diff > 0) {
    // Need more panes
    const last = panes[panes.length - 1] || null;
    for (let n = 0; n < diff; n++) {
      const pane = document.createElement('section');
      pane.className = 'era-pane';
      pane.setAttribute('role', 'region');
      pane.innerHTML = `
        <h3 class="era-title">Loading…</h3>
        <div class="era-content" aria-busy="true"></div>
      `;
      trackEl.appendChild(pane);
    }
  } else if (diff < 0) {
    // Too many panes
    for (let n = 0; n < Math.abs(diff); n++) {
      const p = trackEl.lastElementChild;
      if (p && p.classList.contains('era-pane')) p.remove();
    }
  }

  // Final pass: set ids/labels for a11y
  panes = Array.from(trackEl.querySelectorAll('.era-pane'));
  panes.forEach((pane, idx) => {
    pane.id = `pane-${idx}`;
    pane.setAttribute('aria-label', `Era ${idx + 1}`);
    const h3 = pane.querySelector('.era-title') || pane.querySelector('h3') || document.createElement('h3');
    if (!h3.classList.contains('era-title')) h3.classList.add('era-title');
    if (!pane.contains(h3)) pane.prepend(h3);
    let content = pane.querySelector('.era-content');
    if (!content) {
      content = document.createElement('div');
      content.className = 'era-content';
      pane.appendChild(content);
    }
  });
}

/** Populate each era pane:
 *  - Set title to the era label
 *  - Inject 1–2 paragraph blocks summarizing its milestones (no bullet lists)
 */
function populateEraContent(panes, ERAS, MILESTONES) {
  panes.forEach((pane, idx) => {
    const era = ERAS[idx];
    const titleEl = pane.querySelector('.era-title');
    const contentEl = pane.querySelector('.era-content');

    if (titleEl) titleEl.textContent = era.label;
    if (!contentEl) return;

    // Filter milestones belonging to this era by matching era ID
    const inEra = MILESTONES.filter(m => {
      // Find the era that corresponds to this pane index
      const eraForMilestone = ERAS.find(e => e.id === idx);
      return m.era_label === era.label || (m.year >= era.start && m.year < era.end);
    }).sort((a,b) => a.year - b.year);

    // Build paragraph(s), not lists
    contentEl.innerHTML = '';
    if (!inEra.length) {
      const p = document.createElement('p');
      p.textContent = `No milestones recorded for ${era.label} yet.`;
      contentEl.appendChild(p);
      return;
    }

    // Long eras: split into a couple of paragraphs for readability
    const chunkSize = Math.ceil(inEra.length / Math.min(2, Math.ceil(inEra.length / 10) || 1));
    for (let c = 0; c < inEra.length; c += chunkSize) {
      const slice = inEra.slice(c, c + chunkSize);
      const p = document.createElement('p');

      // Compose "Year — Author: Title" segments separated by " · "
      const segs = slice.map(m => {
        const label = m.url ? `<a href="${escapeAttr(m.url)}" target="_blank" rel="noopener">${escapeHtml(m.author)}: ${escapeHtml(m.title)}</a>` : `${escapeHtml(m.author)}: ${escapeHtml(m.title)}`;
        return `${m.year} — ${label}`;
      });

      p.innerHTML = segs.join(' · ');
      contentEl.appendChild(p);
    }
  });
}

/** Create tick marks on the rail. Primary ticks get year labels. */
function renderTicks(tlTrack, MILESTONES, posFromYear) {
  // Avoid double-render
  if (tlTrack.querySelector('.tick')) {
    tlTrack.querySelectorAll('.tick, .tick-label').forEach(n => n.remove());
  }

  const frag = document.createDocumentFragment();

  MILESTONES.forEach(m => {
    const leftPct = (posFromYear(m.year) * 100) + '%';

    // Tick button
    const tick = document.createElement('button');
    tick.type = 'button';
    tick.className = 'tick' + (m.primary ? ' primary' : '');
    tick.style.left = leftPct;
    tick.setAttribute('title', `${m.year} — ${m.author}: ${m.title}`);
    tick.setAttribute('aria-label', `${m.year}: ${m.author}: ${m.title}`);
    tick.setAttribute('data-year', String(m.year));
    frag.appendChild(tick);

    // Year label under rail for primary ticks
    if (m.primary) {
      const lbl = document.createElement('div');
      lbl.className = 'tick-label';
      lbl.textContent = String(m.year);
      lbl.style.left = leftPct;
      frag.appendChild(lbl);
    }
  });

  tlTrack.appendChild(frag);
}

/* ---------------- Small utils ---------------- */

function escapeHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}
