/* ═══════════════════════════════════════════
   Kong Seng Kit — Portfolio interactions
   ═══════════════════════════════════════════ */
'use strict';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Mobile menu ── */
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const toggle = document.querySelector('.nav-toggle');
  const isOpen = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  const toggle = document.querySelector('.nav-toggle');
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
}

/* ── Scroll progress ── */
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.width = (window.scrollY / docHeight * 100) + '%';
}, { passive: true });

/* ── Typing animation ── */
const typedTexts = [
  'Assistant Content Marketing Manager',
  'SEO & Content Strategist',
  'AI Content Systems Builder',
  'Financial Markets Content Specialist'
];
const typedEl = document.getElementById('typedText');
if (typedEl && !prefersReducedMotion) {
  let typedIndex = 0, charIndex = typedTexts[0].length, isDeleting = true;
  let started = false;
  setTimeout(() => { started = true; typeNext(); }, 2400);
  function typeNext() {
    if (!started) return;
    const current = typedTexts[typedIndex];
    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }
    let delay = isDeleting ? 40 : 70;
    if (!isDeleting && charIndex === current.length) { delay = 2600; isDeleting = true; }
    else if (isDeleting && charIndex === 0) { isDeleting = false; typedIndex = (typedIndex + 1) % typedTexts.length; delay = 350; }
    setTimeout(typeNext, delay);
  }
}

/* ══════════════════════════════════════════
   GROWTH CHART — APAC regional Academy
   Weekly averages of daily Google Search Console
   data (BigQuery, searchconsole_enriched), Sun–Sat
   weeks from 29 Mar to 10 Oct 2026. Scope: /academy/
   on the 10 APAC sites (EN, VI, TH, HANT, HANS, MS,
   ID, KO, ZA, APAC regional); Japan excluded.
   ══════════════════════════════════════════ */
