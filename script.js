// =============================================
// SCRIPT.JS — Interactividad de la página
// =============================================

// Siempre arrancar desde el top al cargar
history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

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


// ===== 2. ACTIVE NAV ON SCROLL =====
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(a => {
        a.classList.toggle('nav-active', a.getAttribute('href') === `#${id}`);
      });
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
})();


// ===== 2. NAV PILL HIGHLIGHT =====
(function () {
  const pill  = document.querySelector('.nav-pill');
  const links = document.querySelectorAll('.nav-links a');
  const nav   = document.querySelector('.nav-links');
  if (!pill || !links.length || !nav) return;

  function moveTo(el) {
    const navRect  = nav.getBoundingClientRect();
    const linkRect = el.getBoundingClientRect();
    pill.style.opacity   = '1';
    pill.style.width     = linkRect.width + 'px';
    pill.style.transform = `translateX(${linkRect.left - navRect.left - 6}px)`;
  }

  links.forEach(a => {
    a.addEventListener('mouseenter', () => moveTo(a));
  });

  nav.addEventListener('mouseleave', () => {
    pill.style.opacity = '0';
  });
})();


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

const scrollIndicator = document.querySelector('.scroll-indicator');

window.addEventListener('scroll', () => {
  const y = window.scrollY;

  navbar?.classList.toggle('scrolled', y > 50);

  // Scroll indicator desaparece suavemente al empezar a bajar
  if (scrollIndicator) {
    scrollIndicator.classList.toggle('hidden', y > 80);
  }
}, { passive: true });

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
document.querySelectorAll('.project-card').forEach((card, index) => {
  card.style.transitionDelay = `${index * 0.1}s`;
});


// ===== 4b. 3D TILT EN PROJECT CARDS =====
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease, box-shadow 0.3s ease';
      card.style.transform  = '';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
})();


// ===== 4c. TYPEWRITER EN HERO TAGLINE =====
(function () {
  const el      = document.querySelector('.tagline-fire');
  const overlay = document.getElementById('fire-overlay');
  if (!el) return;

  const text = el.textContent.trim();
  el.textContent = '';

  function humanDelay(char) {
    const base   = 160;
    const jitter = Math.random() * 80;
    const pause  = /[·\-,.]/.test(char) ? 220 : 0;
    return base + jitter + pause;
  }

  function flashHighlight() {
    el.classList.add('typewriter-flash');
    setTimeout(() => el.classList.remove('typewriter-flash'), 600);
  }

  function begin() {
    let i = 0;
    el.textContent = '';
    el.classList.add('typewriter');

    function type() {
      if (i < text.length) {
        el.textContent += text[i];
        setTimeout(type, humanDelay(text[i++]));
      } else {
        flashHighlight();
        setTimeout(() => el.classList.remove('typewriter'), 2800);
      }
    }
    setTimeout(type, 200);
  }

  if (overlay) {
    // Arranca en cuanto el overlay empieza su fade-out (no espera a que desaparezca)
    const obs = new MutationObserver(() => {
      if (overlay.classList.contains('fade-out')) {
        obs.disconnect();
        begin();
      }
    });
    obs.observe(overlay, { attributes: true, attributeFilter: ['class'] });
  } else {
    begin();
  }
})();


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
  btnPrev.addEventListener('click', () => goTo(current - 1));
  btnNext.addEventListener('click', () => goTo(current + 1));

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


