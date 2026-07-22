/* ═══════════════════════════════════════════════════════
   SATVA LASER — Main Entry (shared across all pages)
   ═══════════════════════════════════════════════════════ */

import '../css/base.css';
import '../css/components.css';
import '../css/loader.css';
import '../css/cart.css';

import { runLoader, initPageTransitions } from './loader.js';
import { initCart } from './cart.js';
import { initScrollAnimations } from './animations.js';
import { initCanvasSequence } from './canvas-sequence.js';
import { openWhatsApp, buildGeneralInquiry } from './whatsapp.js';

/* ── Product Data (shared catalog — each with UNIQUE image) ── */
export const PRODUCTS = [
  { id: 'jaali-partition', name: 'Architectural Jaali Partition', category: 'Partitions', image: '/images/gallery/jaali-partition.png', desc: 'Room dividers & entrance screens in stainless steel — geometric jaali patterns that carry light and shadow.', badge: 'premium', materials: ['SS', 'MS'] },
  { id: 'circular-partition', name: 'Circular Optical Partition', category: 'Partitions', image: '/images/gallery/circular-partition.png', desc: 'Concentric circle wall partition — hand-drawn, laser-cut panel by panel for dramatic light play.', badge: '', materials: ['SS'] },
  { id: 'tree-mural', name: 'Entrance Tree Mural', category: 'Murals', image: '/images/gallery/tree-mural.png', desc: 'Life-sized tree silhouette cut from a single sheet — our best-selling piece for entrances and lobbies.', badge: 'bestseller', materials: ['SS', 'MS', 'Brass'] },
  { id: 'horse-mural', name: 'Horse Line-Art Mural', category: 'Murals', image: '/images/gallery/horse-mural.png', desc: 'Galloping horse line-art in brushed gold — a statement piece for living rooms and drawing rooms.', badge: '', materials: ['SS', 'Brass'] },
  { id: 'floral-panels', name: 'Floral Panel Mural', category: 'Murals', image: '/images/gallery/floral-panels.png', desc: 'Four-panel botanical flower and vine design — elaborate laser-cut art for feature walls.', badge: 'bestseller', materials: ['SS', 'MS'] },
  { id: 'bollard-lamps', name: 'CNC Bollard Lamps', category: 'Lighting', image: '/images/gallery/bollard-lamps.png', desc: 'Outdoor pathway lamps with geometric cutouts — casting intricate shadow patterns at dusk.', badge: 'new', materials: ['SS', 'MS', 'Corten'] },
  { id: 'wall-clock', name: 'Metal Leaf Wall Clock', category: 'Decor', image: '/images/products/wall-clock.png', desc: 'Precision-cut leaf motif clock — a functional art piece for living spaces.', badge: '', materials: ['SS', 'Brass'] },
  { id: 'door-handle', name: 'Tree-of-Life Door Handle', category: 'Hardware', image: '/images/products/door-handle.png', desc: 'Luxury laser-cut brass handle — intricate tree-of-life pattern for statement doors.', badge: 'premium', materials: ['Brass', 'SS'] },
  { id: 'safety-grill', name: 'Geometric Safety Grill', category: 'Hardware', image: '/images/products/safety-grill.png', desc: 'Diamond-pattern safety door grill — precision cutting meets robust security.', badge: '', materials: ['SS', 'MS'] },
  { id: 'name-plate', name: 'CNC Metal Name Plate', category: 'Signage', image: '/images/products/name-plate.png', desc: 'Custom laser-cut name plates in Hindi, English or Gujarati — gold or chrome finish.', badge: 'bestseller', materials: ['SS', 'Brass', 'Aluminium'] },
  { id: 'outdoor-lamp', name: 'Shadow Pattern Lamp', category: 'Lighting', image: '/images/brochure/ChatGPT Image Jul 18, 2026, 01_43_22 PM - Copy.png', desc: 'CNC-cut outdoor lamp casting mesmerising shadow patterns — perfect for gardens and courtyards.', badge: '', materials: ['SS', 'MS', 'Corten'] },
  { id: 'serving-base', name: 'Laser-Cut Table Base', category: 'Decor', image: '/images/brochure/ChatGPT Image Jul 18, 2026, 01_48_04 PM - Copy.png', desc: 'Stainless steel serving table base with laser-cut geometric sides — functional art furniture.', badge: '', materials: ['SS'] },
  { id: 'deep-offset', name: 'Deep Offset Panels', category: 'Partitions', image: '/images/brochure/WhatsApp Image 2026-07-18 at 1.42.45 PM - Copy.jpeg', desc: 'Multi-pattern decorative panels — organic and geometric options for walls and ceilings.', badge: 'new', materials: ['SS', 'MS', 'MDF'] },
  { id: 'mdf-panel', name: 'MDF Decorative Panel', category: 'Partitions', image: '/images/products/mdf-panel.png', desc: 'Precision-cut MDF panels for interior walls — lightweight, affordable, design-forward.', badge: '', materials: ['MDF'] },
  { id: 'corten-screen', name: 'Corten Steel Screen', category: 'Partitions', image: '/images/products/corten-screen.png', desc: 'Weathering Corten steel garden screens — rustic elegance for outdoor spaces.', badge: 'new', materials: ['Corten'] },
  { id: 'tabletop-art', name: 'Tabletop Silhouette', category: 'Decor', image: '/images/brochure/SaveClip.App_658927341_18590436382027462_2534219317036481904_n.jpg - Copy.jpeg', desc: 'Classic car silhouette home decor piece — laser-cut conversation starters.', badge: '', materials: ['SS', 'MS'] },
];