const CHART = (() => {
  const svg = document.getElementById('growthChart');
  if (!svg) return null;

  const weeks = [];
  for (let i = 0; i < 28; i++) weeks.push(new Date(2026, 2, 29 + i * 7));
  const dayFmt = d => d.getDate() + ' ' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
  const fmt = d => {
    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 6);
    return 'Week of ' + dayFmt(d) + ' – ' + dayFmt(end) + ' ' + end.getFullYear();
  };

  const fmtInt = v => Math.round(v).toLocaleString('en-GB');
  const fmtK = v => (Number.isInteger(v) ? v : v.toFixed(1)) + 'K';
  const fmtPos = v => v.toFixed(1);
  const series = {
    clicks: {
      name: 'Clicks / day', color: '#1a6cf0',
      title: 'Organic clicks per day (weekly average)', lowerIsBetter: false, fromZero: true, format: fmtInt,
      data: [443,405,475,484,486,478,651,647,504,525,474,500,517,597,
             657,679,669,677,713,758,891,867,961,935,942,913,916,908]
    },
    impressions: {
      name: 'Impressions / day', color: '#b45309',
      title: 'Search impressions per day (weekly average)', lowerIsBetter: false, fromZero: true, format: fmtK,
      data: [111.0,97.8,107.2,103.2,113.4,120.4,151.5,131.6,103.5,103.5,96.5,95.6,101.2,110.2,
             108.5,115.8,104.9,113.7,131.3,165.1,153.8,143.4,143.6,149.8,160.3,118.3,116.7,121.0]
    },
    position: {
      name: 'Avg. position', color: '#15803d',
      title: 'Average search position (lower is better)', lowerIsBetter: true, fromZero: false, format: fmtPos,
      data: [8.2,7.9,8.6,10.0,10.7,10.9,10.2,11.1,11.2,10.3,11.0,11.7,12.4,11.5,
             11.4,10.9,11.0,11.7,11.6,12.2,12.7,13.8,11.9,10.6,9.6,9.8,10.0,10.3]
    }
  };
  // Share of clicks from non-branded queries (anonymised queries counted as non-branded)
  const nonBranded = [96.4,95.6,95.6,96.9,96.5,97.0,97.3,97.0,96.8,96.7,96.1,93.4,96.4,96.9,
                      97.7,96.8,96.8,95.9,97.0,96.9,97.1,96.8,97.2,97.8,98.0,97.9,97.8,98.0];
  // The doubling quoted in the hero: week of 12 Apr → week of 30 Aug
  const doubling = { from: 2, to: 22 };

  const W = 800, H = 340, M = { top: 34, right: 30, bottom: 34, left: 52 };
  const plotW = W - M.left - M.right, plotH = H - M.top - M.bottom;
  const N = weeks.length;
  const x = i => M.left + (i / (N - 1)) * plotW;

  let activeMetric = 'clicks';
  let activeIndex = null;

  const tooltip = document.getElementById('chartTooltip');
  const titleEl = document.getElementById('chartTitle');

  function niceTicks(min, max, count) {
    const span = max - min;
    const step = Math.pow(10, Math.floor(Math.log10(span / count)));
    const candidates = [step, step * 2, step * 5, step * 10];
    const chosen = candidates.find(s => span / s <= count) || step * 10;
    const ticks = [];
    for (let v = Math.ceil(min / chosen) * chosen; v <= max + 1e-9; v += chosen) ticks.push(+v.toFixed(6));
    return ticks;
  }

  function domainFor(s) {
    const vals = s.data;
    let lo = Math.min(...vals), hi = Math.max(...vals);
    const pad = (hi - lo) * 0.12;
    return [s.fromZero ? 0 : Math.max(0, lo - pad), hi + pad];
  }
  function scaleFor(s) {
    const [lo, hi] = domainFor(s);
    return v => s.lowerIsBetter
      ? M.top + ((v - lo) / (hi - lo)) * plotH          // inverted: low values (better) at top
      : M.top + plotH - ((v - lo) / (hi - lo)) * plotH;
  }

  function render() {
    const s = series[activeMetric];
    const vals = s.data;
    const y = scaleFor(s);
    const ticks = niceTicks(...domainFor(s), 5);
    const NS = 'http://www.w3.org/2000/svg';
    const el = (tag, attrs, text) => {
      const node = document.createElementNS(NS, tag);
      for (const k in attrs) node.setAttribute(k, attrs[k]);
      if (text != null) node.textContent = text;
      return node;
    };
    svg.textContent = '';

    // Doubling band + label (clicks view only)
    if (activeMetric === 'clicks') {
      const x0 = x(doubling.from), x1 = x(doubling.to);
      svg.appendChild(el('rect', { x: x0, y: M.top - 6, width: x1 - x0, height: plotH + 6, fill: 'rgba(26,108,240,0.05)' }));
      svg.appendChild(el('text', {
        x: (x0 + x1) / 2, y: M.top - 14, 'text-anchor': 'middle',
        'font-size': 11, 'font-weight': 600, fill: '#46536b', 'font-family': 'inherit'
      }, 'Clicks per day doubled in under five months'));
    }

    // Gridlines + y ticks (solid hairlines)
    ticks.forEach(t => {
      svg.appendChild(el('line', { x1: M.left, x2: W - M.right, y1: y(t), y2: y(t), stroke: '#edf1f6', 'stroke-width': 1 }));
      svg.appendChild(el('text', { x: M.left - 8, y: y(t) + 3.5, 'text-anchor': 'end', 'font-size': 10.5, fill: '#46536b', 'font-family': 'inherit' }, s.lowerIsBetter ? String(t) : s.format(t)));
    });

    // X ticks: first week starting in each month (the partial first month is skipped)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let firstTick = true;
    weeks.forEach((d, i) => {
      if (i === 0 || d.getMonth() === weeks[i - 1].getMonth()) return;
      svg.appendChild(el('text', {
        x: x(i), y: H - 10, 'text-anchor': 'middle', 'font-size': 10.5, fill: '#46536b', 'font-family': 'inherit'
      }, monthNames[d.getMonth()] + (firstTick || d.getMonth() === 0 ? ' ' + d.getFullYear() : '')));
      firstTick = false;
      svg.appendChild(el('line', { x1: x(i), x2: x(i), y1: M.top + plotH, y2: M.top + plotH + 4, stroke: '#cbd5e1', 'stroke-width': 1 }));
    });

    // Area wash
    const lineD = vals.map((v, i) => (i === 0 ? 'M' : 'L') + x(i).toFixed(1) + ' ' + y(v).toFixed(1)).join(' ');
    const areaD = lineD + ` L ${x(N - 1).toFixed(1)} ${M.top + plotH} L ${x(0).toFixed(1)} ${M.top + plotH} Z`;
    svg.appendChild(el('path', { d: areaD, fill: s.color, opacity: 0.08 }));

    // Line (2px, round)
    const path = el('path', { d: lineD, fill: 'none', stroke: s.color, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    svg.appendChild(path);
    if (!prefersReducedMotion) {
      const len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      path.getBoundingClientRect();
      path.style.transition = 'stroke-dashoffset 0.9s ease';
      path.style.strokeDashoffset = '0';
    }

    // Endpoint marker (8px, 2px surface ring)
    const last = N - 1;
    svg.appendChild(el('circle', { cx: x(last), cy: y(vals[last]), r: 4, fill: s.color, stroke: '#ffffff', 'stroke-width': 2 }));

    // Direct labels: the doubling endpoints on clicks, the best week elsewhere
    const labelled = activeMetric === 'clicks'
      ? [doubling.from, doubling.to]
      : [s.lowerIsBetter ? vals.indexOf(Math.min(...vals)) : vals.indexOf(Math.max(...vals))];
    labelled.forEach(i => {
      if (activeMetric === 'clicks') {
        svg.appendChild(el('circle', { cx: x(i), cy: y(vals[i]), r: 4, fill: s.color, stroke: '#ffffff', 'stroke-width': 2 }));
      }
      svg.appendChild(el('text', {
        x: Math.max(M.left + 16, Math.min(x(i), W - M.right - 16)), y: y(vals[i]) + (s.lowerIsBetter ? -9 : -10),
        'text-anchor': 'middle', 'font-size': 12, 'font-weight': 600, fill: '#0a1628', 'font-family': 'inherit'
      }, s.format(vals[i]) + (activeMetric === 'clicks' ? '/day' : '')));
    });

    // Crosshair + focus dot (hidden until hover/focus)
    svg.appendChild(el('line', { id: 'crosshair', x1: 0, x2: 0, y1: M.top, y2: M.top + plotH, stroke: '#94a3b8', 'stroke-width': 1, opacity: 0 }));
    svg.appendChild(el('circle', { id: 'focusDot', r: 5, fill: s.color, stroke: '#ffffff', 'stroke-width': 2, opacity: 0 }));

    titleEl.textContent = s.title;
    if (activeIndex != null) showIndex(activeIndex);
  }

  function showIndex(i) {
    activeIndex = Math.max(0, Math.min(N - 1, i));
    const s = series[activeMetric];
    const yv = scaleFor(s)(s.data[activeIndex]);
    const xv = x(activeIndex);

    const cross = svg.querySelector('#crosshair');
    const dot = svg.querySelector('#focusDot');
    cross.setAttribute('x1', xv); cross.setAttribute('x2', xv); cross.setAttribute('opacity', 1);
    dot.setAttribute('cx', xv); dot.setAttribute('cy', yv); dot.setAttribute('opacity', 1);

    // Tooltip: values lead, every series listed, line keys
    tooltip.textContent = '';
    const dateEl = document.createElement('div');
    dateEl.className = 'tt-date';
    dateEl.textContent = fmt(weeks[activeIndex]);
    tooltip.appendChild(dateEl);
    const addRow = (color, value, label) => {
      const row = document.createElement('div');
      row.className = 'tt-row';
      const swatch = document.createElement('span');
      swatch.className = 'tt-key';
      swatch.style.background = color;
      const val = document.createElement('span');
      val.className = 'tt-val';
      val.textContent = value;
      const name = document.createElement('span');
      name.className = 'tt-name';
      name.textContent = label;
      row.append(swatch, val, name);
      tooltip.appendChild(row);
    };
    Object.keys(series).forEach(key => {
      const sr = series[key];
      addRow(sr.color, sr.format(sr.data[activeIndex]), sr.name);
    });
    addRow('transparent', nonBranded[activeIndex].toFixed(1) + '%', 'non-branded clicks');

    // Position tooltip within wrap (clamped so it never overflows the page)
    const rect = svg.getBoundingClientRect();
    const scale = rect.width / W;
    const anchor = xv * scale;
    const ttW = tooltip.offsetWidth;
    const flip = anchor + 14 + ttW > rect.width;
    let left = flip ? anchor - ttW - 14 : anchor + 14;
    left = Math.max(4, Math.min(left, rect.width - ttW - 4));
    tooltip.style.left = left + 'px';
    tooltip.style.top = Math.max(0, (M.top + 8) * scale) + 'px';
    tooltip.classList.add('visible');
  }

  function hide() {
    activeIndex = null;
    tooltip.classList.remove('visible');
    const cross = svg.querySelector('#crosshair');
    const dot = svg.querySelector('#focusDot');
    if (cross) cross.setAttribute('opacity', 0);
    if (dot) dot.setAttribute('opacity', 0);
  }

  svg.addEventListener('pointermove', e => {
    const rect = svg.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width * W;
    showIndex(Math.round((px - M.left) / plotW * (N - 1)));
  });
  svg.addEventListener('pointerleave', hide);
  svg.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); showIndex(activeIndex == null ? 0 : activeIndex + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); showIndex(activeIndex == null ? N - 1 : activeIndex - 1); }
    else if (e.key === 'Home') { e.preventDefault(); showIndex(0); }
    else if (e.key === 'End') { e.preventDefault(); showIndex(N - 1); }
    else if (e.key === 'Escape') hide();
  });
  svg.addEventListener('blur', hide);

  // Metric tabs
  document.querySelectorAll('.chart-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.chart-tab').forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      activeMetric = btn.dataset.metric;
      render();
    });
  });

  window.addEventListener('resize', hide, { passive: true });
  render();
  return { render };
})();

