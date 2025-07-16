// load-components.js
document.addEventListener('DOMContentLoaded', function () {
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
  // ====================================================================
  //  CONFIGURACIÓN CENTRALIZADA DEL HEADER
  //  Esta función se ejecuta DESPUÉS de que header.html se ha cargado.
  // ====================================================================

  // --- 1. Selección de todos los elementos del Header ---
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');
  
  // Elementos del nuevo buscador
  const header = document.querySelector('.header');
  const searchToggleBtn = document.getElementById('search-toggle-btn');
  const searchContainer = document.getElementById('search-container');
  const closeSearch = document.getElementById('close-search');
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('searchInput');

  // --- 2. Lógica para el menú hamburguesa ---
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      menu.classList.toggle('active');
      menuToggle.classList.toggle('active');
      document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : 'auto';
    });
  }

  // --- 3. Lógica para el buscador overlay ---
  if (searchToggleBtn && searchContainer && closeSearch && header) {
    searchToggleBtn.addEventListener('click', () => {
      searchContainer.classList.add('active');
      header.classList.add('search-active');
      searchInput.focus();
    });

    closeSearch.addEventListener('click', () => {
      searchContainer.classList.remove('active');
      header.classList.remove('search-active');
    });
  }

  // --- 4. Lógica del formulario de búsqueda ---
  if(searchForm && searchInput) {
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const valor = searchInput.value.toLowerCase().trim();
        const rutas = {
            "inicio": "index.html",
            "academias": "academias.html",
            "artículos": "articulos.html",
            "articulos": "articulos.html",
            "defensa personal": "defensa-personal.html",
            "contacto": "contactos.html",
            "nosotros": "nosotros.html",
            "politicas y privacidad": "politica-privacidad.html",
            "calculadora imc": "imc.html"
        };
        const url = rutas[valor];
        if (url) {
            window.location.href = url;
        } else {
            alert("Página no encontrada. Intenta con un nombre válido del menú.");
        }
    });
  }

  // --- 5. Efecto de scroll para encoger el header ---
  const handleScroll = () => {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // --- 6. Cerrar menús al hacer clic fuera de ellos ---
  document.addEventListener('click', (event) => {
    // Cierra el menú hamburguesa
    if (menu && menu.classList.contains('active') && !menu.contains(event.target) && !menuToggle.contains(event.target)) {
        menu.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
  });
}
