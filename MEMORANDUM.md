# MEMORANDUM — Página Web Personal · Uriel Arredondo

**URL:** https://glimpsingshut.github.io/  
**Fecha:** Junio 2026  
**Stack:** HTML · CSS · JavaScript vanilla (sin frameworks)

---

## Estructura del Proyecto

```
Pagina web/
├── index.html                  — Toda la estructura HTML de la página
├── style.css                   — Todos los estilos y animaciones
├── script.js                   — Toda la lógica interactiva
├── CV_Uriel_Arredondo.pdf      — CV descargable desde la sección Contact
├── GUIA.md                     — Guía de referencia rápida
├── MEMORANDUM.md               — Este archivo
├── .gitignore                  — Ignora archivos .DS_Store de macOS
└── images/
    ├── profile/
    │   └── Foto1.jpeg          — Foto de perfil (sección About me)
    └── hobbies/
        ├── food/               — Comida1-4, 6-8 (.JPG / .jpeg)
        ├── nature/             — Naturaleza1-8 (.JPEG / .JPG / .jpeg)
        └── concerts/           — Conciertos2-4 (.JPG / .jpeg)
```

> **Nota:** `Cómida5.JPG` existe en `images/hobbies/food/` pero no está referenciada en el HTML (foto sin usar).

---

## Secciones de la Página

### 1. Intro / Hyperspace (`#inicio` — antes de cargar)
Animación de entrada que cubre toda la pantalla con una lluvia de partículas de fuego tipo "hyperspace". Se activa automáticamente al abrir la página y desaparece con un fade-out tras ~3 segundos. Una vez que el overlay inicia su desvanecimiento, arranca la animación de Typewriter en el hero.

### 2. Navbar (barra superior fija)
- Logo SVG minimalista en el lado izquierdo (enlace al inicio).
- Links de navegación: About me · Projects · Hobbies · Contact.
- **Pill highlight:** una pastilla azul se desliza bajo el link activo al hacer hover.
- **Nav activo:** el link de la sección visible en pantalla recibe un glow neon azul (detectado con IntersectionObserver).
- **Sombra:** aparece cuando el usuario hace scroll hacia abajo (`scrollY > 50`).
- Botón de tema (oscuro/claro) en el lado derecho.
- Botón hamburger en mobile para abrir/cerrar el menú.

### 3. Hero (`#inicio`)
Primera sección visible. Contiene:
- **Eyebrow:** "Hello, I'm"
- **Nombre:** "Uriel Arredondo" con efecto de color en degradado naranja-azul.
- **Tagline:** "Technology Consultant · Engineer" con animación **Typewriter** — las letras aparecen una por una con timing humano (variación aleatoria + pausas en puntos y guiones), y al terminar aparece un flash neon intenso que se desvanece gradualmente.
- **Botón "View projects"** (naranja): shimmer animado + pulso de glow; lleva a la sección Projects.
- **Botón "Contact me"** (índigo): mismo shimmer + pulso desfasado 1.8 s; lleva a la sección Contact.
- **Scroll indicator:** línea vertical animada con label "scroll" que desaparece cuando el usuario baja más de 80px.

### 4. About me (`#sobre-mi`)
- **Foto de perfil** con borde giratorio animado (gradiente cónico naranja → azul → morado, loop infinito de 4 s).
- **Texto biográfico**: descripción de rol como Technology Consultant, experiencia en Qualtrics, y enfoque en AI, datos y transformación digital.
- **Skill tags**: lista de habilidades (AI, Engineering, Consulting, etc.) con efecto hover de glow.

### 5. Projects (`#proyectos`)
- Grid de 3 tarjetas de proyecto (actualmente con placeholders — listos para llenar con proyectos reales).
- Cada tarjeta tiene: imagen, categoría, título, descripción y links.
- **Efecto 3D tilt**: al mover el mouse sobre una tarjeta, esta rota en perspectiva 3D (rotateX + rotateY) siguiendo el cursor, con elevación y escala suave.
- Animación de entrada con `reveal` (fade-in desde abajo al hacer scroll).

### 6. Hobbies (`#hobbies`)
- Carrusel horizontal con 3 categorías: **Food, Places & Drinks** · **Nature** · **Live music**.
- Navegación entre categorías con flechas izquierda/derecha (neon naranja) y puntos indicadores. Sin auto-play: solo cambia manualmente.
- **Dentro de cada categoría (Opción C):** visor con foto destacada grande + tira horizontal de miniaturas debajo. Al hacer clic en una miniatura o usar las flechas laterales, cambia la foto principal. Contador "X / N" en la esquina.
- **Lightbox**: clic en cualquier foto principal la abre en pantalla completa con navegación prev/next y cierre con ESC o clic fuera.

### 7. Contact (`#contact`)
Diseñado para que un reclutador encuentre fácilmente todas las formas de contacto:
- **Badge de disponibilidad** ("Available for new opportunities") con punto verde parpadeante.
- **Título y descripción** breve.
- **Meta info**: ubicación (México, open to remote & relocation) y tiempo de respuesta.
- **4 tarjetas de contacto** en grid 2×2:
  - **Email** → `uarredondov@hotmail.com`
  - **LinkedIn** → `linkedin.com/in/urielav`
  - **WhatsApp** → `+52 55 2406 7601` (abre wa.me directamente)
  - **Resume** → descarga `CV_Uriel_Arredondo.pdf`

---

## Efectos Visuales Globales

| Elemento | Descripción |
|---|---|
| **Aurora background** | 3 blobs de colores (naranja, azul, morado) con blur extremo, animados lentamente en el fondo. |
| **Neon waves** | Canvas con ondas sinusoidales en colores neon que se mueven en el fondo de la hero. |
| **Grain texture** | Ruido de grano de película sutil (SVG turbulence) sobre toda la página, animado a 0.35 s. Opacidad muy baja (~3.8%) para no distraer. |
| **Cursor trail** | En desktop: 10 puntos que siguen al cursor con efecto de caída (lerp encadenado). Los puntos del centro brillan en naranja neon. |
| **Cursor magnético** | El cursor se siente "atraído" al pasar cerca de botones y links. Al hacer clic hay un pulso de expansión. |
| **Section dividers** | Líneas de 1px con degradado (naranja → morado → transparente) entre secciones. |
| **Reveal al scroll** | Todos los bloques principales (about, projects, hobbies, contact) tienen fade-in desde abajo al entrar en viewport. |
| **Back-to-top** | Botón fijo en la esquina inferior derecha, aparece al bajar 400px. |
| **Scroll-to-top al cargar** | Al abrir/recargar la página, siempre empieza desde arriba (neutraliza el scroll restaurado por el navegador). |

---

## SEO y Meta Tags

Configurados en el `<head>` para que la página se vea bien al compartirla:
- **Open Graph**: título, descripción e imagen para LinkedIn, WhatsApp y Facebook.
- **Twitter Card**: `summary_large_image` con la misma foto de perfil.
- **Meta description**: texto indexable por Google.

---

## Pendientes / Cosas por Completar

- [ ] **Sección Projects**: reemplazar las 3 tarjetas placeholder con proyectos reales (imagen, título, descripción, links a GitHub/live).
- [ ] **Imagen de perfil OG**: actualmente usa `Foto1.jpeg`; actualizar si cambias la foto de perfil.
- [ ] **`Cómida5.JPG`**: decidir si se agrega al carrusel de Food o se elimina.
- [ ] **Favicon**: agregar un `favicon.ico` o `favicon.svg` para que aparezca en la pestaña del navegador.
