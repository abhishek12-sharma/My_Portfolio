/* ============================================
   script.js — Portfolio Interactivity
   ============================================ */

/* ==========================================
   LOAD ADMIN OVERRIDES FROM LOCALSTORAGE
   (Changes saved in admin.html are applied here)
   ========================================== */
(function applyAdminOverrides() {
  try {
    const raw = localStorage.getItem('portfolio_data');
    if (!raw) return;
    const data = JSON.parse(raw);
    const p = data.profile;

    // ---- APPLY PHOTO ----
    if (p && p.photo) {
      const places = p.photoPlaces || ['hero'];

      // ---- APPLY PHOTO SIZE ----
      const photoSize = p.photoSize || 225;
      const ringSize  = photoSize + 15;
      const avatarRing  = document.querySelector('.avatar-ring');
      const avatarInner = document.querySelector('.avatar-inner');
      if (avatarRing)  { avatarRing.style.width  = ringSize  + 'px'; avatarRing.style.height  = ringSize  + 'px'; }
      if (avatarInner) { avatarInner.style.width  = photoSize + 'px'; avatarInner.style.height = photoSize + 'px'; }

      // Hero profile circle
      if (places.includes('hero')) {
        const img = document.getElementById('profilePhoto');
        if (img) {
          img.src = p.photo;
          img.style.display = 'block';
          const fb = document.getElementById('avatarFallback');
          if (fb) fb.style.display = 'none';
        }
      }

      // About section — inject a photo card if checked
      if (places.includes('about')) {
        document.addEventListener('DOMContentLoaded', () => {
          const aboutSection = document.querySelector('.about-section .about-text');
          if (aboutSection && !document.getElementById('about-photo-inject')) {
            const imgEl = document.createElement('div');
            imgEl.id = 'about-photo-inject';
            imgEl.style.cssText = 'width:180px;height:180px;border-radius:20px;overflow:hidden;box-shadow:0 8px 30px rgba(108,99,255,.3);margin-bottom:1.5rem;border:3px solid rgba(108,99,255,.3);';
            imgEl.innerHTML = `<img src="${p.photo}" style="width:100%;height:100%;object-fit:cover;object-position:top"/>`;
            aboutSection.prepend(imgEl);
          }
        });
      }

      // Contact section — inject above form
      if (places.includes('contact')) {
        document.addEventListener('DOMContentLoaded', () => {
          const contactInfo = document.querySelector('.contact-info');
          if (contactInfo && !document.getElementById('contact-photo-inject')) {
            const imgEl = document.createElement('div');
            imgEl.id = 'contact-photo-inject';
            imgEl.style.cssText = 'width:100%;display:flex;align-items:center;gap:1rem;background:var(--bg-card);border:1px solid var(--border-color);border-radius:14px;padding:1rem 1.4rem;margin-bottom:.5rem;';
            imgEl.innerHTML = `
              <img src="${p.photo}" style="width:56px;height:56px;border-radius:50%;object-fit:cover;object-position:top;border:2px solid rgba(108,99,255,.4)"/>
              <div><div style="font-weight:700;font-size:.95rem">${escapeHtml(p.name||'Abhishek Sharma')}</div>
              <div style="font-size:.8rem;color:var(--text-secondary)">${escapeHtml(p.title||'MCA Student & Developer')}</div></div>`;
            contactInfo.prepend(imgEl);
          }
        });
      }

      // Footer avatar
      if (places.includes('footer')) {
        document.addEventListener('DOMContentLoaded', () => {
          const footer = document.querySelector('.footer-content');
          if (footer && !document.getElementById('footer-photo-inject')) {
            const imgEl = document.createElement('img');
            imgEl.id = 'footer-photo-inject';
            imgEl.src = p.photo;
            imgEl.style.cssText = 'width:52px;height:52px;border-radius:50%;object-fit:cover;object-position:top;border:2px solid rgba(108,99,255,.4);margin-bottom:.4rem;';
            footer.prepend(imgEl);
          }
        });
      }
    }

    // ---- APPLY CONTACT DETAILS ----
    if (p) {
      // Phone links
      if (p.phone) document.querySelectorAll('[href^="tel:"]').forEach(a => { a.href=`tel:${p.phone}`; a.textContent=p.phone; });
      // Email links
      if (p.email) document.querySelectorAll('[href^="mailto:"]').forEach(a => { a.href=`mailto:${p.email}`; if(a.textContent.includes('@'))a.textContent=p.email; });
      // GitHub
      if (p.github) document.querySelectorAll('[href*="github.com"]').forEach(a => { a.href=p.github; if(a.textContent.includes('github'))a.textContent=p.github.replace('https://',''); });
      // LinkedIn
      if (p.linkedin) document.querySelectorAll('[href*="linkedin"]').forEach(a => { a.href=p.linkedin; });
      // Instagram
      if (p.instagram) document.querySelectorAll('[href*="instagram"]').forEach(a => { a.href=p.instagram; });
    }

    // ---- APPLY VISION TEXT ----
    if (data.visionText) {
      const v = data.visionText;
      if (v.p1 && document.getElementById('vision-para-1'))
        document.getElementById('vision-para-1').textContent = v.p1;
      if (v.p2 && document.getElementById('vision-para-2'))
        document.getElementById('vision-para-2').textContent = v.p2;
      if (v.ambition) {
        const ambEl = document.querySelector('.summary-ambition');
        if (ambEl) ambEl.innerHTML = `<i class="fa-solid fa-bullseye"></i> ${escapeHtml(v.ambition)}`;
      }
    }

    // ---- APPLY ABOUT TEXT ----
    if (data.aboutText) {
      const a = data.aboutText;
      const aboutParas = document.querySelectorAll('.about-text > p');
      if (a.p1 && aboutParas[0]) aboutParas[0].textContent = a.p1;
      if (a.p2 && aboutParas[1]) aboutParas[1].textContent = a.p2;
      if (a.p3 && aboutParas[2]) aboutParas[2].textContent = a.p3;
    }

    // ---- APPLY SECTION HEADINGS ----
    if (data.headings) {
      const h = data.headings;
      const idMap = {
        vision:   { tag:'sec-tag-vision',   title:'sec-title-vision' },
        about:    { tag:'sec-tag-about',    title:'sec-title-about' },
        skills:   { tag:'sec-tag-skills' },
        projects: { tag:'sec-tag-projects' },
        certs:    { tag:'sec-tag-certs' },
        edu:      { tag:'sec-tag-edu' },
        hobbies:  { tag:'sec-tag-hobbies' },
        contact:  { tag:'sec-tag-contact' },
      };
      Object.entries(h).forEach(([sec, vals]) => {
        const ids = idMap[sec];
        if (!ids) return;
        if (vals.tag && ids.tag) {
          const el = document.getElementById(ids.tag);
          if (el) el.textContent = vals.tag;
        }
        if (vals.title && ids.title) {
          const el = document.getElementById(ids.title);
          if (el) el.innerHTML = vals.title;
        }
      });
    }

  } catch(e) { console.warn('[portfolio] Override apply failed:', e.message); }

  function escapeHtml(str) {
    return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
})();

/* ==========================================
   ASYNC SUPABASE OVERRIDE (runs after DOM ready)
   Reads fresh data from cloud and re-applies
   ========================================== */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    if (!window.portfolioDB) return;
    const data = await window.portfolioDB.load();
    if (!data || Object.keys(data).length === 0) return;

    const p = data.profile;

    // Re-apply photo (in case cloud has updated photo)
    if (p?.photo) {
      const photoSize = p.photoSize || 225;
      const ringSize  = photoSize + 15;
      const ring  = document.querySelector('.avatar-ring');
      const inner = document.querySelector('.avatar-inner');
      if (ring)  { ring.style.width  = ringSize  + 'px'; ring.style.height  = ringSize  + 'px'; }
      if (inner) { inner.style.width = photoSize + 'px'; inner.style.height = photoSize + 'px'; }

      const places = p.photoPlaces || ['hero'];
      if (places.includes('hero')) {
        const img = document.getElementById('profilePhoto');
        if (img) { img.src = p.photo; img.style.display = 'block'; }
        const fb = document.getElementById('avatarFallback');
        if (fb) fb.style.display = 'none';
      }
    }

    // Re-apply vision text
    if (data.visionText) {
      const v = data.visionText;
      if (v.p1) { const el = document.getElementById('vision-para-1'); if (el) el.textContent = v.p1; }
      if (v.p2) { const el = document.getElementById('vision-para-2'); if (el) el.textContent = v.p2; }
      if (v.ambition) {
        const el = document.querySelector('.summary-ambition');
        if (el) el.innerHTML = `<i class="fa-solid fa-bullseye"></i> ${v.ambition}`;
      }
    }

    // Re-apply about text
    if (data.aboutText) {
      const paras = document.querySelectorAll('.about-text > p');
      if (data.aboutText.p1 && paras[0]) paras[0].textContent = data.aboutText.p1;
      if (data.aboutText.p2 && paras[1]) paras[1].textContent = data.aboutText.p2;
      if (data.aboutText.p3 && paras[2]) paras[2].textContent = data.aboutText.p3;
    }

    // Re-apply headings
    if (data.headings) {
      const h = data.headings;
      Object.entries(h).forEach(([sec, vals]) => {
        const tagEl   = document.getElementById(`sec-tag-${sec}`);
        const titleEl = document.getElementById(`sec-title-${sec}`);
        if (vals.tag   && tagEl)   tagEl.textContent   = vals.tag;
        if (vals.title && titleEl) titleEl.innerHTML    = vals.title;
      });
    }
  } catch(e) { /* silently fail */ }
});


