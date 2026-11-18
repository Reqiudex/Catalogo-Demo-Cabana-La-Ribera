# Auditoría de interfaz y experiencia de uso — 18/11/2026

Alcance: catálogo de Cabaña La Ribera (`cabanalaribera.cerice360.com` y `laribera.cerice360.com`, app
`catalogo-la-ribera` en Coolify, y la copia en GitHub Pages). Rama `mejoras/auditoria-uiux-2026-11-18`.

## Método

- Copia local idéntica a producción (misma imagen Docker, solo en `127.0.0.1`) de `main` (antes) y de la rama
  (después). Producción sigue en `9e4045c`: el commit `4946584` (videos completos, pantalla completa) nunca se
  desplegó, así que la referencia "antes" es `main`.
- `pruebas/auditar.js`: capturas en 360×800, 768×1024 (táctil), 1366×768 y 1920×1080 de portada, bienvenida,
  agenda, dos lotes, patrocinadores, contacto y contraportada; axe-core 4.10 con WCAG 2.0/2.1/2.2 A y AA;
  desbordes horizontales; áreas táctiles; letra mínima; teclado y visor a pantalla completa.
- `pruebas/encaje.js`: las 44 páginas en 8 tamaños de teléfono y tableta y 5 de portátil y monitor.
- Lighthouse 11 (móvil con 4G lento simulado y CPU ×4, mediana de 3 pasadas; escritorio).
- Cabeceras con `curl -I`, y simulación de la copia de emergencia del guardián con su mismo `wget`.

## Hallazgos, ordenados por impacto

### Alto

1. **La copia de emergencia no sirve.** El guardián de Cloudflare copia la web con `wget` descartando las URLs
   con `?`. Como todo el CSS, el JS y las imágenes se pedían con `?v=…`, la copia de laribera tiene 4 archivos
   (`index.html` y 3 imágenes): si el servidor cae, el catálogo se ve en blanco.
2. **Ficha del lote ilegible en móvil.** En un teléfono de 360 px las etiquetas miden 6,7 px, la nota 7,1 px,
   los valores (registro, fechas, padres) 9-10 px y el botón "Consultar" 9 px. Los teléfonos altos tenían
   entre 46 y 82 px de altura sin usar bajo la página.
3. **Primer pintado bloqueado por Google Fonts** (~0,9 s en móvil) y tipografía que cambia al cargar (CLS 0,095
   en móvil).

### Medio

4. Botón de música sin nombre accesible en móvil (el rótulo se ocultaba con `display:none`) y selector
   "Ir a la página" sin nombre en móvil (WCAG 4.1.2).
5. En móvil la barra de navegación se parte en dos filas en páginas con nombre largo ("43 · Contacto"): el
   botón "›" cae debajo.
6. Enlaces de teléfono y correo de 16-21 px de alto y botón "Pantalla completa" de 21 px en escritorio
   (WCAG 2.5.8, mínimo 24 px).
7. Desplazamiento horizontal en la contraportada a 1920 px (el libro se corre medio libro a la derecha).
8. Imágenes de portada sin `width`/`height`.
9. La pantalla de carga esperaba imágenes de páginas que no se ven al entrar y al video de portada (hasta 5 s
   más en red lenta), con 2,4 s mínimos la primera vez.

### Bajo

10. Cabeceras de seguridad ausentes en CSS, JS e imágenes (el `add_header` de cada `location` anula las del
    servidor) y sin `Cross-Origin-Opener-Policy`.
11. Sin `robots.txt` propio; `/data/raw/` protegido solo para algunas extensiones.
12. Etiquetas de la ficha a 7 px también en escritorio de 1366 px.

## Correcciones aplicadas

| # | Corrección |
|---|---|
| 1 | CSS, JS y datos con rutas simples (sin `?v=`) y caché de 5 minutos, que Cloudflare respeta. Las imágenes que cita `data/catalog.js` también van sin `?v=`, así que el guardián las recoge. **Si cambia una imagen, se le cambia el nombre.** Funciona igual en GitHub Pages. |
| 2 | En teléfonos alargados (proporción ≤ 0,48) la página usa la altura libre y la letra de la ficha crece: valores 11,9-13,7 px, etiquetas 8,7-10 px, nota 8,8-10,2 px, botón 10,6-12,2 px. En el resto, etiquetas y nota algo mayores. |
| 3 | Cinzel, Cormorant Garamond y Montserrat autoalojadas (subconjunto latino con tildes y ñ, 4 archivos, 140 KB, caché de un año) y precarga de Cinzel, Montserrat y el póster de portada. La política de seguridad ya no admite fuentes externas. |
| 4 | Rótulos del botón de música y del selector ocultos solo visualmente: los lectores de pantalla los leen. |
| 5 | El selector se encoge: la barra queda en una sola fila. |
| 6 | Enlaces de contacto y botón "Pantalla completa" con al menos 24 y 28 px de alto. |
| 7 | `overflow-x: clip` en la página. |
| 8 | `width`/`height` en logo y título de portada y en el logo del telón. |
| 9 | El telón espera solo lo que se ve al abrirse (tipografías e imágenes de la portada; el póster sustituye al video mientras carga) y dura 1,5 s mínimos (0,7 s al volver). |
| 10-11 | Cabeceras de seguridad en un archivo común incluido en cada `location`, COOP, `robots.txt` y `location ^~ /data/raw/`. |
| 12 | Etiquetas de 7 a 7,6 px a 1366 px: es lo máximo que cabe en portátiles de 1280×720 sin rediseñar la ficha. |

