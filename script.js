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


// ===== 7. CUSTOM CURSOR =====
(function () {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  // Only activate on devices with a fine pointer (mouse)
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
  });

  (function animateRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('a, button, .btn, .carousel-btn').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('ring-expand'));
    el.addEventListener('mouseleave', () => ring.classList.remove('ring-expand'));
  });
})();


// ===== 8. HYPERSPACE — Intro animation =====
(function () {
  const overlay = document.getElementById('fire-overlay');
  const canvas  = document.getElementById('fire-canvas');
  if (!overlay || !canvas) return;

  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  const W = () => canvas.width;
  const H = () => canvas.height;

  // ---- Star ----
  const NUM_STARS = 320;
  const stars = [];

  class Star {
    constructor() { this.reset(true); }
    reset(initial = false) {
      const angle = Math.random() * Math.PI * 2;
      // initial stars spread across screen; new ones spawn near center
      const r = initial ? Math.random() * Math.max(W(), H()) * 0.5 : Math.random() * 12;
      this.x  = W()/2 + Math.cos(angle) * r;
      this.y  = H()/2 + Math.sin(angle) * r;
      this.angle = Math.atan2(this.y - H()/2, this.x - W()/2);
      this.speed = 0.4 + Math.random() * 0.8;
      this.size  = Math.random() * 1.2 + 0.3;
      this.brightness = 0.5 + Math.random() * 0.5;
      // previous position for streak
      this.px = this.x;
      this.py = this.y;
    }
    update(warp) {
      this.px = this.x;
      this.py = this.y;
      const spd = this.speed * (1 + warp * 28);
      this.x += Math.cos(this.angle) * spd;
      this.y += Math.sin(this.angle) * spd;
      this.speed += warp * 0.3;
    }
    draw(warp) {
      const cx = W()/2, cy = H()/2;
      const dist = Math.hypot(this.x - cx, this.y - cy);
      const a = Math.min(1, dist / 60) * this.brightness;
      if (a <= 0) return;

      // streak from previous pos to current
      const grad = ctx.createLinearGradient(this.px, this.py, this.x, this.y);
      // color: white-blue tones
      const blue = Math.round(180 + warp * 75);
      grad.addColorStop(0, `rgba(180,210,${blue},0)`);
      grad.addColorStop(1, `rgba(255,255,255,${a})`);

      const lineW = this.size * (1 + warp * 3);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.beginPath();
      ctx.moveTo(this.px, this.py);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = lineW;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();
    }
    isOffScreen() {
      return this.x < -80 || this.x > W()+80 || this.y < -80 || this.y > H()+80;
    }
  }

  for (let i = 0; i < NUM_STARS; i++) stars.push(new Star());

  // ---- Flash ----
  let flashAlpha = 0;

  function drawFlash(alpha) {
    if (alpha <= 0) return;
    const cx = W()/2, cy = H()/2;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W(), H()) * 0.7);
    g.addColorStop(0,   `rgba(255,255,255,${alpha})`);
    g.addColorStop(0.15,`rgba(180,220,255,${alpha * 0.7})`);
    g.addColorStop(0.4, `rgba(60,120,255,${alpha * 0.3})`);
    g.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W(), H());
    ctx.restore();
  }

  // ---- Timing ----
  // Phase 0 (0–1.8s): slow drift, stars emerging
  // Phase 1 (1.8–3.2s): warp acceleration
  // Phase 2 (3.2–3.6s): peak warp + flash
  // Phase 3: fade overlay → page revealed
  const DRIFT_DUR  = 1800;
  const WARP_DUR   = 1400;
  const FLASH_DUR  = 400;
  const FADE_DELAY = 60;

  let phase = 0, startTime = null, warpStart = null, flashStart = null, doneTime = null;

  // rAF + setTimeout fallback
  let _rafBroken = false, _pendingRaf = null;
  function scheduleNext() {
    let fired = false;
    _pendingRaf = requestAnimationFrame(ts => { fired = true; loop(ts); });
    if (!_rafBroken) {
      setTimeout(() => {
        if (!fired) { _rafBroken = true; cancelAnimationFrame(_pendingRaf); loop(performance.now()); }
      }, 50);
    }
  }
  function cancelLoop() { cancelAnimationFrame(_pendingRaf); _pendingRaf = null; }

  function loop(ts) {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;

    ctx.clearRect(0, 0, W(), H());
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W(), H());

    let warp = 0;

    if (phase === 0) {
      // slow drift
      warp = 0;
      if (elapsed >= DRIFT_DUR) { phase = 1; warpStart = ts; }

    } else if (phase === 1) {
      // acceleration: warp 0 → 1
      const wp = Math.min((ts - warpStart) / WARP_DUR, 1);
      warp = wp * wp * wp; // ease-in cubic — starts slow, builds intensity
      if (wp >= 1) { phase = 2; flashStart = ts; }

    } else if (phase === 2) {
      // peak warp + flash
      warp = 1;
      const fp = Math.min((ts - flashStart) / FLASH_DUR, 1);
      // flash peaks at fp=0.3 then fades
      flashAlpha = fp < 0.3 ? fp / 0.3 : 1 - (fp - 0.3) / 0.7;
      if (fp >= 1) { phase = 3; doneTime = ts; }

    } else if (phase === 3) {
      if (ts - doneTime >= FADE_DELAY) {
        overlay.classList.add('fade-out');
        overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
        cancelLoop();
        return;
      }
    }

    // Update & draw stars
    for (let i = 0; i < stars.length; i++) {
      stars[i].update(warp);
      stars[i].draw(warp);
      if (stars[i].isOffScreen()) stars[i].reset(false);
    }

    drawFlash(flashAlpha);

    scheduleNext();
  }

  scheduleNext();
})();

