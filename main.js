/* ============================================================
   genPort v2 — interactions
   Terminal reveals, scroll-spy, mobile nav, contact relays.
   No custom cursor, no particles, no tilt, no rAF loops.
   ============================================================ */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Mobile nav toggle */
const navToggle = $('#navToggle');
const navLinks = $('#navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  $$('.nav__link', navLinks).forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open')));
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
        e.target.classList.add('visible');
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
  lightbox.setAttribute('aria-label', 'Screenshot viewer');
  const lbImg = document.createElement('img');
  lightbox.appendChild(lbImg);
  document.body.appendChild(lightbox);
  galleryImgs.forEach(img => {
    img.addEventListener('click', () => {
      lbImg.src = img.currentSrc || img.src;
      lightbox.classList.add('open');
    });
  });
  lightbox.addEventListener('click', () => lightbox.classList.remove('open'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.classList.remove('open');
  });
}

/* Contact relays (WhatsApp / mailto) — used if a contact form exists */
const contactForm = $('#contactForm');
if (contactForm) {
  const data = () => ({
    name: $('#fullName', contactForm)?.value.trim() || '',
    email: $('#email', contactForm)?.value.trim() || '',
    category: $('#category', contactForm)?.value || '',
    message: $('#message', contactForm)?.value.trim() || '',
  });
  const waURL = (d) => 'https://wa.me/917000530821?text=' + encodeURIComponent(
    `Hi Vaibhav!\n\nName: ${d.name}\nEmail: ${d.email}\nCategory: ${d.category || 'Not specified'}\n\nMessage:\n${d.message}`);
  const mailURL = (d) => 'mailto:raikwar.vaibhav95@gmail.com?subject=' +
    encodeURIComponent(`Portfolio enquiry — ${d.category || 'General'}`) + '&body=' +
    encodeURIComponent(`Name: ${d.name}\nEmail: ${d.email}\n\n${d.message}`);
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    window.open(waURL(data()), '_blank');
  });
  const emailFallback = $('#emailFallback');
  if (emailFallback) {
    emailFallback.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = mailURL(data());
    });
  }
}