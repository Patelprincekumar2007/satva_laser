/* ═══════════════════════════════════════════════════════
   SATVA LASER — Loader + Page Transitions (Cinematic)
   ═══════════════════════════════════════════════════════ */

const MARK_PATH = 'M100 8 L192 100 L100 192 L8 100 Z M100 54 L146 100 L100 146 L54 100 Z';

/* Rendered-to-viewBox scale so path coordinates (viewBox 0 0 200 200)
   map onto the actual pixel size of the mark. Without this the spark
   traces a 200px diamond over a smaller rendered logo and drifts off. */
function markScale(svg, viewBoxSize = 200) {
  const rect = svg.getBoundingClientRect();
  const size = rect.width || viewBoxSize;
  return size / viewBoxSize;
}

export function runLoader(onDone) {
  const gsapReady = typeof gsap !== 'undefined';
  const loader = document.getElementById('loader');
  const svg = document.querySelector('.loader-mark');
  const path = document.getElementById('loaderPath');
  const spark = document.getElementById('loaderSpark');
  const pctEl = document.getElementById('loaderPct');
  const word = document.querySelector('.loader-word');
  const tagline = document.querySelector('.loader-tagline');
  const sub = document.querySelector('.loader-sub');
  const panelL = document.querySelector('.loader-panel.left');
  const panelR = document.querySelector('.loader-panel.right');
  const progressFill = document.querySelector('.loader-progress-fill');
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  if (!loader || !gsapReady) {
    if (loader) loader.style.display = 'none';
    document.documentElement.classList.remove('loading');
    onDone();
    return;
  }

  if (reduced) {
    gsap.to(loader, { opacity: 0, duration: 0.4, onComplete() {
      loader.style.display = 'none';
      document.documentElement.classList.remove('loading');
      onDone();
    }});
    return;
  }

  const isHomepage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
  const hasVisited = sessionStorage.getItem('satva_visited');
  sessionStorage.setItem('satva_visited', 'true');

  if (!isHomepage || hasVisited) {
    // Sub-pages or repeat visits: quick split-panel reveal only
    gsap.set(progressFill, { width: '100%' });
    gsap.set(word, { opacity: 1 });
    gsap.set(sub, { opacity: 1 });
    if (tagline) gsap.set(tagline, { opacity: 1, width: 'auto', borderRight: 'none' });
    gsap.set(path, { strokeDashoffset: 0 });

    const exit = gsap.timeline({
      onComplete() {
        loader.style.display = 'none';
        document.documentElement.classList.remove('loading');
        onDone();
      }
    });

    exit.to('.loader-inner', { opacity: 0, y: -20, duration: 0.2, ease: 'power2.in', delay: 0.1 });
    exit.to('.loader-progress', { opacity: 0, duration: 0.15 }, 0.1);
    exit.to(panelL, { xPercent: -101, duration: 0.55, ease: 'power3.inOut' }, 0.2);
    exit.to(panelR, { xPercent: 101, duration: 0.55, ease: 'power3.inOut' }, 0.2);
    return;
  }

  // Create floating ember particles
  createParticles();

  // Path setup — align the dash animation with the mark geometry
  const len = path.getTotalLength();
  path.style.strokeDasharray = len;
  path.style.strokeDashoffset = len;
  let scale = markScale(svg);

  // Spark trail particles pool
  const trailParticles = [];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'spark-trail';
    document.querySelector('.loader-mark-wrap').appendChild(p);
    trailParticles.push(p);
  }
  let trailIndex = 0;

  const progress = { v: 0 };

  const tl = gsap.timeline({
    onComplete() {
      // Glow the split seam before opening
      panelL?.classList.add('glowing');
      panelR?.classList.add('glowing');

      const exit = gsap.timeline({
        onComplete() {
          loader.style.display = 'none';
          document.documentElement.classList.remove('loading');
          onDone();
        }
      });

      // Brief hold
      exit.to({}, { duration: 0.2 });

      // Fade inner content
      exit.to('.loader-inner', { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' }, 0.1);
      exit.to('.loader-progress', { opacity: 0, duration: 0.3 }, 0.1);

      // Subtle shake on completion
      exit.to('.loader-inner', {
        x: 3, duration: 0.05, yoyo: true, repeat: 5, ease: 'none'
      }, 0);

      // Split panels open
      exit.to(panelL, { xPercent: -101, duration: 0.9, ease: 'power3.inOut' }, 0.3);
      exit.to(panelR, { xPercent: 101, duration: 0.9, ease: 'power3.inOut' }, 0.3);

      // Fade particles
      exit.to('.loader-particle', { opacity: 0, duration: 0.4 }, 0.2);
    }
  });

  // Recompute scale once the mark has laid out (guards against fonts/layout shift)
  tl.add(() => { scale = markScale(svg); }, 0);

  // Phase 1: Spark appears + path draws
  tl.to(spark, { opacity: 1, duration: 0.2 }, 0);
  tl.to(path, { strokeDashoffset: 0, duration: 1.8, ease: 'power1.inOut' }, 0);
  tl.to(progress, {
    v: 1, duration: 1.8, ease: 'power1.inOut',
    onUpdate() {
      const pt = path.getPointAtLength(progress.v * len);
      gsap.set(spark, { x: pt.x * scale, y: pt.y * scale });
      pctEl.textContent = Math.round(progress.v * 100);

      // Progress bar
      if (progressFill) progressFill.style.width = `${progress.v * 100}%`;

      // Spark trail
      if (progress.v > 0.02) {
        const trail = trailParticles[trailIndex % trailParticles.length];
        trailIndex++;
        gsap.set(trail, { x: pt.x * scale, y: pt.y * scale, opacity: 0.8 });
        gsap.to(trail, {
          opacity: 0,
          scale: 0.3,
          duration: 0.6 + Math.random() * 0.4,
          ease: 'power2.out'
        });
      }
    }
  }, 0);

  // Phase 2: Spark fades
  tl.to(spark, { opacity: 0, duration: 0.3 }, 1.6);

  // Phase 3: Text reveals
  tl.to(word, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 1.3);
  tl.to(sub, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 1.5);

  // Tagline typewriter effect
  if (tagline) {
    tl.to(tagline, { opacity: 1, duration: 0.1 }, 1.7);
    tl.to(tagline, {
      width: 'auto',
      duration: 0.8,
      ease: 'steps(20)',
      onComplete() {
        tagline.style.borderRight = 'none';
      }
    }, 1.7);
  }

  // Hold so mark can be read
  tl.to({}, { duration: 0.4 });
}

function createParticles() {
  const container = document.getElementById('loader');
  if (!container) return;

  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = `loader-particle${Math.random() > 0.7 ? ' large' : ''}`;
    container.appendChild(p);

    const x = Math.random() * window.innerWidth;
    const startY = window.innerHeight + 20;

    gsap.set(p, { x, y: startY });
    gsap.to(p, {
      y: -20,
      x: `+=${(Math.random() - 0.5) * 100}`,
      opacity: 0.3 + Math.random() * 0.5,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
      repeat: -1,
      ease: 'none'
    });
  }
}