/* ── Sample filters ── */
const filterBtns = document.querySelectorAll('.filter-btn');
function applyFilter(cat) {
  filterBtns.forEach(b => b.setAttribute('aria-pressed', b.dataset.filter === cat ? 'true' : 'false'));
  document.querySelectorAll('.article-card').forEach(card => {
    const show = cat === 'all' || card.dataset.category === cat;
    card.classList.toggle('hidden-card', !show);
  });
}
filterBtns.forEach(btn => btn.addEventListener('click', () => applyFilter(btn.dataset.filter)));

/* ── Content recommender quiz ── */
const quizSteps = [
  { label: 'Question 1 of 3', question: 'Who are you?', options: ['Recruiter / Hiring Manager', 'Content Lead / Editor', 'Client or Brand'] },
  { label: 'Question 2 of 3', question: 'What interests you most?', options: ['Market events & macro', 'Trading education', 'Content strategy & production'] },
  { label: 'Question 3 of 3', question: 'Preferred format?', options: ['Long-form deep dive', 'Quick visual', 'Research report'] }
];
const quizRecommend = ([who, topic, format]) => {
  if (format === 1) return { id: 'sample-infographic', title: '5 Key Market Events — Infographic', reason: 'you prefer quick, visual content' };
  if (format === 2) return { id: 'sample-election', title: 'US Election-Year Market Insights Report', reason: 'you want research-driven report work' };
  if (topic === 0 && format === 0) return { id: 'sample-hormuz', title: 'Strait of Hormuz and Oil Volatility', reason: 'you want to see live market event coverage' };
  if (topic === 0) return { id: 'sample-2025events', title: '5 Key Market Events That Shaped Global Markets in 2025', reason: 'you want broad macro market analysis' };
  if (topic === 1 && format === 0) return { id: 'sample-crypto', title: 'A Guide to Cryptocurrency', reason: 'you want in-depth trading education content' };
  if (topic === 1) return { id: 'sample-earnings', title: 'How to Trade During US Earnings Season', reason: "you're interested in trading strategy content" };
  return { id: 'sample-newsletter', title: 'Monthly Market Insights Newsletter', reason: 'you want to see editorial and production work' };
};
let quizAnswers = [], currentStep = 0;
const quizContainer = document.getElementById('quizContainer');

