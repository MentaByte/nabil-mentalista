// Toggle del menú móvil
document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');
  
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('show');
      // Cambiar ícono del botón
      toggle.textContent = menu.classList.contains('show') ? '✕' : '☰';
    });
    
    // Cerrar menú al hacer clic en un enlace (solo en móvil)
    if (window.innerWidth <= 768) {
      const menuLinks = menu.querySelectorAll('a');
      menuLinks.forEach(link => {
        link.addEventListener('click', () => {
          menu.classList.remove('show');
          toggle.textContent = '☰';
        });
      });
    }
  }
  
  // Efecto de scroll suave para enlaces internos (si los hubiera)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Añadir clase de scroll al header
  window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
    } else {
      header.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    }
  });
});
