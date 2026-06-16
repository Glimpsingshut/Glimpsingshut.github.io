# Guía: Tu página web paso a paso

## Estructura de archivos

```
Pagina web/
├── index.html     ← La estructura de la página (el "esqueleto")
├── style.css      ← El diseño y los colores (el "look")
├── script.js      ← La interactividad (animaciones, menú)
├── images/        ← Carpeta para tus fotos e imágenes
│   ├── foto.jpg
│   ├── proyecto1.jpg
│   └── ...
└── GUIA.md        ← Este archivo
```

---

## Paso 1 — Abrir en VS Code

1. Abre VS Code
2. Archivo → Abrir carpeta → selecciona la carpeta "Pagina web"
3. Verás todos los archivos en el panel izquierdo

**Extensiones recomendadas** (instálalas desde el ícono de bloques en VS Code):
- **Live Server** (Ritwick Dey) — abre tu página en el navegador y se actualiza al guardar
- **Prettier** — formatea el código automáticamente
- **Auto Rename Tag** — cuando cambias una etiqueta HTML, cambia el cierre automáticamente

---

## Paso 2 — Ver la página en vivo

1. Instala la extensión **Live Server**
2. Abre `index.html`
3. Haz clic derecho → "Open with Live Server"
4. Se abrirá en tu navegador en `http://127.0.0.1:5500`
5. Cada vez que guardes (Cmd+S / Ctrl+S), el navegador se actualiza automáticamente

---

## Paso 3 — Personalizar el contenido

### En `index.html`:
- **Tu nombre**: Busca "Sherlin" y reemplázalo
- **Tu descripción**: Línea con `hero-tagline` — pon tu rol real
- **Sobre mí**: Los dos `<p>` dentro de `about-text`
- **Habilidades**: La lista `<ul class="skills-list">`
- **Proyectos**: Cambia nombre, descripción y links de cada tarjeta
- **Email**: El link `href="mailto:..."` en la sección de contacto
- **LinkedIn/GitHub**: Los links al final de la sección contacto

### Agregar tus fotos:
1. Guarda tus imágenes en la carpeta `images/`
2. Nómbralas `foto.jpg`, `proyecto1.jpg`, etc.
3. O cambia el `src="images/..."` en el HTML por el nombre que uses

---

## Paso 4 — Personalizar colores

Abre `style.css` y busca `:root {` al principio. Ahí están todas las variables de color:

```css
--color-accent: #2d5a3d;   /* ← Cambia este por tu color favorito */
```

Ejemplos de colores de acento:
- Azul: `#1a56db`
- Morado: `#7c3aed`
- Rosa: `#db2777`
- Naranja: `#ea580c`
- Teal: `#0d9488`

---

## Paso 5 — Publicar en GitHub Pages

### Requisitos:
- Cuenta en [github.com](https://github.com) (gratis)
- Git instalado ([git-scm.com](https://git-scm.com))

### Pasos:

1. **Crea un repositorio en GitHub**
   - Ve a github.com → "New repository"
   - Nómbralo exactamente: `tu-usuario.github.io`
   - (reemplaza `tu-usuario` por tu nombre de usuario de GitHub)
   - Déjalo público
   - Clic en "Create repository"

2. **Conecta tu carpeta local con GitHub** (en la terminal de VS Code: Terminal → New Terminal)
   ```bash
   cd "ruta/a/tu/Pagina web"
   git init
   git add .
   git commit -m "Mi página web inicial"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/tu-usuario.github.io.git
   git push -u origin main
   ```

3. **Activa GitHub Pages**
   - En GitHub, ve a tu repositorio → Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `main` → `/root`
   - Guarda

4. **En 1-2 minutos tu página estará en:**
   `https://tu-usuario.github.io`

5. **Agrega ese link a tu LinkedIn** en la sección "Website" de tu perfil ✓

---

## Paso 6 — Actualizar la página en el futuro

Cuando hagas cambios en VS Code:
```bash
git add .
git commit -m "Descripción del cambio"
git push
```
GitHub Pages se actualiza automáticamente en ~1 minuto.

---

## Referencia rápida: estructura HTML

```html
<section>          ← Una sección de la página
  <div class="container">   ← Limita el ancho y centra
    <h2>Título</h2>         ← Título secundario
    <p>Texto</p>            ← Párrafo
    <a href="#">Link</a>    ← Enlace
  </div>
</section>
```

Los comentarios `<!-- así -->` en el HTML te explican qué hace cada parte.
