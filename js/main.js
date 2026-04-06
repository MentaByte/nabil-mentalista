(function () {
  'use strict';

  var nav = document.querySelector('nav');
  // Cacheamos el alto del nav para evitar consultas repetitivas al DOM
  var navHeight = nav ? nav.offsetHeight : 0;

  /* ── 1. NAV — scroll optimizado ── */
  var ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        if (nav) {
          nav.classList.toggle('scrolled', window.scrollY > 40);
        }
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── 2. MARCAR LINK ACTIVO ── */
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && (href === currentPath || href === './' + currentPath)) {
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ── 3. FAQ ACCORDION (Optimizado) ── */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var isOpen = item.classList.contains('open');
      
      // Cerrar otros de forma eficiente
      var activeItems = document.querySelectorAll('.faq-item.open');
      for(var i = 0; i < activeItems.length; i++) {
        activeItems[i].classList.remove('open');
      }

      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── 4. FADE-UP (Mejora de rendimiento) ── */
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Usamos clases CSS en lugar de modificar .style directamente
            entry.target.classList.add('visible'); 
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll('.fade-up').forEach(function (el) {
      if (el.closest('.hero')) return;
      observer.observe(el);
    });
  }

  /* ── 5. SMOOTH SCROLL (Sin causar Reflow forzado) ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = anchor.getAttribute('href');
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();

      // Usamos el valor cacheado de navHeight
      var top = target.getBoundingClientRect().top + window.pageYOffset - (navHeight + 8);
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();
