(function () {
  'use strict';

  // Usamos una constante para el alto del nav (aprox 80px) para evitar 'offsetHeight' (Reflow)
  var NAV_FIXED_HEIGHT = 80; 
  var nav = document.querySelector('nav');

  /* ── NAV — Scroll con rAF throttle, sin leer propiedades geométricas ── */
  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        if (nav) {
          if (window.scrollY > 40) {
            nav.classList.add('scrolled');
          } else {
            nav.classList.remove('scrolled');
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ── FADE-UP — Solo para elementos que NO están en el Hero ── */
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    // IMPORTANTE: No observar elementos del Hero para evitar saltos visuales
    document.querySelectorAll('.fade-up:not(.hero .fade-up)').forEach(function(el) {
      observer.observe(el);
    });
  }

  /* ── SMOOTH SCROLL — Usando el offset fijo ── */
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.pageYOffset - NAV_FIXED_HEIGHT;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
})();