function renderQuiz() {
  const step = quizSteps[currentStep];
  const dots = quizSteps.map((_, i) => `<div class="quiz-step-dot ${i < currentStep ? 'done' : ''}"></div>`).join('');
  quizContainer.innerHTML = `
    <div class="quiz-progress">${dots}</div>
    <div class="quiz-q-label">${step.label}</div>
    <div class="quiz-question">${step.question}</div>
    <div class="quiz-options">${step.options.map((o, i) => `<button class="quiz-option" onclick="pickQuiz(${i})">${o}</button>`).join('')}</div>`;
}
function pickQuiz(i) {
  quizAnswers[currentStep] = i;
  currentStep++;
  if (currentStep < quizSteps.length) { renderQuiz(); return; }
  const rec = quizRecommend(quizAnswers);
  const dots = quizSteps.map(() => `<div class="quiz-step-dot done"></div>`).join('');
  quizContainer.innerHTML = `
    <div class="quiz-progress">${dots}</div>
    <div class="quiz-result">
      <div class="quiz-result-eyebrow">Recommended for you</div>
      <div class="quiz-result-title"></div>
      <div class="quiz-result-reason"></div>
      <button class="quiz-jump" data-target="${rec.id}">Jump to this sample ↓</button>
    </div>
    <button class="quiz-reset" onclick="resetQuiz()">← Start over</button>`;
  quizContainer.querySelector('.quiz-result-title').textContent = rec.title;
  quizContainer.querySelector('.quiz-result-reason').textContent = `Based on your answers — because ${rec.reason}.`;
  quizContainer.querySelector('.quiz-jump').addEventListener('click', () => jumpToCard(rec.id));
}
function jumpToCard(id) {
  applyFilter('all');
  const target = document.getElementById(id);
  if (!target) return;
  document.querySelectorAll('.article-card').forEach(c => c.classList.remove('highlighted'));
  target.classList.add('highlighted');
  target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
  setTimeout(() => target.classList.remove('highlighted'), 3500);
}
function resetQuiz() { quizAnswers = []; currentStep = 0; renderQuiz(); }
if (quizContainer) renderQuiz();

