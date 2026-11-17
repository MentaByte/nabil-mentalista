/* Nabil Mentalista — interacciones ligeras.
   Todo el contenido está en el HTML: si este script no corre,
   la página se ve completa y legible (mejora progresiva). */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* 1. Aparición suave de bloques */
  if (hasIO && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    document.querySelectorAll('.aparece').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.aparece').forEach(function (el) { el.classList.add('visible'); });
  }

  /* 2. Lista de talleres que se resalta según el taller visible */
  var enlaces = document.querySelectorAll('.temas-lista a');
  if (enlaces.length && hasIO) {
    var porId = {};
    enlaces.forEach(function (a) { porId[a.getAttribute('href').slice(1)] = a; });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          enlaces.forEach(function (a) { a.classList.remove('activo'); });
          var a = porId[e.target.id];
          if (a) a.classList.add('activo');
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    document.querySelectorAll('.tema[id]').forEach(function (el) { obs.observe(el); });
  }

  /* 3. Formulario que arma el mensaje de WhatsApp */
  document.querySelectorAll('form[data-whatsapp]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var d = new FormData(form);
      var lineas = [form.getAttribute('data-saludo') || 'Hola Nabil, quiero una propuesta para mi empresa.'];
      var campos = [['nombre', 'Nombre'], ['empresa', 'Empresa'], ['tema', 'Tema'], ['formato', 'Formato'],
                    ['participantes', 'Participantes'], ['fecha', 'Fecha y ciudad'], ['mensaje', 'Detalles']];
      campos.forEach(function (c) {
        var v = (d.get(c[0]) || '').toString().trim();
        if (v) lineas.push(c[1] + ': ' + v);
      });
      var url = 'https://wa.me/' + form.getAttribute('data-whatsapp') + '?text=' + encodeURIComponent(lineas.join('\n'));
      window.open(url, '_blank', 'noopener');
    });
  });
})();
