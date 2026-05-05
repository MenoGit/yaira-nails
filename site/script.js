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
      document.body.classList.add('lightbox-open');
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.classList.remove('lightbox-open');
  }
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

    // FRAME_WIDTH + TOTAL_WIDTH are 'let' — the mobile media query swaps
    // the rendered button width (320 → 260), so syncDimensions() rereads
    // the actual offsetWidth on init AND on every resize. Keeps the
    // falloff math + scrollPos wrap point in sync across breakpoints.
    let FRAME_WIDTH = 320;
    const SCROLL_SPEED = 35;        // px/sec
    const EXAMPLES_COUNT = 13;
    let TOTAL_WIDTH = FRAME_WIDTH * EXAMPLES_COUNT;

    // Printed film-stock tracking text along the top sprocket strip.
    // 40 reps of the 49-char segment ≈ 16.6k chars — comfortably wider
    // than the 12480px track at 8px monospace + 0.25em letter-spacing.
    const trackingText = document.getElementById('filmTrackingText');
    if (trackingText) {
      const segment = 'Y. SOTO · 35MM · YAIRA NAIL CREATIONS · ↑ ↑ ↑ · ';
      trackingText.textContent = segment.repeat(40);
    }
    const DRAG_THRESHOLD = 8;       // px before a press becomes a drag (was 5)

    let scrollPos = 0;
    let isHovered = false;
    let isPressed = false;          // pause auto-scroll while held, even before any drag
    let isPaused = false;            // derived: hovered OR pressed
    let isDragging = false;
    let pressed = false;
    let didDrag = false;
    let pressX = 0;
    let pressY = 0;
    let scrollAtPress = 0;
    let activePointerId = null;
    let lastTime = 0;

    function updatePause() {
      // Auto-scroll pauses while the cursor is over the strip OR the user
      // has a press held — keeps the card stationary between mousedown
      // and mouseup so a click doesn't get re-targeted by drift.
      isPaused = isHovered || isPressed;
    }

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

    // Recalibrate FRAME_WIDTH from the actual rendered button so the
    // mobile breakpoint (260px) and desktop (320px) both work without
    // hardcoded magic numbers.
    function syncDimensions() {
      const sample = track.querySelector('.film-frame');
      if (!sample) return;
      const w = sample.offsetWidth;
      if (w > 0 && Math.abs(w - FRAME_WIDTH) > 0.5) {
        FRAME_WIDTH = w;
        TOTAL_WIDTH = FRAME_WIDTH * EXAMPLES_COUNT;
      }
    }
    syncDimensions();
    window.addEventListener('resize', syncDimensions);

    function frame(now) {
      // Reduced-motion check intentionally NOT here. iOS Safari often
      // reports prefers-reduced-motion: reduce even when the user
      // hasn't explicitly opted in, and auto-scroll is part of the
      // section's identity (without it the other 12 services aren't
      // visible) — so we honor user intent over the OS hint.
      if (!isPaused && !isDragging) {
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
    // Belt-and-suspenders kick. The IIFE runs on DOMContentLoaded and
    // schedules rAF once. If anything (stalled paint, deferred
    // resource, mobile Safari quirk) drops that first rAF on the
    // floor, window.load re-schedules. rafKicked guards against
    // ever starting two concurrent loops.
    let rafKicked = false;
    function startMarquee() {
      if (rafKicked) return;
      rafKicked = true;
      requestAnimationFrame(frame);
    }
    startMarquee();
    window.addEventListener('load', startMarquee);

    // Hover pause (desktop only — :hover is sticky on touch).
    if (window.matchMedia('(hover: hover)').matches) {
      stage.addEventListener('mouseenter', () => { isHovered = true; updatePause(); });
      stage.addEventListener('mouseleave', () => { isHovered = false; updatePause(); });
    }

    // Pointer events unify mouse + touch for drag handling. Listen for
    // move/up on the document (not the stage) and DON'T setPointerCapture —
    // that capture redirects mouse-compat events (including the synthesized
    // click) to the capture target, so the click would never reach the
    // .film-frame button. Document-level move/up keeps things working
    // even when the pointer leaves the stage during a drag.
    function onPointerDown(e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pressed = true;
      // Don't pause yet — wait for an actual drag past threshold. A
      // tap-without-drag (mobile) shouldn't freeze the auto-scroll, and
      // hover-pause already covers desktop click-without-drag.
      didDrag = false;
      isDragging = false;
      pressX = e.clientX;
      pressY = e.clientY;
      scrollAtPress = scrollPos;
      activePointerId = e.pointerId;
    }
    function onPointerMove(e) {
      if (!pressed) return;
      if (e.pointerId !== undefined && activePointerId !== null && e.pointerId !== activePointerId) return;
      const dx = pressX - e.clientX;
      const dy = pressY - e.clientY;
      if (!isDragging && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
        isDragging = true;
        isPressed = true;        // NOW pause auto-scroll — real drag started
        didDrag = true;
        stage.classList.add('is-dragging');
        updatePause();
      }
      if (isDragging) {
        scrollPos = scrollAtPress + dx;
      }
    }
    function onPointerUp(e) {
      if (!pressed) return;
      if (e && e.pointerId !== undefined && activePointerId !== null && e.pointerId !== activePointerId) return;
      pressed = false;
      isPressed = false;
      isDragging = false;
      activePointerId = null;
      stage.classList.remove('is-dragging');
      updatePause();
      // didDrag stays as-is here — the click handler runs immediately
      // after pointerup (same task) and needs the value. Next pointerdown
      // will reset it.
    }
    stage.addEventListener('pointerdown', onPointerDown);
    // STEP 5 — passive: true. We never preventDefault inside these
    // handlers, so marking them passive lets mobile browsers continue
    // their native pan-y scroll without a render bottleneck.
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerup', onPointerUp, { passive: true });
    document.addEventListener('pointercancel', onPointerUp, { passive: true });
    // Block native image-drag from stealing the gesture.
    stage.addEventListener('dragstart', (e) => e.preventDefault());

    /* ----- MODAL ----- */
    const modal = document.getElementById('filmModal');
    const modalBackdrop = document.getElementById('filmModalBackdrop');
    const modalClose = document.getElementById('filmModalClose');
    const modalPhoto = document.getElementById('filmModalPhoto');
    const modalCapName = document.getElementById('filmModalCapName');
    const modalCapSub = document.getElementById('filmModalCapSub');

    // Read the photo URL from the existing .sx-N background-image rules
    // so we don't duplicate the URL list. Walks up to the document so it
    // works whether the .sx-N node is on a film-frame or anywhere else.
    function getServicePhotoUrl(sx) {
      const probe = document.querySelector('.sx-' + sx);
      if (!probe) return '';
      const bg = window.getComputedStyle(probe).backgroundImage || '';
      const m = bg.match(/url\((["']?)(.+?)\1\)/);
      return m ? m[2] : '';
    }

    function openModal(sx, name) {
      if (!modal || !modalPhoto) return;
      const url = getServicePhotoUrl(sx);
      // Reset develop state BEFORE setting src so the dim baseline paints
      // before the new image appears and the transition begins from there.
      modalPhoto.classList.remove('developed');
      modalPhoto.src = url;
      modalPhoto.alt = name;
      if (modalCapName) modalCapName.textContent = name;
      if (modalCapSub) modalCapSub.textContent = 'By Yaira';
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      document.body.style.overflow = 'hidden';
      // Wait two paint frames so the desaturated/dim baseline renders
      // first, then add .developed so the 900ms filter transition fires.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          modalPhoto.classList.add('developed');
        });
      });
    }
    function closeModal() {
      if (!modal) return;
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-open');
      document.body.style.overflow = '';
      // Reset so the next open starts undeveloped again.
      if (modalPhoto) modalPhoto.classList.remove('developed');
    }

    // Click DELEGATION on the stage: catches the click whether it lands on
    // a .film-frame button itself or on the parent container (which can
    // happen if the track moves between mousedown and mouseup, retargeting
    // the click to a common ancestor). Bails if a real drag occurred.
    stage.addEventListener('click', (e) => {
      const btn = e.target.closest('.film-frame');
      if (!btn) return;
      if (didDrag) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      openModal(btn.getAttribute('data-sx'), btn.getAttribute('data-name') || '');
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
