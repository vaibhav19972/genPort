/* ============================================
   GenPort — Main JavaScript
   Custom cursor, scroll animations, 3D tilt,
   magnetic buttons, parallax, typing effect
   ============================================ */

// ──────────────────────────────────────────────
// UTILITIES
// ──────────────────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

// ──────────────────────────────────────────────
// DOM REFERENCES
// ──────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
const scrollProgress = document.getElementById('scrollProgress');
const navEl = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const heroSubtitle = document.getElementById('heroSubtitle');
const particleCanvas = document.getElementById('particleCanvas');
const contactForm = document.getElementById('contactForm');

// ──────────────────────────────────────────────
// 1. CUSTOM CURSOR
// ──────────────────────────────────────────────
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

const isMobile = window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window;

if (!isMobile) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Determine cursor style based on hovered element
  document.addEventListener('mouseover', (e) => {
    const el = e.target;
    document.body.classList.remove('cursor--link', 'cursor--text', 'cursor--hidden');

    if (
      el.closest('a') || el.closest('button') ||
      el.closest('.project-card') || el.closest('.magnetic') ||
      el.closest('.nav__toggle') || el.closest('.bottom-nav__item')
    ) {
      document.body.classList.add('cursor--link');
    } else if (
      el.matches('input') || el.matches('textarea') || el.matches('select')
    ) {
      document.body.classList.add('cursor--text');
    }
  });

  // Animate cursor with lerp
  function animateCursor() {
    cursorX = lerp(cursorX, mouseX, 0.35);
    cursorY = lerp(cursorY, mouseY, 0.35);
    followerX = lerp(followerX, mouseX, 0.12);
    followerY = lerp(followerY, mouseY, 0.12);

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';

    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

// ──────────────────────────────────────────────
// 2. SCROLL PROGRESS BAR
// ──────────────────────────────────────────────
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = progress + '%';
}

// ──────────────────────────────────────────────
// 3. NAV SCROLL STATE & ACTIVE LINK
// ──────────────────────────────────────────────
const sections = document.querySelectorAll('section[id], header[id]');
const navLinksAll = document.querySelectorAll('.nav__link, .bottom-nav__item');

function updateNav() {
  const scrollTop = window.scrollY;

  // Frosted nav background change
  navEl.classList.toggle('scrolled', scrollTop > 60);

  // Active section tracking
  let currentSection = 'hero';
  sections.forEach((section) => {
    const top = section.offsetTop - 120;
    if (scrollTop >= top) {
      currentSection = section.id;
    }
  });

  navLinksAll.forEach((link) => {
    link.classList.toggle('active', link.dataset.section === currentSection);
  });
}

// ──────────────────────────────────────────────
// 4. INTERSECTION OBSERVER — SCROLL REVEALS
// ──────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // If it has counters, start counting
        entry.target.querySelectorAll('.counter').forEach(startCounter);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ──────────────────────────────────────────────
// 5. COUNTER ANIMATION
// ──────────────────────────────────────────────
function startCounter(el) {
  if (el.dataset.started) return;
  el.dataset.started = 'true';
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out quart
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ──────────────────────────────────────────────
// 6. TYPING EFFECT
// ──────────────────────────────────────────────
const typingStrings = [
  'Crafting Premium Native Experiences with Swift & Kotlin Multiplatform.',
  'Building high-performance iOS apps for 100M+ users.',
  'Designing cross-platform SDKs with KMP architecture.',
  'Available for remote freelance & consulting engagements.',
];

let stringIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 45;

function typeEffect() {
  const current = typingStrings[stringIndex];
  const displayText = current.substring(0, charIndex);

  heroSubtitle.innerHTML = displayText + '<span class="typed-cursor"></span>';

  if (!isDeleting && charIndex < current.length) {
    charIndex++;
    typingSpeed = 35 + Math.random() * 25;
  } else if (!isDeleting && charIndex === current.length) {
    isDeleting = true;
    typingSpeed = 2000; // pause at end
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
    typingSpeed = 18;
  } else {
    isDeleting = false;
    stringIndex = (stringIndex + 1) % typingStrings.length;
    typingSpeed = 400; // pause before next string
  }

  setTimeout(typeEffect, typingSpeed);
}
typeEffect();

// ──────────────────────────────────────────────
// 7. 3D TILT EFFECT ON CARDS
// ──────────────────────────────────────────────
const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

    // Update glare position
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    card.style.setProperty('--mouse-x', glareX + '%');
    card.style.setProperty('--mouse-y', glareY + '%');
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
  });
});