/* ═══════════════════════════════════════════════════════
   PAGE TRANSITIONS — reuse the loader's mark-draw language
   so navigating between pages feels like the same object.
   ═══════════════════════════════════════════════════════ */

let transitionEls = null;

function buildTransitionOverlay() {
  if (transitionEls) return transitionEls;

  const container = document.createElement('div');
  container.id = 'pageTransition';
  container.className = 'page-transition';
  container.innerHTML = `
    <div class="loader-panel left"></div>
    <div class="loader-panel right"></div>
    <div class="pt-mark-wrap">
      <svg class="pt-mark" viewBox="0 0 200 200"><path class="pt-path" d="${MARK_PATH}"/></svg>
      <div class="pt-spark"></div>
    </div>`;
  document.body.appendChild(container);

  transitionEls = {
    container,
    panelL: container.querySelector('.loader-panel.left'),
    panelR: container.querySelector('.loader-panel.right'),
    svg: container.querySelector('.pt-mark'),
    path: container.querySelector('.pt-path'),
    spark: container.querySelector('.pt-spark'),
  };
  return transitionEls;
}

function playPageTransition(href) {
  const { container, panelL, panelR, svg, path, spark } = buildTransitionOverlay();

  container.classList.add('active');

  const len = path.getTotalLength();
  const scale = markScale(svg);
  gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
  gsap.set(spark, { opacity: 0 });
  gsap.set('.pt-mark-wrap', { opacity: 0 });

  const progress = { v: 0 };
  const go = () => { window.location.href = href; };

  gsap.timeline({ onComplete: go })
    // Panels sweep in to cover the screen
    .fromTo(panelL, { xPercent: -101 }, { xPercent: 0, duration: 0.5, ease: 'power3.inOut' }, 0)
    .fromTo(panelR, { xPercent: 101 }, { xPercent: 0, duration: 0.5, ease: 'power3.inOut' }, 0)
    // Mark draws with a spark tracing the edge, aligned via scale
    .to('.pt-mark-wrap', { opacity: 1, duration: 0.25 }, 0.2)
    .to(spark, { opacity: 1, duration: 0.15 }, 0.25)
    .to(path, { strokeDashoffset: 0, duration: 0.6, ease: 'power1.inOut' }, 0.25)
    .to(progress, {
      v: 1, duration: 0.6, ease: 'power1.inOut',
      onUpdate() {
        const pt = path.getPointAtLength(progress.v * len);
        gsap.set(spark, { x: pt.x * scale, y: pt.y * scale });
      }
    }, 0.25)
    .to(spark, { opacity: 0, duration: 0.2 }, 0.8)
    // Brief hold on the finished mark before navigating
    .to({}, { duration: 0.15 });
}

export function initPageTransitions() {
  if (typeof gsap === 'undefined') return;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || !href.endsWith('.html') || href.startsWith('http') || href.includes('#')) return;

    // Same page? don't transition to yourself
    const current = window.location.pathname.split('/').pop() || 'index.html';
    if (href === current) return;

    link.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // let new-tab clicks through
      e.preventDefault();
      if (reduced) { window.location.href = href; return; }
      playPageTransition(href);
    });
  });
}
