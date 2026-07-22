/* ═══════════════════════════════════════════════════════
   SATVA LASER — Shopping Cart (localStorage)
   ═══════════════════════════════════════════════════════ */

import { buildCartInquiry, openWhatsApp } from './whatsapp.js';

const CART_KEY = 'satva_cart';

/* ── State ── */
let cart = loadCart();
let drawerOpen = false;

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch { return []; }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateBadge();
  renderCartItems();
}

/* ── Public API ── */
export function getCart() { return cart; }

export function addToCart(product) {
  const existing = cart.find(i => i.id === product.id && i.finish === product.finish);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  showAddedFeedback(product.name);
}

export function removeFromCart(id, finish) {
  cart = cart.filter(i => !(i.id === id && i.finish === finish));
  saveCart();
}

export function updateQty(id, finish, delta) {
  const item = cart.find(i => i.id === id && i.finish === finish);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
}

export function clearCart() {
  cart = [];
  saveCart();
}

export function cartCount() {
  return cart.reduce((sum, i) => sum + i.qty, 0);
}

/* ── Badge ── */
function updateBadge() {
  const badge = document.querySelector('.cart-badge');
  if (!badge) return;
  const count = cartCount();
  badge.textContent = count;
  badge.classList.toggle('show', count > 0);
}

/* ── Feedback toast ── */
function showAddedFeedback(name) {
  let toast = document.getElementById('cart-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.style.cssText = `
      position:fixed; bottom:90px; right:30px; z-index:9000;
      background:rgba(20,16,11,0.95); backdrop-filter:blur(12px);
      border:1px solid rgba(198,161,91,0.3); border-radius:14px;
      padding:14px 22px; color:#ece4d3; font-size:0.86rem;
      transform:translateY(20px); opacity:0;
      transition:all 0.4s cubic-bezier(0.22,1,0.36,1);
      font-family:'Manrope',sans-serif;
      box-shadow:0 12px 40px rgba(0,0,0,0.5);
    `;
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span style="color:#c6a15b;">✓</span> <strong>${name}</strong> added to inquiry`;
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 2500);
}

/* ── Drawer Toggle ── */
export function toggleCart() {
  drawerOpen = !drawerOpen;
  document.querySelector('.cart-drawer')?.classList.toggle('open', drawerOpen);
  document.querySelector('.cart-overlay')?.classList.toggle('open', drawerOpen);
  document.body.style.overflow = drawerOpen ? 'hidden' : '';
}

export function openCart() {
  drawerOpen = true;
  document.querySelector('.cart-drawer')?.classList.add('open');
  document.querySelector('.cart-overlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function closeCart() {
  drawerOpen = false;
  document.querySelector('.cart-drawer')?.classList.remove('open');
  document.querySelector('.cart-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Render Cart Items ── */
function renderCartItems() {
  const container = document.querySelector('.cart-items');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke-linecap="round" stroke-linejoin="round"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        <p>Your inquiry list is empty</p>
        <span>Browse our collection to add pieces</span>
      </div>
    `;
    document.querySelector('.cart-footer')?.classList.add('hidden');
    return;
  }

  document.querySelector('.cart-footer')?.classList.remove('hidden');

  container.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}" data-finish="${item.finish || ''}">
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-category">${item.category || ''}</div>
        ${item.finish ? `<div class="cart-item-finish">${item.finish} Finish</div>` : ''}
        <div class="cart-item-actions">
          <div class="cart-qty">
            <button class="qty-minus" aria-label="Decrease">−</button>
            <span>${item.qty}</span>
            <button class="qty-plus" aria-label="Increase">+</button>
          </div>
        </div>
      </div>
      <button class="cart-item-remove" aria-label="Remove">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  `).join('');

  // Bind qty buttons
  container.querySelectorAll('.cart-item').forEach(el => {
    const id = el.dataset.id;
    const finish = el.dataset.finish;
    el.querySelector('.qty-minus')?.addEventListener('click', () => updateQty(id, finish, -1));
    el.querySelector('.qty-plus')?.addEventListener('click', () => updateQty(id, finish, 1));
    el.querySelector('.cart-item-remove')?.addEventListener('click', () => removeFromCart(id, finish));
  });

  // Update total count
  const totalEl = document.querySelector('.cart-total .value');
  if (totalEl) totalEl.textContent = `${cartCount()} item${cartCount() !== 1 ? 's' : ''} selected`;
}

/* ── WhatsApp Checkout ── */
function handleCheckout() {
  if (cart.length === 0) return;
  openWhatsApp(buildCartInquiry(cart));
}

/* ── Init ── */
export function initCart() {
  updateBadge();
  renderCartItems();

  // Cart button
  document.querySelector('.nav-cart')?.addEventListener('click', toggleCart);

  // Overlay close
  document.querySelector('.cart-overlay')?.addEventListener('click', closeCart);

  // Close button
  document.querySelector('.cart-close')?.addEventListener('click', closeCart);

  // Clear cart
  document.querySelector('.cart-clear')?.addEventListener('click', () => {
    clearCart();
  });

  // WhatsApp checkout
  document.querySelector('.cart-checkout')?.addEventListener('click', handleCheckout);

  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawerOpen) closeCart();
  });
}
