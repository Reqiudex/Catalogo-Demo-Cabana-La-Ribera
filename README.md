# Catálogo Demo Cabaña La Ribera

Catálogo digital en formato libro del **2do Gran Remate San Rafael de Velasco — Toros y Vaquillas Premium** de **Cabaña La Ribera** (Nelore · Nelore Mocho), construido a partir de <https://www.cabanalaribera.com/>.

Página estática: HTML + CSS + JavaScript sin frameworks. Se abre con `index.html`.

- **Libro 3D**: dos páginas en escritorio, una en celular. Se navega tocando los bordes, deslizando, con las flechas del teclado (← → Inicio Fin) y con el selector «Ir a la página».
- **44 páginas**: portada, bienvenida, agenda, 38 lotes, patrocinadores y auspiciadores, contacto y contraportada.
- **Videos** siempre silenciados, en bucle y solo cuando su página está visible; se descargan de forma perezosa y se detienen al salir.
- **Música de fondo** elegante generada en el navegador (`js/music.js`, Web Audio): empieza con el primer toque y se apaga con el botón **Silenciar música**. No descarga archivos ni tiene derechos de autor.
- **Datos de referencia**: nombre, nacimiento, padre, madre, DEP y descripción (sin precios: es un remate) son de ejemplo y llevan el aviso `avisoDatos`; reemplázalos en `data/catalog.js`.
- **Sellos animados** en SVG, diseñados para La Ribera (`js/seals.js`): `premium`, `nelore`, `registro`, `internacional`, `combo`, `top`, `genotipado`, `garantia`.
- Caché: CSS y JS se sirven sin versión en la URL y con 5 minutos de caché; Cloudflare renueva su copia a los 5 minutos, pero la zona tiene "Browser Cache TTL" de 4 h, así que un navegador que ya los tenía puede usarlos hasta 4 h (ver auditoría del 18/11). Las imágenes se guardan 7 días: **si cambias una imagen, cámbiale el nombre de archivo** y actualiza la referencia. No uses `?v=`: la copia de emergencia del guardián de Cloudflare descarta las URLs con `?`.
- Respeta `prefers-reduced-motion` y tiene foco visible para teclado.

## Estructura

```
index.html          página principal
css/style.css       diseño (paleta bronce/ámbar, Cinzel + Cormorant + Montserrat)
js/book.js          motor del libro y páginas
js/seals.js         sellos SVG animados
data/catalog.js     TODO el contenido editable
data/raw/           respuestas originales de la API del sitio y HTML renderizado
assets/             logos, fondos, patrocinadores y miniaturas de los videos
videos/             video de portada (banner-720.mp4 escritorio, banner-480.mp4 móvil) y, si los agregas, lote-01.mp4 ...
tools/extraer.js    script Playwright usado para la extracción
```

## Cómo editar los datos

Todo sale de `data/catalog.js` (no hay que tocar el código). Abre el archivo y edita:

- `evento`: títulos, fechas, lugar, textos de bienvenida.
- `agenda`: eventos con fecha (`AAAA-MM-DD`), hora y lugar.
- `contacto`, `patrocinadores`, `auspiciadores`, `creditos`.
- `lotes`: un objeto por lote:

```js
{
  n: 5,                       // número de lote
  name: "Nombre del ejemplar",// null = no se muestra
  registro: "JHVM 24005",     // null = «Por confirmar»
  nacimiento: "12/03/2024",
  padre: "…", madre: "…",
  geneticos: "DEP … / ABVol …", // opcional
  video: "https://youtu.be/ID", // YouTube o ruta local (ver abajo)
  poster: "assets/poster-lote-05.jpg",
  seals: [ {t:"premium"}, {t:"nelore"}, {t:"registro"} ],
  combo: "2+1"                // texto informativo
}
```

### Sellos

En `seals` pon uno o varios. Parámetros opcionales `text` y `sub`:

| Sello | Ejemplo |
|---|---|
| Premium | `{t:"premium"}` |
| Raza | `{t:"nelore"}` |
| Registro (usa el campo `registro`) | `{t:"registro"}` |
| Genética internacional | `{t:"internacional"}` |
| Combo | `{t:"combo", text:"2+1", sub:"COMBO"}` · `{t:"combo", text:"3+1"}` |
| Ranking | `{t:"top", text:"1%"}` |
| Genotipado | `{t:"genotipado"}` |
| Garantía | `{t:"garantia", text:"GARANTÍA"}` |