// ===== 6. BACK TO TOP =====
(function () {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


// ===== 6. AÑO DINÁMICO EN EL FOOTER =====
// Actualiza el año automáticamente, así no tienes que cambiarlo cada año.
// (Opcional: si quieres usarlo, agrega un <span id="year"></span> en el footer)

const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}


// ===== 7. SLIDE VIEWER (B + C) & LIGHTBOX =====
(function () {

  // ── Slide viewer navigation ──
  document.querySelectorAll('.slide-viewer').forEach(viewer => {
    const isThumbMode = viewer.classList.contains('slide-viewer--thumbs');
    const imgContainer = isThumbMode
      ? viewer.querySelector('.slide-viewer-main .slide-viewer-images')
      : viewer.querySelector('.slide-viewer-images');

    const imgs    = Array.from(imgContainer.querySelectorAll('.slide-img'));
    const thumbs  = isThumbMode ? Array.from(viewer.querySelectorAll('.slide-thumb')) : [];
    const counter = viewer.querySelector('.slide-counter');
    const btnPrev = viewer.querySelector('.slide-nav--prev');
    const btnNext = viewer.querySelector('.slide-nav--next');
    let current   = 0;

    function goTo(i) {
      imgs[current].classList.remove('active');
      if (thumbs.length) thumbs[current].classList.remove('active');
      current = (i + imgs.length) % imgs.length;
      imgs[current].classList.add('active');
      if (thumbs.length) {
        thumbs[current].classList.add('active');
        thumbs[current].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
      if (counter) counter.textContent = `${current + 1} / ${imgs.length}`;
    }

    btnPrev?.addEventListener('click', e => { e.stopPropagation(); goTo(current - 1); });
    btnNext?.addEventListener('click', e => { e.stopPropagation(); goTo(current + 1); });
    thumbs.forEach((th, i) => th.addEventListener('click', () => goTo(i)));
  });

  // ── Lightbox ──
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightbox-img');
  const lbClose  = document.getElementById('lightbox-close');
  const lbPrev   = document.getElementById('lightbox-prev');
  const lbNext   = document.getElementById('lightbox-next');
  const backdrop = document.getElementById('lightbox-backdrop');
  if (!lightbox) return;

  let gallery = [];
  let index   = 0;

  function open(imgs, i) {
    gallery = imgs;
    show(i);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function show(i) {
    index = (i + gallery.length) % gallery.length;
    lbImg.classList.add('switching');
    setTimeout(() => {
      lbImg.src = gallery[index].src;
      lbImg.alt = gallery[index].alt;
      lbImg.classList.remove('switching');
    }, 180);
    lbPrev.classList.toggle('hidden', gallery.length <= 1);
    lbNext.classList.toggle('hidden', gallery.length <= 1);
  }

  // Click on active slide-img opens lightbox with all imgs in that viewer
  document.querySelectorAll('.slide-img').forEach(img => {
    img.addEventListener('click', () => {
      const allImgs = Array.from(img.closest('.slide-viewer-images').querySelectorAll('.slide-img'));
      const active  = allImgs.findIndex(el => el.classList.contains('active'));
      open(allImgs, active);
    });
  });

  lbClose.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  lbPrev.addEventListener('click', () => show(index - 1));
  lbNext.addEventListener('click', () => show(index + 1));

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
})();


// ===== 7. AURORA PARALLAX =====
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const blobA = document.querySelector('.aurora-blob--a');
  const blobB = document.querySelector('.aurora-blob--b');
  const blobC = document.querySelector('.aurora-blob--c');
  if (!blobA || !blobB || !blobC) return;

  let tx = 0, ty = 0; // target
  let ax = 0, ay = 0; // blob A current
  let bx = 0, by = 0; // blob B current
  let cx = 0, cy = 0; // blob C current

  document.addEventListener('mousemove', e => {
    // normalize -1 to 1 from center
    tx = (e.clientX / window.innerWidth  - 0.5) * 2;
    ty = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  (function tick() {
    // each blob interpolates at a different speed and depth
    ax += (tx * 38 - ax) * 0.04;
    ay += (ty * 28 - ay) * 0.04;

    bx += (tx * -28 - bx) * 0.03;
    by += (ty * -22 - by) * 0.03;

    cx += (tx * 18 - cx) * 0.05;
    cy += (ty * 22 - cy) * 0.05;

    blobA.style.translate = `${ax}px ${ay}px`;
    blobB.style.translate = `${bx}px ${by}px`;
    blobC.style.translate = `${cx}px ${cy}px`;

    requestAnimationFrame(tick);
  })();
})();


// ===== 8. NEON WAVES =====
(function () {
  const canvas = document.getElementById('neon-waves');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const waves = [
    { amp: 38, freq: 0.008, speed: 0.018, phase: 0,   yRatio: 0.55, color: '0,180,255',  lw: 1.8 },
    { amp: 28, freq: 0.013, speed:-0.014, phase: 2.1,  yRatio: 0.68, color: '160,0,255',  lw: 1.4 },
    { amp: 44, freq: 0.006, speed: 0.011, phase: 4.2,  yRatio: 0.78, color: '0,230,180',  lw: 1.2 },
    { amp: 20, freq: 0.017, speed:-0.022, phase: 1.0,  yRatio: 0.88, color: '226,105,74', lw: 1.0 },
  ];

  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    waves.forEach(w => {
      w.phase += w.speed;
      const baseY = H * w.yRatio;

      ctx.beginPath();
      for (let x = 0; x <= W; x += 3) {
        const y = baseY + Math.sin(x * w.freq + w.phase) * w.amp;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }

      ctx.strokeStyle = `rgba(${w.color}, 0.75)`;
      ctx.lineWidth   = w.lw;
      ctx.shadowColor = `rgba(${w.color}, 1)`;
      ctx.shadowBlur  = 14;
      ctx.stroke();

      // second pass — thinner inner glow
      ctx.strokeStyle = `rgba(${w.color}, 0.95)`;
      ctx.lineWidth   = w.lw * 0.35;
      ctx.shadowBlur  = 6;
      ctx.stroke();

      ctx.shadowBlur = 0;
    });

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();


// ===== 8. CUSTOM CURSOR — TRAIL =====
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const canvas = document.getElementById('cursor-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const TRAIL   = 10;
  const BASE_R  = 5;       // radius of head dot
  const COLOR   = [226, 105, 74]; // accent orange

  const positions = Array.from({ length: TRAIL }, () => ({ x: -100, y: -100 }));
  let mouse = { x: -100, y: -100 };
  let isHovering = false; // over a clickable element

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.querySelectorAll('a, button, .btn, .carousel-btn, .nav-links a').forEach(el => {
    el.addEventListener('mouseenter', () => isHovering = true);
    el.addEventListener('mouseleave', () => isHovering = false);
  });

  // Magnetic on buttons
  document.querySelectorAll('.btn, .carousel-btn').forEach(el => {
    el.style.transition = (el.style.transition || '') + ', translate 0.3s cubic-bezier(0.16,1,0.3,1)';
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.28;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.28;
      el.style.translate = `${dx}px ${dy}px`;
    });
    el.addEventListener('mouseleave', () => { el.style.translate = '0px 0px'; });
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Lerp chain
    positions[0].x += (mouse.x - positions[0].x) * 0.28;
    positions[0].y += (mouse.y - positions[0].y) * 0.28;
    for (let i = 1; i < TRAIL; i++) {
      positions[i].x += (positions[i - 1].x - positions[i].x) * 0.38;
      positions[i].y += (positions[i - 1].y - positions[i].y) * 0.38;
    }

    // Draw dots from tail to head (smallest/most transparent first)
    for (let i = TRAIL - 1; i >= 0; i--) {
      const t      = 1 - i / TRAIL;           // 0 = tail, 1 = head
      const r      = BASE_R * (isHovering ? 1.5 : 1) * (0.25 + t * 0.75);
      const alpha  = t * (isHovering ? 0.9 : 0.75);
      const [R, G, B] = COLOR;

      ctx.beginPath();
      ctx.arc(positions[i].x, positions[i].y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${R},${G},${B},${alpha.toFixed(2)})`;
      ctx.shadowColor = `rgba(${R},${G},${B},${(alpha * 0.6).toFixed(2)})`;
      ctx.shadowBlur = i === 0 ? 10 : 4;
      ctx.fill();
    }

    ctx.shadowBlur = 0;
    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
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

