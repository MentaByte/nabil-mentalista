(function () {
  'use strict';

  // Usamos una constante en lugar de medir offsetHeight (evita reflow)
  var NAV_OFFSET = 80; 
  var nav = document.querySelector('nav');

  // Throttling básico para el scroll
  window.addEventListener('scroll', function() {
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }
  }, { passive: true });

  // Intersection Observer: Solo para elementos fuera del Hero
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    document.querySelectorAll('.fade-up:not(.hero .fade-up)').forEach(function(el) {
      obs.observe(el);
    });
  }

  // Smooth scroll simplificado
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var pos = target.getBoundingClientRect().top + window.pageYOffset - NAV_OFFSET;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }
    });
  });
})();
