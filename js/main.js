(function () {
  'use strict';

  // 1. Usar un valor fijo para el Nav (evita consultar offsetHeight que causa reflow)
  var NAV_OFFSET = 80; 

  // 2. Scroll con throttling básico (sin requestAnimationFrame si da problemas)
  var nav = document.querySelector('nav');
  window.addEventListener('scroll', function() {
    if (nav) {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // 3. Intersection Observer simplificado
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    // Solo observar lo que NO está en el hero para evitar saltos iniciales
    document.querySelectorAll('.fade-up:not(.hero .fade-up)').forEach(function(el) {
      observer.observe(el);
    });
  }

  // 4. Smooth Scroll sin cálculos geométricos complejos
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - NAV_OFFSET;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });
})();