/* ==========================================
   EMAILJS CONFIGURATION
   ------------------------------------------
   To make the contact form send real emails:
   1. Go to https://www.emailjs.com and sign up (free)
   2. Add a Gmail (or any) Email Service → copy the Service ID
   3. Create an Email Template with these variables:
        {{from_name}}, {{from_email}}, {{subject}}, {{message}}
      Set the recipient to: amansharmaa43963114@gmail.com
      Copy the Template ID
   4. Go to Account → API Keys → copy your Public Key
   5. Replace the three placeholder strings below
   ========================================== */
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // e.g. 'abc123XYZ'
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g. 'service_xxxxxx'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g. 'template_xxxxxx'

// Initialize EmailJS
(function () {
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }
})();

/* ==========================================
   DARK / LIGHT THEME TOGGLE
   ========================================== */
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function getStoredTheme() {
  return localStorage.getItem('portfolio-theme') || 'dark';
}

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);
}

// Apply on load
applyTheme(getStoredTheme());

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

/* ==========================================
   NAVBAR — Scroll + Active link
   ========================================== */
const navbar   = document.getElementById('navbar');
const hamburger= document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

function updateActiveNav() {
  const scrollY = window.scrollY + 110;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinkEls.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });

/* ==========================================
   TYPEWRITER EFFECT
   ========================================== */