// ──────────────────────────────────────────────
// 8. MAGNETIC BUTTON EFFECT
// ──────────────────────────────────────────────
const magneticEls = document.querySelectorAll('.magnetic');

magneticEls.forEach((el) => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = 'translate(0, 0)';
  });
});

// ──────────────────────────────────────────────
// 9. PARALLAX BACKGROUND ORBS
// ──────────────────────────────────────────────
const orbs = document.querySelectorAll('.bg-orb');

function updateParallax() {
  const scrollY = window.scrollY;
  orbs.forEach((orb, i) => {
    const speed = [0.04, -0.03, 0.025][i] || 0.02;
    orb.style.transform = `translateY(${scrollY * speed}px)`;
  });
}

// ──────────────────────────────────────────────
// 10. PARTICLE CANVAS
// ──────────────────────────────────────────────
const ctx = particleCanvas.getContext('2d');
let particles = [];
let canvasW, canvasH;

function resizeCanvas() {
  canvasW = particleCanvas.width = window.innerWidth;
  canvasH = particleCanvas.height = window.innerHeight;
}
resizeCanvas();

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvasW;
    this.y = Math.random() * canvasH;
    this.size = Math.random() * 1.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.4 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Mouse repulsion
    if (!isMobile) {
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.x += (dx / dist) * force * 2;
        this.y += (dy / dist) * force * 2;
      }
    }

    if (this.x < 0 || this.x > canvasW || this.y < 0 || this.y > canvasH) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 230, 138, ${this.opacity})`;
    ctx.fill();
  }
}

// Initialize particles
const particleCount = isMobile ? 30 : 70;
for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function drawParticles() {
  ctx.clearRect(0, 0, canvasW, canvasH);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });

  // Draw lines between close particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0, 230, 138, ${0.06 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(drawParticles);
}
drawParticles();

// ──────────────────────────────────────────────
// 11. MOBILE NAV TOGGLE
// ──────────────────────────────────────────────
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('.nav__link').forEach((link) => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ──────────────────────────────────────────────
// 12. SMOOTH SCROLL
// ──────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ──────────────────────────────────────────────
// 13. CONTACT FORM — WhatsApp + Mail Integration
// ──────────────────────────────────────────────
const emailFallback = document.getElementById('emailFallback');

function getFormData() {
  const name = contactForm?.querySelector('#fullName')?.value.trim() || '';
  const email = contactForm?.querySelector('#email')?.value.trim() || '';
  const category = contactForm?.querySelector('#category')?.value || '';
  const message = contactForm?.querySelector('#message')?.value.trim() || '';
  return { name, email, category, message };
}

function buildWhatsAppURL({ name, email, category, message }) {
  const waText =
    `👋 Hi Vaibhav!\n\n` +
    `*Name:* ${name}\n` +
    `*Email:* ${email}\n` +
    `*Category:* ${category || 'Not specified'}\n\n` +
    `*Message:*\n${message}`;
  return `https://wa.me/917000530821?text=${encodeURIComponent(waText)}`;
}

function buildMailtoURL({ name, email, category, message }) {
  const subject = `Portfolio Enquiry — ${category || 'General'}`;
  const body =
    `Hi Vaibhav,\n\n` +
    `Name: ${name}\nEmail: ${email}\nCategory: ${category || 'Not specified'}\n\n` +
    `Message:\n${message}`;
  return `mailto:raikwar.vaibhav95@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = getFormData();
    window.open(buildWhatsAppURL(data), '_blank');

    const btn = contactForm.querySelector('.contact__submit');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>✓ Opening WhatsApp…</span>';
    btn.style.background = 'linear-gradient(135deg, #28c840, #00b36b)';

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });
}

if (emailFallback) {
  emailFallback.addEventListener('click', (e) => {
    e.preventDefault();
    const data = getFormData();
    window.location.href = buildMailtoURL(data);
  });
}

// ──────────────────────────────────────────────
// 14. RIPPLE EFFECT ON CLICK
// ──────────────────────────────────────────────
document.addEventListener('click', (e) => {
  const el = e.target.closest('a, button');
  if (!el) return;

  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
  ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
  el.style.position = el.style.position || 'relative';
  el.style.overflow = 'hidden';
  el.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});

// ──────────────────────────────────────────────
// 15. UNIFIED SCROLL HANDLER (throttled)
// ──────────────────────────────────────────────
let ticking = false;
function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateScrollProgress();
      updateNav();
      updateParallax();
      ticking = false;
    });
    ticking = true;
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', resizeCanvas);

// Initial calls
updateScrollProgress();
updateNav();
