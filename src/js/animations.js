/* ═══════════════════════════════════════════════════════
   SATVA LASER — GSAP Scroll Animations
   ═══════════════════════════════════════════════════════ */

export function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // ── Hero entrance (home page) ──
  const heroCopy = document.querySelector('.hero-copy');
  if (heroCopy) {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero-copy .eyebrow', { opacity: 0, y: 24, duration: 0.7 })
      .from('.hero-copy h1', { opacity: 0, y: 36, rotateX: 14, transformOrigin: 'left bottom', duration: 0.9 }, '-=0.45')
      .from('.hero-copy p.lead', { opacity: 0, y: 24, duration: 0.8 }, '-=0.5')
      .from('.hero-ctas > *', { opacity: 0, y: 18, duration: 0.6, stagger: 0.1 }, '-=0.45')
      .from('.stat-card', { opacity: 0, y: 26, rotateX: -16, transformOrigin: 'bottom', duration: 0.7, stagger: 0.1 }, '-=0.35')
      .from('.medallion', { opacity: 0, scale: 0.82, rotateY: 32, duration: 1.1, ease: 'power3.out' }, '-=0.9');
  }

  // ── Ray burst scroll rotation ──
  const rayBurst = document.getElementById('rayBurst');
  if (rayBurst) {
    gsap.to(rayBurst, {
      rotate: 70, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
    });
  }

  // ── Medallion scroll effects ──
  const medallionFrame = document.querySelector('.medallion .frame img');
  if (medallionFrame) {
    gsap.to(medallionFrame, {
      yPercent: 14, scale: 1.12, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
    });
  }

  const medallion = document.querySelector('.medallion');
  if (medallion) {
    gsap.to(medallion, {
      rotateY: -10, rotateX: 6, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
    });

    // Pointer tilt (desktop)
    if (window.matchMedia('(pointer:fine)').matches) {
      medallion.addEventListener('mousemove', (e) => {
        const r = medallion.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(medallion, { rotateY: px * 18, rotateX: -py * 18, duration: 0.5, ease: 'power2.out' });
      });
      medallion.addEventListener('mouseleave', () => {
        gsap.to(medallion, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' });
      });
    }
  }

  // ── Section headings — 3D rise ──
  gsap.utils.toArray('.section-head, .cta-section .eyebrow, .page-hero-content').forEach(head => {
    gsap.set(head, { opacity: 0, y: 46, rotateX: -14, transformOrigin: 'bottom center' });
    ScrollTrigger.create({
      trigger: head, start: 'top 85%',
      onEnter() { gsap.to(head, { opacity: 1, y: 0, rotateX: 0, duration: 1, ease: 'power3.out' }); }
    });
  });

  // ── Capability cards — swing-in ──
  gsap.utils.toArray('.cap-card').forEach((card, i) => {
    gsap.set(card, { opacity: 0, rotateY: -65, x: -50, transformOrigin: 'left center' });
    ScrollTrigger.create({
      trigger: card, start: 'top 88%',
      onEnter() { gsap.to(card, { opacity: 1, rotateY: 0, x: 0, duration: 0.95, delay: i * 0.1, ease: 'power3.out' }); }
    });
  });

  // ── Full-bleed banners — parallax ──
  gsap.utils.toArray('.full-bleed').forEach(banner => {
    const imgWrap = banner.querySelector('.fb-img-wrap');
    const content = banner.querySelector('.full-bleed-content');
    if (imgWrap) {
      gsap.fromTo(imgWrap, { yPercent: -6, rotateX: 6, scale: 1.1 }, {
        yPercent: 6, rotateX: 0, scale: 1.02, ease: 'none',
        scrollTrigger: { trigger: banner, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
      });
    }
    if (content) {
      gsap.set(content, { opacity: 0, y: 60, rotateX: 16, transformOrigin: 'bottom left' });
      ScrollTrigger.create({
        trigger: banner, start: 'top 65%',
        onEnter() { gsap.to(content, { opacity: 1, y: 0, rotateX: 0, duration: 1.1, ease: 'power3.out' }); }
      });
    }
  });

  // ── Finish section ──
  const finishCopy = document.querySelectorAll('.finish-copy');
  if (finishCopy.length) {
    gsap.set(finishCopy, { opacity: 0, y: 30 });
    ScrollTrigger.create({
      trigger: '.finish-grid', start: 'top 82%',
      onEnter() { gsap.to(finishCopy, { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out' }); }
    });
  }

  gsap.utils.toArray('.finish-photos img').forEach((img, i) => {
    gsap.set(img, { opacity: 0, scale: 1.18, rotateY: i % 2 ? -26 : 26 });
    ScrollTrigger.create({
      trigger: '.finish-photos', start: 'top 85%',
      onEnter() { gsap.to(img, { opacity: 1, scale: 1, rotateY: 0, duration: 1.1, delay: i * 0.12, ease: 'power3.out' }); }
    });
  });

  // ── Gallery items — tumble-in ──
  gsap.utils.toArray('.gal-item, .gallery-item').forEach((item, i) => {
    gsap.set(item, { opacity: 0, y: 70, rotateX: -45, transformOrigin: 'top center' });
    ScrollTrigger.create({
      trigger: item, start: 'top 92%',
      onEnter() { gsap.to(item, { opacity: 1, y: 0, rotateX: 0, duration: 0.85, delay: (i % 4) * 0.08, ease: 'power3.out' }); }
    });
  });

  // ── About photo ──
  const aboutPhoto = document.querySelector('.about-photo');
  if (aboutPhoto) {
    gsap.set(aboutPhoto, { opacity: 0, rotateY: -28, x: -70 });
    ScrollTrigger.create({
      trigger: '.about-grid', start: 'top 78%',
      onEnter() { gsap.to(aboutPhoto, { opacity: 1, rotateY: 0, x: 0, duration: 1.1, ease: 'power3.out' }); }
    });
  }

  const aboutCopyItems = document.querySelectorAll('.about-copy > *');
  if (aboutCopyItems.length) {
    gsap.set(aboutCopyItems, { opacity: 0, y: 26 });
    ScrollTrigger.create({
      trigger: '.about-copy', start: 'top 80%',
      onEnter() { gsap.to(aboutCopyItems, { opacity: 1, y: 0, duration: 0.85, stagger: 0.1, ease: 'power3.out' }); }
    });
  }

  // ── CTA section ──
  const ctaEls = document.querySelectorAll('.cta-section h2, .cta-section p, .cta-buttons');
  if (ctaEls.length) {
    gsap.set(ctaEls, { opacity: 0, y: 26 });
    ScrollTrigger.create({
      trigger: '.cta-section', start: 'top 68%',
      onEnter() { gsap.to(ctaEls, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' }); }
    });
  }

  // ── Contact cards ──
  gsap.utils.toArray('.contact-card').forEach((card, i) => {
    gsap.set(card, { opacity: 0, y: 40, rotateX: -22, transformOrigin: 'bottom' });
    ScrollTrigger.create({
      trigger: card, start: 'top 90%',
      onEnter() { gsap.to(card, { opacity: 1, y: 0, rotateX: 0, duration: 0.85, delay: i * 0.12, ease: 'power3.out' }); }
    });
  });

  // ── Product cards ──
  gsap.utils.toArray('.product-card').forEach((card, i) => {
    gsap.set(card, { opacity: 0, y: 50, rotateX: -20, transformOrigin: 'top center' });
    ScrollTrigger.create({
      trigger: card, start: 'top 90%',
      onEnter() { gsap.to(card, { opacity: 1, y: 0, rotateX: 0, duration: 0.8, delay: (i % 3) * 0.1, ease: 'power3.out' }); }
    });
  });

  // ── Service cards ──
  gsap.utils.toArray('.service-card').forEach((card, i) => {
    gsap.set(card, { opacity: 0, y: 60, scale: 0.95 });
    ScrollTrigger.create({
      trigger: card, start: 'top 88%',
      onEnter() { gsap.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.9, delay: i * 0.15, ease: 'power3.out' }); }
    });
  });

  // ── Process steps ──
  gsap.utils.toArray('.process-step, .workflow-step').forEach((step, i) => {
    gsap.set(step, { opacity: 0, y: 30 });
    ScrollTrigger.create({
      trigger: step, start: 'top 90%',
      onEnter() { gsap.to(step, { opacity: 1, y: 0, duration: 0.7, delay: i * 0.1, ease: 'power3.out' }); }
    });
  });

  // ── Material cards ──
  gsap.utils.toArray('.material-card').forEach((card, i) => {
    gsap.set(card, { opacity: 0, scale: 0.9 });
    ScrollTrigger.create({
      trigger: card, start: 'top 90%',
      onEnter() { gsap.to(card, { opacity: 1, scale: 1, duration: 0.7, delay: i * 0.08, ease: 'power3.out' }); }
    });
  });

  // ── Timeline items ──
  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.set(item, { opacity: 0, x: -30 });
    ScrollTrigger.create({
      trigger: item, start: 'top 88%',
      onEnter() { gsap.to(item, { opacity: 1, x: 0, duration: 0.8, delay: i * 0.1, ease: 'power3.out' }); }
    });
  });

  // ── Footer brand ──
  const footerBrand = document.querySelector('.footer-brand-large');
  if (footerBrand) {
    gsap.set(footerBrand, { opacity: 0, y: 40 });
    ScrollTrigger.create({
      trigger: footerBrand, start: 'top 90%',
      onEnter() { gsap.to(footerBrand, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }); }
    });
  }

  ScrollTrigger.refresh();
}