const typewriterEl = document.getElementById('typewriter');
const roles = [
  'Aspiring Data Scientist',
  'ML / AI Enthusiast',
  'MCA Student @ LPU',
  'Problem Solver',
  'Java Developer',
  'Python Programmer',
  'Full-Stack Developer',
];
let roleIndex = 0, charIndex = 0, isDeleting = false, typeDelay = 110;

function type() {
  const current = roles[roleIndex];
  if (isDeleting) {
    typewriterEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    typeDelay = 60;
  } else {
    typewriterEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    typeDelay = 110;
  }
  if (!isDeleting && charIndex === current.length) { isDeleting = true; typeDelay = 1600; }
  else if (isDeleting && charIndex === 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; typeDelay = 300; }
  setTimeout(type, typeDelay);
}
type();

/* ==========================================
   PARTICLE CANVAS
   ========================================== */
(function () {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let particles = [];
  const COUNT   = 70;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = document.getElementById('home').offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function rand(a, b) { return a + Math.random() * (b - a); }
  function makeParticle() {
    return { x: rand(0, canvas.width), y: rand(0, canvas.height), r: rand(1, 3), dx: rand(-0.4, 0.4), dy: rand(-0.3, 0.3), alpha: rand(0.2, 0.7) };
  }
  for (let i = 0; i < COUNT; i++) particles.push(makeParticle());

  function getThemeColors() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    return { dot: isDark ? 'rgba(108,99,255,' : 'rgba(108,99,255,', line: isDark ? 0.12 : 0.07 };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const { dot, line } = getThemeColors();
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${dot}${p.alpha})`;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx = -p.dx;
      if (p.y < 0 || p.y > canvas.height) p.dy = -p.dy;
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `${dot}${line * (1 - dist / 120)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ==========================================
   REVEAL ON SCROLL
   ========================================== */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } }),
  { threshold: 0.12 }
);
revealEls.forEach(el => revealObserver.observe(el));

