# Reporte de extracción — cabanalaribera.com (04/11/2026)

**Método:** Playwright + Chromium, `networkidle` y scroll completo. El sitio es Next.js y lee todo de su API (`/api/header`, `/api/banner-main-center`, `/api/info1`, `/api/info2`, `/api/footer`, `/api/footerContact`, `/api/contentBody`, `/api/developmentDesignFooter`). Respuestas originales en `data/raw/`.

## Se extrajo
- Textos: título del evento, bienvenida, frase, fecha (23/10/2026 12:00), lugar, agenda (cena y grabación 15/10 en Hotel Novotel – Salón Patuju; remate 23/10 en Fexposar), contacto (+591 78000828, CabanaLaRibera@gmail.com), redes (Facebook, Instagram, WhatsApp), créditos (Ganadería 360).
- Patrocinador (1: Frigorífico BFC) y auspiciadores (4: Agromel, Paceña, Calcimin, Lazo Rural).
- **38 lotes**: número y video de YouTube de cada uno, más el título del video (de ahí salen los códigos de 7 lotes y las etiquetas «AB»).
- 18 imágenes (logo, título, fondos, escena, patrocinadores) y 38 miniaturas de los videos, en `assets/`.
- Video de portada (`videos/banner.mp4`, 12,9 MB, el hero del sitio).
- Colores del sitio: bronce `#cd7f32`, ámbar `#ffa500`, blanco; tipografía Montserrat.

## No se pudo extraer (no existe en el sitio)
- Nombre del ejemplar, nacimiento, padre, madre, datos genéticos, precios/bases, sellos y combos por lote: **el sitio no los publica** (solo muestra número de lote y video). Quedan en `null` y el catálogo los muestra como «Por confirmar».
- Códigos de registro: solo 7 lotes los traen en el título del video (5 JHVM 24005, 9 RIB 1529, 27 JEN 2271, 29 LCJ 1089, 30 RDM B80, 31 PPSN 008, 38 LCJ 907).
- Descripciones de YouTube: no accesibles de forma automatizada.
- Los 38 videos son de YouTube, así que se guardó el enlace, no el archivo (no hay `lote-XX.mp4`). Los lotes 3 y 4 comparten el mismo video («LOTE 3AB»).
- El logo `img/larivera/logolr.png` indicado devuelve 404; el sitio usa `logos/logolr.webp`.

## Interpretaciones (editables)
- Sellos de lote: todos llevan «Premium» (el evento se define como toros y vaquillas premium) y «Nelore» (raza de la cabaña). «Registro» solo donde hay código; «Genética brasileña» en el lote 2 (título «Internacionales Brasileras»); «Lote doble A+B» en los lotes 3, 4, 21 y 22 (títulos «3AB», «21AB», «22AB»). Es una lectura de los títulos, no un dato confirmado.
