/* ═══════════════════════════════════════════════════════════════
   NABIL MENTALISTA — main.js
   Script compartido para todas las páginas del sitio.
   Sin dependencias externas · < 2 KB minificado
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. NAV — scroll class + active link ── */
  var nav = document.querySelector('nav');

  function onScroll() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // estado inicial

  // Marca el link activo según la URL actual
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && (href === currentPath || href === './' + currentPath)) {
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ── 2. FAQ ACCORDION ── */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var isOpen = item.classList.contains('open');

      // Cierra todos
      document.querySelectorAll('.faq-item.open').forEach(function (el) {
        el.classList.remove('open');
      });

      // Abre el clickeado si estaba cerrado
      if (!isOpen) {
        item.classList.add('open');
      }
    });

    // Accesibilidad: también responde a Enter/Space
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  /* ── 3. FADE-UP con IntersectionObserver (fallback: muestra todo) ── */
  if ('IntersectionObserver' in window) {
    var fadeEls = document.querySelectorAll('.fade-up');

    // Los que ya están en el hero se animan con CSS puro (no necesitan observer)
    var heroEl = document.querySelector('.hero');

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.animation = 'fadeUp 0.8s ease forwards';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    fadeEls.forEach(function (el) {
      // Los del hero ya se animan con CSS; no les aplicamos el observer
      if (heroEl && heroEl.contains(el)) return;
      // Reset para que el observer los controle
      el.style.opacity = '0';
      el.style.animation = 'none';
      observer.observe(el);
    });
  } else {
    // Fallback: muestra todo sin animación
    document.querySelectorAll('.fade-up').forEach(function (el) {
      el.style.opacity = '1';
    });
  }

  /* ── 4. TICKER — pausa en hover para accesibilidad ── */
  var tickerInner = document.querySelector('.ticker-inner');
  if (tickerInner) {
    tickerInner.addEventListener('mouseenter', function () {
      tickerInner.style.animationPlayState = 'paused';
    });
    tickerInner.addEventListener('mouseleave', function () {
      tickerInner.style.animationPlayState = 'running';
    });
    // Respeta prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      tickerInner.style.animation = 'none';
    }
  }

  /* ── 5. SMOOTH ANCHOR SCROLL (complementa scroll-behavior: smooth) ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var offset = nav ? nav.offsetHeight + 8 : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

})();
