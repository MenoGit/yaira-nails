/* =====================================================
   Yaira's Nail Creations — interactions
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ----- LOADER ----- */
  const loader = document.getElementById('loader');
  function hideLoader() { if (loader) loader.classList.add('hidden'); }
  // Hide on window.load OR after 1500 ms — whichever fires first
  let hidden = false;
  function safeHide() { if (!hidden) { hidden = true; hideLoader(); } }
  window.addEventListener('load', () => setTimeout(safeHide, 1200));
  setTimeout(safeHide, 2500); // hard fallback in case window.load never fires (file:// quirk)

  /* ----- YEAR ----- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ----- CUSTOM CURSOR ----- */
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function animateCursor() {
    curX += (mouseX - curX) * 0.18;
    curY += (mouseY - curY) * 0.18;
    cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .g, .contact-card, .nav-burger').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });

  /* ----- NAV scroll state ----- */
  const nav = document.getElementById('nav');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
    lastY = y;
  });

  /* ----- SCROLL PROGRESS BAR (spring-eased) ----- */
  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    let target = 0;
    let current = 0;
    function tickProgress() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = max > 0 ? (window.scrollY / max) : 0;
      current += (target - current) * 0.18;
      scrollProgress.style.width = (current * 100) + '%';
      requestAnimationFrame(tickProgress);
    }
    tickProgress();
  }

  /* ----- MOBILE MENU ----- */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  /* ----- REVEAL on scroll ----- */
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  reveals.forEach(el => io.observe(el));

  /* ----- LIGHTBOX ----- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCap = document.getElementById('lightboxCap');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.g').forEach(fig => {
    fig.addEventListener('click', () => {
      const phEl = fig.querySelector('.ph');
      const cap = fig.dataset.cap || '';
      // Mirror the gradient from the placeholder onto the lightbox.
      // When real photos are added, swap to: lightboxImage.style.backgroundImage = `url(${url})`;
      const computed = window.getComputedStyle(phEl).backgroundImage;
      lightboxImage.style.backgroundImage = computed;
      lightboxCap.textContent = cap;
      lightbox.classList.add('open');
    });
  });

  function closeLightbox() { lightbox.classList.remove('open'); }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ----- subtle parallax on hero orb ----- */
  const orb = document.querySelector('.hero-orb');
  if (orb) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      orb.style.translate = `${x}px ${y}px`;
    });
  }

  /* ----- ANIMATED COUNTERS ----- */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10) || 0;
      const duration = 2400; // ms
      const start = performance.now();
      function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        // ease-out cubic — slow, deliberate finish
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased);
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

});
