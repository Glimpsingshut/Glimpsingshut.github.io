// =============================================
// SCRIPT.JS — Interactividad de la página
// =============================================

// ===== 1. TOGGLE DARK / LIGHT MODE =====
// Guarda la preferencia en localStorage para que se recuerde al recargar

const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Al cargar, revisa si el usuario ya eligió un tema antes
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle?.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});


// ===== 2. MENÚ HAMBURGUESA (móvil) — antes era 1 =====
// Busca el botón y los links en el HTML
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    // Alterna las clases 'active' y 'open' para mostrar/ocultar el menú
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
}

// Cierra el menú al hacer clic en un link (en móvil)
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle?.classList.remove('active');
    navLinks?.classList.remove('open');
  });
});


// ===== 2. REVEAL AL HACER SCROLL =====
// IntersectionObserver "vigila" los elementos con clase .reveal
// y les agrega .visible cuando aparecen en pantalla.
// Eso activa la animación CSS definida en style.css.

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Una vez visible, dejamos de observarlo para no repetir la animación
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,   // Se activa cuando el 10% del elemento es visible
    rootMargin: '0px 0px -40px 0px' // Margen inferior negativo: espera un poco más
  }
);

// Observa todos los elementos con clase .reveal
document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});


// ===== 3. NAVBAR — Sombra al hacer scroll =====
// Agrega una clase al navbar cuando el usuario baja de 50px
// para reforzar visualmente la barra de navegación.

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
});

// Agrega esto al CSS si quieres el efecto de sombra:
// .navbar.scrolled { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
// (ya está incluido abajo con un style dinámico)

const style = document.createElement('style');
style.textContent = `
  [data-theme="dark"] .navbar.scrolled  { box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
  [data-theme="light"] .navbar.scrolled { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
`;
document.head.appendChild(style);


// ===== 4. ANIMACIÓN DE DELAY ESCALONADO EN TARJETAS =====
// Hace que cada tarjeta de proyecto aparezca un poco después
// de la anterior, dando un efecto de cascada.

document.querySelectorAll('.project-card').forEach((card, index) => {
  card.style.transitionDelay = `${index * 0.1}s`;
});


// ===== 5. CARRUSEL DE HOBBIES =====
// Funciona así:
//   - Los slides están en fila. Mover la pista X% a la izquierda muestra el slide X.
//   - Los botones prev/next suman o restan el índice activo.
//   - Los dots se generan automáticamente según cuántos slides haya.
//   - Auto-play: avanza solo cada 5 segundos; se pausa al pasar el mouse.
//   - Soporte de swipe táctil para móvil.

(function () {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return; // Si no existe el carrusel, no hace nada

  const track      = carousel.querySelector('.carousel-track');
  const slides     = carousel.querySelectorAll('.carousel-slide');
  const dotsContainer = carousel.querySelector('.carousel-dots');
  const btnPrev    = carousel.querySelector('.carousel-btn--prev');
  const btnNext    = carousel.querySelector('.carousel-btn--next');

  let current = 0;        // Índice del slide visible
  let autoPlayTimer;

  // --- Crea los dots dinámicamente ---
  // Uno por cada slide; no tienes que escribirlos a mano en el HTML
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    dot.setAttribute('aria-label', `Ir al slide ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.carousel-dot');

  // --- Función principal: ir a un slide ---
  function goTo(index) {
    // Envuelve: si pasas del último, vuelves al primero (y viceversa)
    current = (index + slides.length) % slides.length;

    // Mueve la pista: translateX(-100% * índice)
    track.style.transform = `translateX(-${current * 100}%)`;

    // Actualiza los dots
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  // --- Botones ---
  btnPrev.addEventListener('click', () => { goTo(current - 1); resetAutoPlay(); });
  btnNext.addEventListener('click', () => { goTo(current + 1); resetAutoPlay(); });

  // --- Auto-play cada 5 segundos ---
  function startAutoPlay() {
    autoPlayTimer = setInterval(() => goTo(current + 1), 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  startAutoPlay();

  // Pausa al pasar el mouse por encima
  carousel.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
  carousel.addEventListener('mouseleave', startAutoPlay);

  // --- Soporte de swipe táctil (móvil) ---
  let touchStartX = 0;
  let touchEndX   = 0;

  carousel.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  carousel.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {   // Umbral mínimo de 50px para detectar swipe
      goTo(diff > 0 ? current + 1 : current - 1);
      resetAutoPlay();
    }
  }, { passive: true });

})(); // IIFE: el código se ejecuta inmediatamente y no contamina el scope global


// ===== 6. AÑO DINÁMICO EN EL FOOTER =====
// Actualiza el año automáticamente, así no tienes que cambiarlo cada año.
// (Opcional: si quieres usarlo, agrega un <span id="year"></span> en el footer)

const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
