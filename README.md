# Satva Laser — Precision Laser-Cut Metal

Marketing website for **Satva Laser**, a precision laser-cutting studio in Gota, Ahmedabad, specializing in architectural jaali screens, sculptural murals, and bespoke metal fittings in MS, SS, aluminium, MDF, and Corten steel.

The site is a fast, static, multi-page experience with a cinematic feel — a hand-drawn logo loader, scroll-driven canvas sequences, and a consistent brass-on-ink visual identity throughout.

## ✨ Highlights

- **Cinematic logo loader** — the diamond brand mark draws itself edge-by-edge, traced by a glowing spark, before the split-panel reveal.
- **Cohesive page transitions** — navigating between pages replays the same mark-draw language, so the brand feels like one continuous object.
- **Scroll-driven canvas sequence** — an immersive frame-by-frame cinematic with floating glassmorphic HUD overlays describing the process.
- **Editorial typography** — distinctive Fraunces serif for headlines *and* lede copy, paired with Manrope for UI text.
- **Inquiry cart + WhatsApp** — visitors build a list of pieces and send it straight to the studio over WhatsApp.
- Fully responsive, respects `prefers-reduced-motion`, and built as a lightweight static bundle.

## 🛠 Tech Stack

- **[Vite](https://vitejs.dev/)** — multi-page build & dev server
- **Vanilla JavaScript** (ES modules) — no framework
- **[GSAP](https://gsap.com/)** + ScrollTrigger — loader, transitions, and scroll animation
- **Plain CSS** — design-token-driven system (`src/css/base.css`)
- Google Fonts — Fraunces (serif) & Manrope (sans)

## 📁 Project Structure

```
.
├── index.html              # Home
├── products.html           # Product catalogue
├── gallery.html            # Gallery
├── studio.html             # About / studio
├── services.html           # Services
├── contact.html            # Contact
├── src/
│   ├── css/
│   │   ├── base.css        # Design tokens + foundation
│   │   ├── components.css  # Nav, cart, shared UI
│   │   ├── loader.css      # Loader + page-transition styles
│   │   └── pages/          # Per-page styles
│   └── js/
│       ├── main.js         # Shared boot, nav, cursor, product data
│       ├── loader.js       # Loader animation + page transitions
│       ├── canvas-sequence.js
│       ├── animations.js   # ScrollTrigger reveals
│       ├── cart.js         # Inquiry cart
│       └── whatsapp.js     # WhatsApp inquiry builder
├── public/                 # Static assets (images, frames)
└── vite.config.js
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:3000)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview the production build
npm run preview
```

## 📦 Deployment

`npm run build` produces a static site in `dist/`, deployable to any static host
(Netlify, Vercel, GitHub Pages, Cloudflare Pages, etc.). No server runtime required.

## 📇 Studio

**Satva Laser** — 11, Nagarbapa Estate, Nr. Gota Talav, Gota, Ahmedabad-382481
📧 satvalaser@gmail.com · 📞 +91 99094 30941 · 📷 [@satvalaser](https://instagram.com/satvalaser)

---

© Satva Laser — Gota, Ahmedabad, Gujarat. Cut by hand-guided precision, since day one.