Para crear un sello nuevo, añade una función al objeto `T` de `js/seals.js` y usa su nombre en `t`.

## Cómo agregar videos

1. **YouTube** (como en el sitio original): pon el enlace en `video` (`https://youtu.be/ID`). Es lo que usa hoy el catálogo.
2. **Archivo propio**: copia `lote-05.mp4` en `videos/` y pon `video: "videos/lote-05.mp4"`. Se reproduce con `<video muted loop playsinline>`. Usa H.264/AAC para que funcione en todos los navegadores. Si un archivo pesa más de 100 MB, usa [Git LFS](https://git-lfs.com) o aloja el video en otro servicio y enlaza su URL.
3. **HLS (.m3u8)**: conviértelo a mp4 con `ffmpeg -i entrada.m3u8 -c copy lote-05.mp4`.

> Los embeds de YouTube necesitan abrirse desde `http(s)://` (por ejemplo GitHub Pages o `python3 -m http.server`). Si abres `index.html` con doble clic (`file://`), YouTube bloquea el reproductor: el catálogo muestra entonces la miniatura con el botón «Ver en YouTube». El video de portada y los `.mp4` locales funcionan igual.

## Cómo probarlo en local

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Cómo publicar (GitHub Pages)

1. Sube el repositorio a GitHub (rama `main`).
2. **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `/ (root)`**.
3. Tras un minuto el catálogo queda en `https://<usuario>.github.io/Catalogo-Demo-Cabana-La-Ribera/`.

## Despliegue con Docker / Coolify

El repo incluye `Dockerfile` (nginx, puerto interno **8080**) y `nginx.conf`.

```bash
docker build -t catalogo-la-ribera .
docker run -p 8097:8080 catalogo-la-ribera
```

En Coolify: *New Resource → Public Repository* con este repo, rama `main`, *Build Pack: Dockerfile*, puerto expuesto `8080`.

## Animaciones

- Pantalla de carga con el logo y barra de avance real: espera tipografías, imágenes de las primeras páginas (ya decodificadas) y los primeros cuadros del video de portada, con un mínimo de ~2,4 s la primera vez (0,9 s al volver) y un máximo de 9 s. Un toque la salta.
- Portada: marco que se dibuja, logo y título que enfocan, fecha con brillo dorado, video con zoom lento y polvo dorado flotante.
- Cada página revela su contenido en cascada al quedar visible; el encabezado del lote se desplaza suavemente y el marco del video tiene un destello.
- Al apuntar un borde con el mouse, la esquina de la hoja se levanta.
- Todo se desactiva con `prefers-reduced-motion`.

## Rendimiento y modo ligero

- **Videos de los lotes**: se ven completos en 16:9 (sin zoom ni recortes) y los pósters están recortados a 16:9 exacto. Cada video tiene el botón **Pantalla completa** (`js/player.js`): abre el video con controles y sonido, pide pantalla completa real donde el navegador lo permite (en móvil gira a horizontal) y pausa la música mientras tanto. Tocar un video que ya se reproduce hace lo mismo.
- Las imágenes de las páginas cercanas se precargan en segundo plano para que al pasar la hoja ya estén listas.

En equipos modestos el catálogo pasa solo a **modo ligero** (`js/perf.js` + medición en `js/fx.js`):

- Se activa directo con ≤ 2 GB de memoria, ≤ 2 núcleos, ahorro de datos o conexión 2G/3G; si no, `fx.js` mide los fotogramas de la portada y lo activa si van por debajo de ~32 por segundo.
- Quita las animaciones perpetuas, desenfoques, sombras filtradas y el polvo dorado; la portada queda fija y los videos de los lotes se cargan al tocarlos.
- Forzar: `?lite=1` (siempre ligero), `?lite=0` (nunca), `?lite=auto` (volver a automático). Se recuerda en el navegador; la medición automática, durante 7 días.

Para todos: el polvo dorado usa un sprite a 30 fps, en escritorio solo se pintan las hojas visibles, YouTube se carga cuando termina el giro de página y el video de portada pesa 2,5 MB (720p) o 1,1 MB (480p, móvil).

## Créditos y contenido

Textos, logos, imágenes y videos pertenecen a Cabaña La Ribera y sus patrocinadores; se usan aquí como demostración. Sitio original desarrollado por Ganadería 360.
