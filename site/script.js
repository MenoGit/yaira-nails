/* =====================================================
   Yaira's Nail Creations — interactions
   ===================================================== */

// TODO: Replace with Booksy URL once Yaira creates her free account at booksy.com/biz/sign-up
const BOOKING_URL = 'https://www.instagram.com/yairas.nailcreations/';

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

  /* ----- BOOKING URL hookup ----- */
  document.querySelectorAll('.btn-primary').forEach(el => { el.href = BOOKING_URL; });

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

  /* ----- MAGNETIC BUTTONS (primary CTAs only) ----- */
  function makeMagnetic(el, options = {}) {
    const {
      distance = 0.35,      // pull multiplier
      triggerArea = 120     // extra px around button where pull begins
    } = options;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = Math.max(rect.width, rect.height) / 2 + triggerArea;
      if (dist < radius) {
        const strength = 1 - (dist / radius);  // 1 at center, 0 at edge
        targetX = dx * distance * strength;
        targetY = dy * distance * strength;
      } else {
        targetX = 0;
        targetY = 0;
      }
    });

    function tick() {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      el.style.transform = `translate(${currentX}px, ${currentY}px)`;
      requestAnimationFrame(tick);
    }
    tick();
  }

  document.querySelectorAll('.nav-cta, .btn-primary').forEach(makeMagnetic);

  /* ===========================================================
     FILM STRIP — Examples
     Mirrors film-strip-REFERENCE.tsx in vanilla JS:
       • rAF auto-scroll at 35 px/s (delta-time, not CSS keyframes)
       • mouse + touch drag updates scrollPosition directly
       • hover anywhere on the strip pauses the scroll
       • modulo-wraps at TOTAL_WIDTH for seamless loop in both directions
       • per-frame scale + opacity falloff (center 1, edges ~0.85/0.5)
       • click on a frame opens the lightbox modal (drag suppresses click)
       • modal: backdrop / Escape / close-button all dismiss; body scroll locked
     =========================================================== */
  (function setupFilmStrip() {
    const stage = document.getElementById('filmStage');
    const track = document.getElementById('filmTrack');
    if (!stage || !track) return;

    const FRAME_WIDTH = 320;
    const SCROLL_SPEED = 35;        // px/sec
    const EXAMPLES_COUNT = 13;
    const TOTAL_WIDTH = FRAME_WIDTH * EXAMPLES_COUNT;   // = 4160
    const DRAG_THRESHOLD = 5;       // px before a press becomes a drag

    let scrollPos = 0;
    let isPaused = false;
    let isDragging = false;
    let pressed = false;
    let didDrag = false;
    let pressX = 0;
    let scrollAtPress = 0;
    let lastTime = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const frames = track.querySelectorAll('.film-frame');

    function applyVisualPosition() {
      // Wrap to [0, TOTAL_WIDTH) — the 3× duplicated track makes the wrap
      // seamless (positions 0, TOTAL_WIDTH, 2·TOTAL_WIDTH show identical content).
      let v = scrollPos % TOTAL_WIDTH;
      if (v < 0) v += TOTAL_WIDTH;
      track.style.transform = `translateX(${-v}px)`;
      return v;
    }

    function applyFalloff(visualPos) {
      const stageRect = stage.getBoundingClientRect();
      if (stageRect.width <= 0) return;
      const stageCenterRel = stageRect.width / 2;        // px from stage left
      const halfStage = stageRect.width / 2;
      // Each frame i (in DOM order, 0..38) sits at x = i*FRAME_WIDTH on the
      // track. Its on-stage center = i*FRAME_WIDTH + FRAME_WIDTH/2 - visualPos.
      for (let i = 0; i < frames.length; i++) {
        const frameCenter = i * FRAME_WIDTH + FRAME_WIDTH / 2 - visualPos;
        const dist = Math.min(1, Math.abs(frameCenter - stageCenterRel) / halfStage);
        const scale = 1 - dist * 0.15;     // edges ~0.85
        const opacity = 1 - dist * 0.5;    // edges ~0.5
        frames[i].style.setProperty('--film-scale', scale.toFixed(3));
        frames[i].style.setProperty('--film-opacity', opacity.toFixed(3));
      }
    }

    function frame(now) {
      if (!isPaused && !isDragging && !reducedMotion.matches) {
        const dt = lastTime ? (now - lastTime) / 1000 : 0;
        lastTime = now;
        scrollPos += SCROLL_SPEED * dt;
        if (scrollPos >= TOTAL_WIDTH) scrollPos -= TOTAL_WIDTH;
      } else {
        lastTime = now;
      }
      const v = applyVisualPosition();
      applyFalloff(v);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    // Hover pause (desktop only — :hover is sticky on touch).
    if (window.matchMedia('(hover: hover)').matches) {
      stage.addEventListener('mouseenter', () => { isPaused = true; });
      stage.addEventListener('mouseleave', () => {
        isPaused = false;
        if (pressed) {
          pressed = false;
          isDragging = false;
          stage.classList.remove('is-dragging');
        }
      });
    }

    // Pointer events unify mouse + touch for drag handling.
    function onPointerDown(e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pressed = true;
      didDrag = false;
      isDragging = false;
      pressX = e.clientX;
      scrollAtPress = scrollPos;
      try { stage.setPointerCapture(e.pointerId); } catch (_) {}
    }
    function onPointerMove(e) {
      if (!pressed) return;
      const delta = pressX - e.clientX;
      if (!isDragging && Math.abs(delta) > DRAG_THRESHOLD) {
        isDragging = true;
        didDrag = true;
        stage.classList.add('is-dragging');
      }
      if (isDragging) {
        scrollPos = scrollAtPress + delta;
      }
    }
    function onPointerUp() {
      pressed = false;
      isDragging = false;
      stage.classList.remove('is-dragging');
    }
    stage.addEventListener('pointerdown', onPointerDown);
    stage.addEventListener('pointermove', onPointerMove);
    stage.addEventListener('pointerup', onPointerUp);
    stage.addEventListener('pointercancel', onPointerUp);
    // Block native image-drag from stealing the gesture.
    stage.addEventListener('dragstart', (e) => e.preventDefault());

    /* ----- MODAL ----- */
    const modal = document.getElementById('filmModal');
    const modalBackdrop = document.getElementById('filmModalBackdrop');
    const modalClose = document.getElementById('filmModalClose');
    const modalPhoto = document.getElementById('filmModalPhoto');
    const modalCapName = document.getElementById('filmModalCapName');
    const modalCapSub = document.getElementById('filmModalCapSub');

    function openModal(sx, name) {
      if (!modal || !modalPhoto) return;
      // Reuse the same .sx-N class so we don't duplicate the URL list here.
      modalPhoto.className = 'film-modal-photo sx-' + sx;
      if (modalCapName) modalCapName.textContent = name;
      if (modalCapSub) modalCapSub.textContent = 'By Yaira';
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      if (!modal) return;
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    // Click each frame to open — drag suppresses click via didDrag flag.
    frames.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        if (didDrag) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        const sx = btn.getAttribute('data-sx');
        const name = btn.getAttribute('data-name') || '';
        openModal(sx, name);
      });
    });

    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
        closeModal();
      }
    });
  })();

});
