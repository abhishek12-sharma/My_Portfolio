# Abhishek Sharma — Developer Portfolio

A professional, responsive, and visually stunning personal portfolio website built with vanilla HTML, CSS, and JavaScript. Designed for placement opportunities and deployable on Vercel.

## 🚀 Live Demo

Deploy on [Vercel](https://vercel.com) for free — see deployment instructions below.

---

## ✨ Features

- **Dark Premium Design** — Deep navy/purple gradient theme with glassmorphism effects
- **Animated Particle Background** — Interactive canvas-based particle network in the hero
- **Typewriter Effect** — Rotating role titles with smooth typing animation
- **Scroll Animations** — Reveal-on-scroll for all sections
- **Animated Stat Counters** — Numbers count up when scrolled into view
- **3D Tilt Cards** — Project cards with mouse-tracking tilt effect
- **Sticky Navbar** — Highlights active section, collapses on mobile
- **Responsive Design** — Fully mobile-friendly (768px & 480px breakpoints)
- **Contact Form** — Opens native email client via `mailto:`

---

## 📁 File Structure

```
portfolio/
├── index.html      ← Main HTML (all sections)
├── style.css       ← Design system + responsive styles
├── script.js       ← All JS interactivity
├── vercel.json     ← Vercel deployment config
└── README.md       ← This file
```

---

## ✏️ How to Make Changes

### Update Personal Info
Open `index.html` and search for sections:

| What to change | Where to find it |
|---|---|
| Name / Email / Phone | `#about` section, `#contact` section, `<footer>` |
| LinkedIn / GitHub / Instagram URLs | `href` attributes on social icons in hero + footer |
| Profile summary paragraph | Inside `<div class="about-text">` |

### Add / Edit Projects
In `index.html`, find `<section id="projects">`. Each project is an `<article class="project-card">`.

Copy an existing card and update:
- `id` attribute (e.g., `id="project-myproject"`)
- `<div class="project-badge">` — badge text and class (`badge-ml`, `badge-java`, `badge-web`)
- `<h3 class="project-title">` — project name
- `<p class="project-desc">` — description
- `<ul class="project-highlights">` — bullet points
- `<div class="project-tech">` — tech stack tags
- GitHub `href` link

### Add / Edit Certificates
Find `<section id="certificates">`. Copy a `.cert-card` div and update the icon, title, issuer, and date.

### Add / Edit Education
Find `<section id="education">`. Copy an `.edu-item` div block.

### Change Colors
Open `style.css` and edit the CSS variables at the top (`:root` block):
```css
--accent-primary: #6c63ff;    /* Main purple */
--accent-secondary: #a855f7;  /* Secondary purple */
--accent-tertiary: #06b6d4;   /* Cyan accent */
--bg-primary: #050b18;        /* Page background */
```

### Change Typewriter Roles
Open `script.js` and find the `roles` array:
```js
const roles = [
  'Full-Stack Developer',
  'ML / AI Enthusiast',
  // Add your own here...
];
```

---

## 🌐 Deploy to Vercel

### Method 1: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# From the portfolio directory
vercel

# Follow the prompts — deploy to production with:
vercel --prod
```

### Method 2: Vercel Dashboard (Easiest)
1. Push this folder to a **GitHub repository**
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Vercel auto-detects it as a static site
5. Click **Deploy** → Done! ✅

### Method 3: Drag & Drop
1. Go to [vercel.com/new](https://vercel.com/new)
2. Drag your `portfolio/` folder into the upload zone
3. Done!

---

## 📦 No Build Required

This is a **pure static site** — no npm install, no build step. Just HTML, CSS, and JS.

---

## 📞 Contact

**Abhishek Sharma**  
📧 amansharmaa43963114@gmail.com  
📱 +91 6388762269  
🔗 [GitHub](https://github.com/abhishek12-sharma) | [Instagram](https://www.instagram.com/_abhishek_sharma_12_/)
