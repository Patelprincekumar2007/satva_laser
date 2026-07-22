/* ═══════════════════════════════════════════════════════
   SATVA LASER — Canvas Image Sequence (GSAP ScrollTrigger)
   ═══════════════════════════════════════════════════════ */

export function initCanvasSequence() {
  const section = document.querySelector('.canvas-sequence-section');
  const canvas = document.getElementById('sequenceCanvas');
  if (!section || !canvas || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const ctx = canvas.getContext('2d');
  const TOTAL_FRAMES = 357;
  const images = [];
  let loaded = 0;
  let currentFrame = 0;

  const preloaderEl = document.querySelector('.canvas-preloader');
  const preloaderFill = document.querySelector('.canvas-preloader-fill');

  // Build frame URL (frame_0001.jpg ... frame_0357.jpg)
  function frameSrc(i) {
    const num = String(i + 1).padStart(4, '0');
    return `/frames/frame_${num}.jpg`;
  }

  // Resize canvas to match container
  function resizeCanvas() {
    const container = canvas.parentElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = container.clientWidth * dpr;
    canvas.height = container.clientHeight * dpr;
    canvas.style.width = container.clientWidth + 'px';
    canvas.style.height = container.clientHeight + 'px';
    ctx.scale(dpr, dpr);
    drawFrame(currentFrame);
  }

  // Draw a frame with cover-fit and 5% zoom to crop out corner watermark
  function drawFrame(index) {
    const img = images[index];
    if (!img || !img.complete) return;

    const cw = canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
    const ch = canvas.height / (Math.min(window.devicePixelRatio || 1, 2));

    ctx.clearRect(0, 0, cw, ch);

    // Cover fit calculations
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = cw / ch;
    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

    if (imgRatio > canvasRatio) {
      sw = img.naturalHeight * canvasRatio;
      sx = (img.naturalWidth - sw) / 2;
    } else {
      sh = img.naturalWidth / canvasRatio;
      sy = (img.naturalHeight - sh) / 2;
    }

    // Crop edges (zoom in by 9%) to hide the watermark in the bottom-right corner
    const cropScale = 0.91;
    const zoomedSw = sw * cropScale;
    const zoomedSh = sh * cropScale;
    const zoomedSx = sx + (sw - zoomedSw) * 0.45; // center-ish horizontally
    const zoomedSy = sy + (sh - zoomedSh) * 0.3;  // push crop area up to cut bottom watermark

    ctx.drawImage(img, zoomedSx, zoomedSy, zoomedSw, zoomedSh, 0, 0, cw, ch);
  }

  // Preload all images
  function preload() {
    return new Promise((resolve) => {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = frameSrc(i);
        img.onload = () => {
          loaded++;
          if (preloaderFill) {
            preloaderFill.style.width = `${(loaded / TOTAL_FRAMES) * 100}%`;
          }
          if (i === 0) {
            resizeCanvas();
            drawFrame(0);
          }
          if (loaded >= TOTAL_FRAMES) {
            if (preloaderEl) preloaderEl.classList.add('loaded');
            resolve();
          }
        };
        img.onerror = () => {
          loaded++;
          if (loaded >= TOTAL_FRAMES) {
            if (preloaderEl) preloaderEl.classList.add('loaded');
            resolve();
          }
        };
        images[i] = img;
      }
    });
  }

  // Setup GSAP animation
  function setupAnimation() {
    const frameObj = { frame: 0 };

    gsap.to(frameObj, {
      frame: TOTAL_FRAMES - 1,
      snap: 'frame',
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
      },
      onUpdate() {
        const idx = Math.round(frameObj.frame);
        if (idx !== currentFrame) {
          currentFrame = idx;
          drawFrame(currentFrame);
        }
      }
    });

    // Animate individual HUD slides
    const slides = [
      { id: '#hud1', start: 0.05, peak: 0.15, end: 0.25 },
      { id: '#hud2', start: 0.30, peak: 0.40, end: 0.50 },
      { id: '#hud3', start: 0.58, peak: 0.68, end: 0.78 },
      { id: '#hud4', start: 0.84, peak: 0.90, end: 0.96 }
    ];

    slides.forEach(slide => {
      const el = document.querySelector(slide.id);
      if (!el) return;

      const left = el.querySelector('.hud-left');
      const right = el.querySelector('.hud-right');
      const center = el.querySelector('.hud-center');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        }
      });

      if (left && right) {
        // Slide 1, 2, 3: Side panels glide in & out with parallax
        tl.fromTo(left, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.08 }, slide.start)
          .fromTo(right, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.08 }, slide.start + 0.01)
          .to(left, { opacity: 0, x: -30, duration: 0.06 }, slide.peak + 0.05)
          .to(right, { opacity: 0, x: 30, duration: 0.06 }, slide.peak + 0.06);
      } else if (center) {
        // Slide 4: Center panel rises and fades
        tl.fromTo(center, { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.08 }, slide.start)
          .to(center, { opacity: 0, y: -20, scale: 0.98, duration: 0.06 }, slide.peak + 0.05);
      }
    });

    // Setup micro-float for HUD cards (gentle loop)
    document.querySelectorAll('.hud-card, .floating-finishes').forEach(card => {
      gsap.to(card, {
        y: -6,
        duration: 2.5 + Math.random() * 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    });
  }

  // Init
  window.addEventListener('resize', () => resizeCanvas());

  preload().then(() => {
    setupAnimation();
    ScrollTrigger.refresh();
  });
}
