/* =====================================================================
   CATÁLOGO DIGITAL · CABAÑA LA RIBERA · 2do Gran Remate San Rafael de Velasco
   Todo el contenido del catálogo sale de este archivo. Edítalo sin tocar el código.
   Fuente: https://www.cabanalaribera.com/ (API propia del sitio), extraído el 2026-11-04.
   Los datos de ejemplar (name, nacimiento, padre, madre...) NO existen en el sitio:
   están en null y el catálogo los oculta hasta que los completes.
   ===================================================================== */
window.CATALOG = {
  evento: {
    marca: "Cabaña La Ribera",
    raza: "Nelore · Nelore Mocho",
    titulo: "2do Gran Remate San Rafael de Velasco",
    subtitulo: "Toros y Vaquillas Premium",
    lema: "Un evento que deja huella",
    fechaCorta: "23.10.26",
    fechaLarga: "23 de octubre de 2026 · 12:00 hrs",
    lugar: "Feria Ganadera San Rafael de Velasco",
    bienvenida: [
      "<b>Cabaña La Ribera</b> presenta su <b>2do Gran Remate San Rafael de Velasco</b>, una propuesta que reúne <b>toros y vaquillas premium</b> seleccionados bajo una visión clara: genética, calidad y proyección.",
      "Un encuentro donde cada <b>ejemplar</b> ha sido elegido para representar el <b>trabajo</b>, la dedicación y el <b>compromiso</b> detrás de una <b>genética</b> construida con propósito."
    ],
    frase: "Porque cuando la genética es excepcional, merece un escenario a la altura."
  },
  agenda: [
    { titulo: "Cena de presentación", fecha: "2026-10-15", hora: "19:00", lugar: "Hotel Novotel · Salón Patuju", icono: "cena" },
    { titulo: "Grabación de la presentación", fecha: "2026-10-15", hora: "20:00", lugar: "Hotel Novotel · Salón Patuju", icono: "camara" },
    { titulo: "Gran Remate", fecha: "2026-10-23", hora: "12:00", lugar: "Fexposar · Feria Ganadera San Rafael de Velasco", icono: "martillo" }
  ],
  contacto: {
    telefono: "+591 78000828",
    whatsapp: "59178000828",
    email: "CabanaLaRibera@gmail.com",
    web: "www.cabanalaribera.com",
    redes: [
      { nombre: "Facebook", url: "https://www.facebook.com/cabanalaribera/" },
      { nombre: "Instagram", url: "https://www.instagram.com/cabanalariberabo/" },
      { nombre: "WhatsApp", url: "https://wa.me/59178000828" }
    ]
  },
  patrocinadores: [
    { nombre: "Frigorífico BFC", img: "assets/patrocinador-1.webp" }
  ],
  auspiciadores: [
    { nombre: "Agromel SRL", img: "assets/auspiciador-1.webp" },
    { nombre: "Paceña", img: "assets/auspiciador-2.webp" },
    { nombre: "Calcimin", img: "assets/auspiciador-3.webp" },
    { nombre: "Lazo Rural", img: "assets/auspiciador-4.webp" }
  ],
  creditos: { empresa: "Ganadería 360", url: "https://www.ganaderia360.com", tiktok: "https://www.tiktok.com/@ganaderia360", instagram: "https://www.instagram.com/ganaderia360.bo" },
  imagenes: {
    logo: "assets/logo-lr.webp",
    titulo: "assets/banner-logo.webp",
    tituloRojo: "assets/agenda-remate-1.webp",
    atardecer: "assets/info1-image-desktop.webp",
    atardecerMovil: "assets/info1-image-mobile.webp",
    escena: "assets/info1-presentational-desktop.webp",
    escenaMovil: "assets/info1-presentational-mobile.webp",
    mision: "assets/agenda-desktop.webp",
    cinta: "assets/info1-cinta-desktop.webp"
  },
  videoPortada: "videos/banner.mp4",
  tema: { bronce: "#cd7f32", ambar: "#ffa500", blanco: "#ffffff", tipografiaSitio: "Montserrat" },
  /* Tipos de sello disponibles (js/seals.js):
     premium, nelore, registro, internacional, combo, top, genotipado, garantia
     Ejemplos:  {t:"combo", text:"2+1", sub:"COMBO"}  {t:"top", text:"1%"}  {t:"genotipado"}  {t:"garantia", text:"GARANTÍA"}
     Para "registro" usa el campo registro del lote. */
  lotes: [
    {"n": 1, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/DmVAtIZ8FWQ", "poster": "assets/poster-lote-01.jpg", "tituloVideo": "LOTE 1", "seals": [{"t": "premium"}, {"t": "nelore"}], "combo": null},
    {"n": 2, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/wVRQZwpuLQo", "poster": "assets/poster-lote-02.jpg", "tituloVideo": "LOTE 2 INTENACIONAL BRASILERAS", "seals": [{"t": "premium"}, {"t": "nelore"}, {"t": "internacional"}], "combo": null},
    {"n": 3, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/eTn9K93hMNM", "poster": "assets/poster-lote-03.jpg", "tituloVideo": "LOTE 3AB", "seals": [{"t": "premium"}, {"t": "nelore"}, {"t": "combo", "text": "A+B", "sub": "LOTE DOBLE"}], "combo": "A+B"},
    {"n": 4, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/eTn9K93hMNM", "poster": "assets/poster-lote-04.jpg", "tituloVideo": "LOTE 3AB", "seals": [{"t": "premium"}, {"t": "nelore"}, {"t": "combo", "text": "A+B", "sub": "LOTE DOBLE"}], "combo": "A+B"},
    {"n": 5, "name": null, "registro": "JHVM 24005", "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/geDboGc8pWg", "poster": "assets/poster-lote-05.jpg", "tituloVideo": "LOTE 5 JHVM 24005", "seals": [{"t": "premium"}, {"t": "nelore"}, {"t": "registro"}], "combo": null},
    {"n": 6, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/BI6L8BIeTDQ", "poster": "assets/poster-lote-06.jpg", "tituloVideo": "LOTE 6", "seals": [{"t": "premium"}, {"t": "nelore"}], "combo": null},
    {"n": 7, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/-933PgKCPiA", "poster": "assets/poster-lote-07.jpg", "tituloVideo": "LOTE 7", "seals": [{"t": "premium"}, {"t": "nelore"}], "combo": null},
    {"n": 8, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/N3uiCc0i7KA", "poster": "assets/poster-lote-08.jpg", "tituloVideo": "LOTE 8", "seals": [{"t": "premium"}, {"t": "nelore"}], "combo": null},
    {"n": 9, "name": null, "registro": "RIB 1529", "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/SU1wrnH_eWc", "poster": "assets/poster-lote-09.jpg", "tituloVideo": "LOTE 9  RIB 1529", "seals": [{"t": "premium"}, {"t": "nelore"}, {"t": "registro"}], "combo": null},
    {"n": 10, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/Q1BXHvRgFew", "poster": "assets/poster-lote-10.jpg", "tituloVideo": "LOTE 10", "seals": [{"t": "premium"}, {"t": "nelore"}], "combo": null},
    {"n": 11, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/ReTy2ubRKK0", "poster": "assets/poster-lote-11.jpg", "tituloVideo": "LOTE 11", "seals": [{"t": "premium"}, {"t": "nelore"}], "combo": null},
    {"n": 12, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/AVOZu_qmTMo", "poster": "assets/poster-lote-12.jpg", "tituloVideo": "LOTE 12", "seals": [{"t": "premium"}, {"t": "nelore"}], "combo": null},
    {"n": 13, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/AdJ4-rK5Gdc", "poster": "assets/poster-lote-13.jpg", "tituloVideo": "LOTE 13", "seals": [{"t": "premium"}, {"t": "nelore"}], "combo": null},
    {"n": 14, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/2ZTAmPNYlFA", "poster": "assets/poster-lote-14.jpg", "tituloVideo": "LOTE 14", "seals": [{"t": "premium"}, {"t": "nelore"}], "combo": null},
    {"n": 15, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/-osMlwZ-EFE", "poster": "assets/poster-lote-15.jpg", "tituloVideo": "LOTE 15", "seals": [{"t": "premium"}, {"t": "nelore"}], "combo": null},
    {"n": 16, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/whc2FyaAmdk", "poster": "assets/poster-lote-16.jpg", "tituloVideo": "LOTE 16", "seals": [{"t": "premium"}, {"t": "nelore"}], "combo": null},
    {"n": 17, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/rejRD2ZnNhE", "poster": "assets/poster-lote-17.jpg", "tituloVideo": "LOTE 17", "seals": [{"t": "premium"}, {"t": "nelore"}], "combo": null},
    {"n": 18, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/0W2R1_FN9DM", "poster": "assets/poster-lote-18.jpg", "tituloVideo": "LOTE 18", "seals": [{"t": "premium"}, {"t": "nelore"}], "combo": null},
    {"n": 19, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/s4a4NkxFm30", "poster": "assets/poster-lote-19.jpg", "tituloVideo": "LOTE 19", "seals": [{"t": "premium"}, {"t": "nelore"}], "combo": null},
    {"n": 20, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/PjlcGmYK7H4", "poster": "assets/poster-lote-20.jpg", "tituloVideo": "LOTE 20", "seals": [{"t": "premium"}, {"t": "nelore"}], "combo": null},
    {"n": 21, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/LzfjU6joyNE", "poster": "assets/poster-lote-21.jpg", "tituloVideo": "LOTE 21AB", "seals": [{"t": "premium"}, {"t": "nelore"}, {"t": "combo", "text": "A+B", "sub": "LOTE DOBLE"}], "combo": "A+B"},
    {"n": 22, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/WTLxsw5CXgk", "poster": "assets/poster-lote-22.jpg", "tituloVideo": "LOTE 22AB", "seals": [{"t": "premium"}, {"t": "nelore"}, {"t": "combo", "text": "A+B", "sub": "LOTE DOBLE"}], "combo": "A+B"},
    {"n": 23, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/jeaaQmoIfGY", "poster": "assets/poster-lote-23.jpg", "tituloVideo": "LOTE 23", "seals": [{"t": "premium"}, {"t": "nelore"}], "combo": null},
    {"n": 24, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/KfqKWv7S6Dk", "poster": "assets/poster-lote-24.jpg", "tituloVideo": "LOTE 24", "seals": [{"t": "premium"}, {"t": "nelore"}], "combo": null},
    {"n": 25, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/u6IFdT5EmtE", "poster": "assets/poster-lote-25.jpg", "tituloVideo": "LOTE 25", "seals": [{"t": "premium"}, {"t": "nelore"}], "combo": null},
    {"n": 26, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/eYuArcPqBnM", "poster": "assets/poster-lote-26.jpg", "tituloVideo": "LOTE 26", "seals": [{"t": "premium"}, {"t": "nelore"}], "combo": null},
    {"n": 27, "name": null, "registro": "JEN 2271", "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/jX92EpBOKHc", "poster": "assets/poster-lote-27.jpg", "tituloVideo": "LOTE 27 JEN 2271", "seals": [{"t": "premium"}, {"t": "nelore"}, {"t": "registro"}], "combo": null},
    {"n": 28, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/uTYTx6rcI2Y", "poster": "assets/poster-lote-28.jpg", "tituloVideo": "LOTE 28", "seals": [{"t": "premium"}, {"t": "nelore"}], "combo": null},
    {"n": 29, "name": null, "registro": "LCJ 1089", "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/x8fQ-7Ara-w", "poster": "assets/poster-lote-29.jpg", "tituloVideo": "LOTE 29 LCJ 1089", "seals": [{"t": "premium"}, {"t": "nelore"}, {"t": "registro"}], "combo": null},
    {"n": 30, "name": null, "registro": "RDM B80", "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/sHEcR1xs3r0", "poster": "assets/poster-lote-30.jpg", "tituloVideo": "LOTE 30 RDM B80", "seals": [{"t": "premium"}, {"t": "nelore"}, {"t": "registro"}], "combo": null},
    {"n": 31, "name": null, "registro": "PPSN 008", "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/mpTNuo-3mMg", "poster": "assets/poster-lote-31.jpg", "tituloVideo": "LOTE 31 PPSN 008", "seals": [{"t": "premium"}, {"t": "nelore"}, {"t": "registro"}], "combo": null},
    {"n": 32, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/tEyy8ZnGWck", "poster": "assets/poster-lote-32.jpg", "tituloVideo": "LOTE 32", "seals": [{"t": "premium"}, {"t": "nelore"}], "combo": null},
    {"n": 33, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/4Q3zMRkfyw0", "poster": "assets/poster-lote-33.jpg", "tituloVideo": "LOTE 33", "seals": [{"t": "premium"}, {"t": "nelore"}], "combo": null},
    {"n": 34, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/pUiBrRQJGPU", "poster": "assets/poster-lote-34.jpg", "tituloVideo": "LOTE 34", "seals": [{"t": "premium"}, {"t": "nelore"}], "combo": null},
    {"n": 35, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/svvWKBrXf9s", "poster": "assets/poster-lote-35.jpg", "tituloVideo": "LOTE 35", "seals": [{"t": "premium"}, {"t": "nelore"}], "combo": null},
    {"n": 36, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/Z_5sc9lWff8", "poster": "assets/poster-lote-36.jpg", "tituloVideo": "LOTE 36", "seals": [{"t": "premium"}, {"t": "nelore"}], "combo": null},
    {"n": 37, "name": null, "registro": null, "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/h9x2VWDd8Js", "poster": "assets/poster-lote-37.jpg", "tituloVideo": "LOTE 37", "seals": [{"t": "premium"}, {"t": "nelore"}], "combo": null},
    {"n": 38, "name": null, "registro": "LCJ 907", "nacimiento": null, "padre": null, "madre": null, "video": "https://youtu.be/LKFPSbqgb2E", "poster": "assets/poster-lote-38.jpg", "tituloVideo": "LOTE 38 LCJ 907", "seals": [{"t": "premium"}, {"t": "nelore"}, {"t": "registro"}], "combo": null}
  ]
};
