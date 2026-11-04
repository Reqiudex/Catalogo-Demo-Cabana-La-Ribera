# Catálogo Demo Cabaña La Ribera

Catálogo digital en formato libro del **2do Gran Remate San Rafael de Velasco — Toros y Vaquillas Premium** de **Cabaña La Ribera** (Nelore · Nelore Mocho), construido a partir de <https://www.cabanalaribera.com/>.

Página estática: HTML + CSS + JavaScript sin frameworks. Se abre con `index.html`.

- **Libro 3D**: dos páginas en escritorio, una en celular. Se navega tocando los bordes, deslizando, con las flechas del teclado (← → Inicio Fin) y con el selector «Ir a la página».
- **44 páginas**: portada, bienvenida, agenda, 38 lotes, patrocinadores y auspiciadores, contacto y contraportada.
- **Videos** con reproducción automática (silenciados, en bucle) solo cuando su página está visible; se descargan de forma perezosa y se detienen al salir. Botón global **Activar sonido**.
- **Sellos animados** en SVG, diseñados para La Ribera (`js/seals.js`): `premium`, `nelore`, `registro`, `internacional`, `combo`, `top`, `genotipado`, `garantia`.
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
videos/             video de portada (banner.mp4) y, si los agregas, lote-01.mp4 ...
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
  precio: "Base Bs. …",         // opcional
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
docker run -p 8096:8080 catalogo-la-ribera
```

En Coolify: *New Resource → Public Repository* con este repo, rama `main`, *Build Pack: Dockerfile*, puerto expuesto `8080`.

## Animaciones

- Telón de entrada con el logo (una vez por sesión; clic o tecla para saltarlo).
- Portada: marco que se dibuja, logo y título que enfocan, fecha con brillo dorado, video con zoom lento y polvo dorado flotante.
- Cada página revela su contenido en cascada al quedar visible; el encabezado del lote se desplaza suavemente y el marco del video tiene un destello.
- Al apuntar un borde con el mouse, la esquina de la hoja se levanta.
- Todo se desactiva con `prefers-reduced-motion`.

## Créditos y contenido

Textos, logos, imágenes y videos pertenecen a Cabaña La Ribera y sus patrocinadores; se usan aquí como demostración. Sitio original desarrollado por Ganadería 360.
