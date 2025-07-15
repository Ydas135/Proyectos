// load-components.js
document.addEventListener('DOMContentLoaded', function() {
  // Cargar header
  fetch('components/header.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('afterbegin', data);
      setupHeader();
    });

  // Cargar footer
  fetch('components/footer.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('beforeend', data);
    });
});

function setupHeader() {
  // Función para el buscador
  function redirigirPagina() {
    const valor = document.getElementById("searchInput").value.toLowerCase();
    const rutas = {
      "inicio": "index.html",
      "academias": "academias.html",
      "artículos": "articulos.html",
      "defensa personal": "defensa-personal.html",
      "contacto": "contactos.html",
      "calculadora imc": "imc.html"
    };

    const url = rutas[valor];
    if (url) {
      window.location.href = url;
    } else {
      alert("Página no encontrada. Intenta con un nombre válido del menú.");
    }
    return false;
  }

  // Toggle del menú hamburguesa
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');
  
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      menu.classList.toggle('active');
      document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Efecto de scroll en el header
  window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }
  });
}