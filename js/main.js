(function () {
  'use strict';

  var nav = document.querySelector('nav');
  var navHeight = 0;

  // 1. Resolvemos el error de la línea 6:28 posponiendo la lectura geométrica
  window.addEventListener('load', function() {
    if (nav) navHeight = nav.offsetHeight;
  });

  /* ── NAV — Scroll optimizado con requestAnimationFrame ── */
  var ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── FADE-UP — Usando clases para evitar cálculos de estilo ── */
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(function (el) {
      if (!el.closest('.hero')) observer.observe(el);
    });
  }

  /* ── SMOOTH SCROLL — Usando el valor cacheado ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - (navHeight + 8);
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();