/* ── Scrollspy ── */
const spySections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const spyObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
spySections.forEach(s => spyObserver.observe(s));

/* ── Fade-in on scroll ── */
if (!prefersReducedMotion) {
  document.querySelectorAll('.timeline-item, .article-card, .system-card, .highlight-card, .skills-grid > div, .stat-item').forEach(el => {
    el.classList.add('fade-in');
    const group = el.closest('.stats-bar-inner, .article-grid, .skills-grid, .systems-grid, .results-highlights');
    if (group) {
      const siblings = Array.from(group.children);
      el.style.transitionDelay = (siblings.indexOf(el) * 0.07) + 's';
    }
  });
  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); fadeObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));
}

/* ── Stat counters ── */
const statNums = document.querySelectorAll('.stat-num[data-count]');
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    const useComma = el.dataset.format === 'comma';
    const formatVal = v => (useComma ? Math.floor(v).toLocaleString() : v.toFixed(decimals)) + suffix;
    if (prefersReducedMotion) { el.textContent = formatVal(target); statsObserver.unobserve(el); return; }
    let startTime = null;
    const duration = 1400;
    const step = timestamp => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatVal(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    statsObserver.unobserve(el);
  });
}, { threshold: 0.6 });
statNums.forEach(el => statsObserver.observe(el));

/* ── Back to top ── */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' }));