Además: `pruebas/` con las herramientas de esta auditoría (el proyecto no tenía pruebas automáticas).

## Mediciones (copia local, mismas condiciones)

| Medida | Antes (`main`) | Después |
|---|---|---|
| Lighthouse móvil, rendimiento (mediana de 3) | 81 (64-83) | 80-83 (79-85) |
| Lighthouse móvil, accesibilidad / buenas prácticas / SEO | 90 / 100 / 92 | **100 / 100 / 100** |
| Lighthouse escritorio, rendimiento | 96 | 96-98 |
| CLS móvil | 0,095 | **0,007** |
| LCP escritorio | 1,08 s | **0,77-0,85 s** |
| Violaciones axe (8 vistas × 4 anchos) | 3 tipos, 32 nodos | **0** |
| Desbordes horizontales | 1920 px en la contraportada | **ninguno** |
| Encaje de las 44 páginas (13 tamaños) | — | **todos OK** |
| Copia de emergencia del guardián | 1 archivo (en producción, 4) | **67 archivos: CSS, 7 JS, 4 tipografías, 38 pósters** |

El LCP en móvil (3,6-3,7 s simulado; 2,5 s observado) lo marca la pantalla de carga: el libro aparece al abrirse
el telón. Bajarlo más exige quitar el tiempo mínimo del telón, que se pidió expresamente ("unos segundos al
iniciar"); queda como decisión de Luciano.

## Publicación y vuelta atrás

- Coolify despliega `catalogo-la-ribera` desde `main`. Producción antes de publicar: imagen del commit `9e4045c`.
- Respaldo previo de los archivos servidos en `~/respaldo/manual/catalogo-la-ribera-<fecha>/`.
- **Volver atrás:** redeploy en Coolify del despliegue anterior (`9e4045c`), o `git revert` de los commits en
  `main` y redeploy. Sin base de datos ni variables de entorno.

## Publicado en producción (18/11/2026, 14:31)

- Commit `df4d6b9` desplegado en `catalogo-la-ribera` desde Coolify (por API: el push no despliega solo).
  Respaldo previo en `~/respaldo/manual/catalogo-la-ribera-20261118-1428/`.
- `~/check-webs.sh` idéntico antes y después (16 en línea, 0 fallas, 5 apagadas a propósito).
- Los CSS y JS que sirve Cloudflare coinciden con los del repo en los dos dominios; GitHub Pages sigue sirviendo.

| Medida en `https://cabanalaribera.cerice360.com` | Antes (`9e4045c`) | Después |
|---|---|---|
| Lighthouse móvil, rendimiento | 35 | **66** (65-67) |
| Lighthouse escritorio, rendimiento | 53 | **91** |
| Accesibilidad / buenas prácticas | 90 / 100 | **100 / 100** |
| SEO | 92 | 92 (Cloudflare antepone su `robots.txt` gestionado, que Lighthouse marca como inválido) |
| CLS móvil | 0,080 | **0,007** |
| Peso total de la portada | 1.589 KB | **679 KB** |
| Violaciones axe (8 vistas × 4 anchos) | 3 tipos | **0** |

Una vez, a 1366 px, la consola registró un intento de evaluar texto como JavaScript bloqueado por la CSP. El
código del catálogo no usa `eval` ni similares y no se reprodujo; se atribuye a la herramienta de prueba.

## Pendiente y decisiones de Luciano

- **Caché de navegador en Cloudflare:** la zona `cerice360.com` tiene "Browser Cache TTL" de 4 h, que reemplaza los
  5 minutos que envía el servidor para CSS y JS. Tras publicar, un visitante que entró en las 4 h anteriores
  puede ver el HTML nuevo con el CSS/JS anterior. Opciones: poner esa opción en "Respect Existing Headers"
  (afecta a todas las webs de la zona) o versionar por nombre de archivo (`style.20261118.css`). No se tocó.
- La copia de emergencia se renovará en la ejecución diaria del guardián (08:30 UTC); el 18/11 a las 13:04 su
  despliegue registró un error en `copias.log` (otro proyecto; no se tocó).

- Teléfonos pequeños (360×640, 375×667): la página está limitada por la altura y la ficha sigue con letra
  pequeña (valores de 8,5-9 px). Se puede ampliar con los dedos (el zoom está permitido); mejorarlo exige
  rediseñar la ficha para móvil (por ejemplo, una ficha desplegable).
- La música empieza con el primer toque en cualquier parte de la página. Cumple WCAG (hay botón para
  silenciarla), pero puede sorprender a quien solo quería pasar de página; valorar que empiece solo con el botón.
- Duración mínima del telón (ver LCP).
- El servidor se reinició 5 veces el 18/11 con errores del kernel ("Bad rss-counter state") y fallos de
  protección general en procesos: conviene revisar la memoria del equipo.
