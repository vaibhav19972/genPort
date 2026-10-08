/* ============================================================
   genPort v2 — interactions
   Terminal reveals, scroll-spy, mobile nav, gallery lightbox.
   No custom cursor, no particles, no tilt, no rAF loops.
   ============================================================ */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Mobile nav toggle */
const navToggle = $('#navToggle');
const navLinks = $('#navLinks');
if (navToggle && navLinks) {
  const setOpen = (open) => {
    navLinks.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  };
  navToggle.addEventListener('click', () => setOpen(!navLinks.classList.contains('open')));
  $$('.nav__link', navLinks).forEach(a =>
    a.addEventListener('click', () => setOpen(false)));
}

/* Reveal on scroll */
const revealEls = $$('.reveal');
if (reduced || !('IntersectionObserver' in window)) {
  revealEls.forEach(el => el.classList.add('in'));
} else {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
}

/* Terminal: reveal lines sequentially */
const termLines = $$('.term__body .ln');
if (termLines.length) {
  if (reduced) {
    termLines.forEach(l => l.classList.add('show'));
  } else {
    termLines.forEach((l, i) => setTimeout(() => l.classList.add('show'), 300 + i * 240));
  }
}

/* Scroll-spy: highlight the nav link for the section in view */
const spySections = $$('main section[id], main header[id]');
if (spySections.length && 'IntersectionObserver' in window) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        $$('.nav__link').forEach(a => a.classList.remove('active'));
        const link = $(`.nav__link[href="#${e.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  spySections.forEach(s => spy.observe(s));
}

/* Lightbox for gallery images */
const galleryImgs = $$('.gallery img');
if (galleryImgs.length) {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Screenshot viewer');
  const lbImg = document.createElement('img');
  lbImg.alt = '';
  lightbox.appendChild(lbImg);
  document.body.appendChild(lightbox);
  const close = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };
  const open = (img) => {
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt || ' enlarged screenshot';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  galleryImgs.forEach(img => {
    img.tabIndex = 0;
    img.addEventListener('click', () => open(img));
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img); }
    });
  });
  lightbox.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}