/* ── Nav logic ── */
function initNav() {
  const nav = document.querySelector('header.nav');
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.mobile-nav-overlay');

  // Scroll condense
  window.addEventListener('scroll', () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Mobile menu
  function toggleMobile() {
    hamburger?.classList.toggle('open');
    mobileNav?.classList.toggle('open');
    overlay?.classList.toggle('open');
    document.body.style.overflow = mobileNav?.classList.contains('open') ? 'hidden' : '';
  }

  hamburger?.addEventListener('click', toggleMobile);
  overlay?.addEventListener('click', toggleMobile);
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', toggleMobile));

  // Active link highlighting
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-pill a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html') || (currentPage === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ── Custom Cursor ── */
function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    gsap.to(dot, { x: mx - 3, y: my - 3, duration: 0.1 });
    gsap.to(ring, { x: mx - 18, y: my - 18, duration: 0.25 });
  });

  document.querySelectorAll('a, button, .gal-item, .product-card, .gallery-item').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });
}

/* ── Scroll Progress ── */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${(window.scrollY / total) * 100}%`;
  });
}

/* ── Back to Top ── */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── WhatsApp Float ── */
function initWhatsAppFloat() {
  const btn = document.querySelector('.whatsapp-float');
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openWhatsApp(buildGeneralInquiry());
  });
}

/* ── Ray Burst Builder ── */
export function buildRayBurst() {
  const svg = document.getElementById('rayBurst');
  if (!svg) return;
  const cx = 100, cy = 100, rays = 48, rInner = 78, rOuterBase = 92;
  for (let i = 0; i < rays; i++) {
    const angle = (i / rays) * Math.PI * 2;
    const variance = (i % 4 === 0) ? 10 : (i % 2 === 0 ? 4 : 0);
    const rOuter = rOuterBase + variance;
    const x1 = cx + rInner * Math.cos(angle);
    const y1 = cy + rInner * Math.sin(angle);
    const x2 = cx + rOuter * Math.cos(angle);
    const y2 = cy + rOuter * Math.sin(angle);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1); line.setAttribute('y1', y1);
    line.setAttribute('x2', x2); line.setAttribute('y2', y2);
    svg.appendChild(line);
  }
  if (typeof gsap !== 'undefined') {
    gsap.set(svg.querySelectorAll('line'), { opacity: 0 });
    gsap.to(svg.querySelectorAll('line'), { opacity: 0.85, duration: 0.5, stagger: 0.014, ease: 'power1.out', delay: 0.15 });
  }
}

/* ── FAQ Accordion ── */
export function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

/* ── Gallery Filter ── */
export function initFilter(selector, itemsSelector, dataAttr = 'data-category') {
  const btns = document.querySelectorAll(selector);
  const items = document.querySelectorAll(itemsSelector);
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      items.forEach(item => {
        const match = filter === 'all' || item.getAttribute(dataAttr) === filter;
        item.style.display = match ? '' : 'none';
      });
      ScrollTrigger?.refresh();
    });
  });
}

/* ── Lightbox ── */
export function initLightbox() {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;

  const img = lightbox.querySelector('.lightbox-content img');
  const title = lightbox.querySelector('.lb-title');
  const cat = lightbox.querySelector('.lb-cat');
  let items = [];
  let currentIndex = 0;

  document.querySelectorAll('[data-lightbox]').forEach((el, i) => {
    items.push({
      src: el.dataset.lightbox,
      title: el.dataset.title || '',
      cat: el.dataset.cat || ''
    });
    el.addEventListener('click', (e) => {
      if (e.target.closest('.btn-add, .btn-outline')) return;
      currentIndex = i;
      showSlide();
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function showSlide() {
    const item = items[currentIndex];
    if (!item) return;
    img.src = item.src;
    if (title) title.textContent = item.title;
    if (cat) cat.textContent = item.cat;
  }

  lightbox.querySelector('.lightbox-close')?.addEventListener('click', closeLb);
  lightbox.querySelector('.lightbox-prev')?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    showSlide();
  });
  lightbox.querySelector('.lightbox-next')?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % items.length;
    showSlide();
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLb();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') { currentIndex = (currentIndex - 1 + items.length) % items.length; showSlide(); }
    if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % items.length; showSlide(); }
  });

  function closeLb() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ── Boot ── */
export function boot(pageInit) {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  buildRayBurst();

  function afterLoader() {
    initScrollAnimations();
    initCanvasSequence();
    initCursor();
    initScrollProgress();
    initBackToTop();
    initWhatsAppFloat();
    initCart();

    // Cinematic page transitions (mark-draw language, matches loader)
    initPageTransitions();

    if (pageInit) pageInit();
  }

  const hasLoader = document.getElementById('loader');
  if (hasLoader) {
    runLoader(afterLoader);
  } else {
    document.documentElement.classList.remove('loading');
    afterLoader();
  }
}

// Auto-init
if (document.readyState === 'complete') {
  boot(window.__pageInit);
} else {
  window.addEventListener('load', () => boot(window.__pageInit));
}