/* ==========================================
   ANIMATED STAT COUNTERS
   ========================================== */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const prog  = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - prog, 3);
    el.textContent = Math.floor(eased * target);
    if (prog < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}
const statsSection = document.querySelector('.about-stats');
if (statsSection) {
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.stat-number').forEach(n => animateCounter(n));
      }
    });
  }, { threshold: 0.4 }).observe(statsSection);
}

/* ==========================================
   BACK TO TOP
   ========================================== */
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ==========================================
   FOOTER YEAR
   ========================================== */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ==========================================
   SCROLL INDICATOR FADE
   ========================================== */
const scrollIndicator = document.getElementById('scrollIndicator');
if (scrollIndicator) {
  window.addEventListener('scroll', () => {
    scrollIndicator.style.opacity = window.scrollY > 80 ? '0' : '1';
  }, { passive: true });
}

/* ==========================================
   3D TILT ON PROJECT CARDS
   ========================================== */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = e.clientX - left, y = e.clientY - top;
    const rx = ((y - height/2) / (height/2)) * -4;
    const ry = ((x - width /2) / (width /2)) *  4;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ==========================================
   CONTACT FORM — EmailJS
   ========================================== */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name    = document.getElementById('form-name').value.trim();
    const email   = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const message = document.getElementById('form-message').value.trim();
    const alert   = document.getElementById('formAlert');
    const btn     = document.getElementById('form-submit-btn');
    const btnText = document.getElementById('btn-text');
    const spinner = document.getElementById('btnSpinner');

    // Validate
    if (!name || !email || !message) {
      showAlert(alert, 'error', '⚠️ Please fill in all required fields.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showAlert(alert, 'error', '⚠️ Please enter a valid email address.');
      return;
    }

    // Check if EmailJS is configured
    if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      // Fallback to mailto when not configured
      const mailtoLink = `mailto:amansharmaa43963114@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Contact')}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
      window.location.href = mailtoLink;
      showAlert(alert, 'success', '✅ Opening your email client...');
      return;
    }

    // Loading state
    btn.disabled = true;
    btnText.textContent = 'Sending...';
    spinner.style.display = 'inline-block';
    alert.style.display = 'none';

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name:  name,
        from_email: email,
        subject:    subject || 'Portfolio Contact',
        message:    message,
        to_email:   'amansharmaa43963114@gmail.com',
        reply_to:   email,
      });
      showAlert(alert, 'success', '✅ Message sent! I\'ll reply within 24 hours.');
      contactForm.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      showAlert(alert, 'error', '❌ Failed to send. Please email me directly at amansharmaa43963114@gmail.com');
    } finally {
      btn.disabled = false;
      btnText.textContent = 'Send Message';
      spinner.style.display = 'none';
    }
  });
}

function showAlert(el, type, msg) {
  el.className = `form-alert ${type}`;
  el.textContent = msg;
  el.style.display = 'block';
  if (type === 'success') {
    setTimeout(() => { el.style.display = 'none'; }, 5000);
  }
}

/* ==========================================
   DEV CONSOLE MESSAGE
   ========================================== */
console.log('%c👋 Hey Developer!', 'color:#6c63ff;font-size:1.4rem;font-weight:bold;font-family:monospace;');
console.log('%cBuilt with ❤️ by Abhishek Sharma', 'color:#a855f7;font-size:.9rem;font-family:monospace;');
