/* Catálogo en formato libro — Cabaña La Ribera.
   Lee todo de window.CATALOG (data/catalog.js). Sin dependencias. */
(function () {
  'use strict';
  var C = window.CATALOG;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');
  var DUR = 900;
  var IMG = C.imagenes;
  var FILE_MODE = location.protocol === 'file:';
  var PERF = window.LRPerf || { lite: false };
  function lite() { return !!PERF.lite; }

  /* ---------- utilidades ---------- */
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function ytId(u) {
    var m = /(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/.exec(u || '');
    return m ? m[1] : null;
  }
  function wa(text) { return 'https://wa.me/' + C.contacto.whatsapp + '?text=' + encodeURIComponent(text); }
  function dateParts(iso) { var p = iso.split('-'); return { d: +p[2], m: MONTHS[+p[1] - 1], y: p[0] }; }

  var ICONS = {
    cena: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="26" r="11" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="24" cy="26" r="6" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 8v14M5 8v6a3 3 0 0 0 6 0V8M40 8c-3 3-3 9 0 12v20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    camara: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="14" width="29" height="22" rx="4" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M34 22l10-6v16l-10-6z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="14" cy="22" r="2.4" fill="currentColor"/></svg>',
    martillo: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="10" width="20" height="9" rx="2" transform="rotate(35 18 14)" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M24 24L40 40M6 42h20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>'
  };

  /* ---------- páginas ---------- */
  function paperDeco() { return '<span class="deco deco--tl"></span><span class="deco deco--br"></span>'; }
  function folio(n) { return '<footer class="folio"><span>Cabaña La Ribera</span><b>' + n + '</b></footer>'; }

  function pCover() {
    var e = C.evento;
    return { label: 'Portada', html:
      '<section class="page page--cover">' +
      '<video class="cover-video" data-mp4 data-src="' + esc(C.videoPortada) + '" data-src-lite="' + esc(C.videoPortadaLigero || C.videoPortada) + '" poster="' + esc(IMG.atardecerMovil) + '" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video>' +
      '<div class="cover-veil"></div><div class="cover-frame"></div>' +
      '<div class="cover-body">' +
      '<img class="cover-logo" src="' + esc(IMG.logo) + '" alt="' + esc(e.marca) + ' — ' + esc(e.raza) + '">' +
      '<img class="cover-title" src="' + esc(IMG.titulo) + '" alt="' + esc(e.titulo) + ' — ' + esc(e.subtitulo) + '">' +
      '<p class="cover-date"><span>' + esc(e.fechaCorta) + '</span></p>' +
      '<p class="cover-kicker">Catálogo digital · 38 lotes</p>' +
      '<p class="cover-hint"><span class="hint-hand" aria-hidden="true"></span>Toca el borde o desliza para abrir</p>' +
      '</div></section>' };
  }

  function pWelcome(n) {
    var e = C.evento;
    return { label: 'Bienvenida', html:
      '<section class="page page--paper page--welcome">' + paperDeco() +
      '<div class="w-scene"><img src="' + esc(IMG.escena) + '" alt="Ganado Nelore frente a la misión de San Rafael de Velasco" loading="lazy"></div>' +
      '<div class="w-body">' +
      '<p class="eyebrow">Bienvenidos al</p>' +
      '<h2 class="w-title">' + esc(e.titulo) + '</h2>' +
      '<p class="w-sub">' + esc(e.subtitulo) + '</p>' +
      '<div class="orn" aria-hidden="true"><i></i><b></b><i></i></div>' +
      e.bienvenida.map(function (p) { return '<p class="w-p">' + p + '</p>'; }).join('') +
      '<p class="w-quote">“' + esc(e.frase) + '”</p>' +
      '<p class="w-when"><b>' + esc(e.fechaLarga) + '</b><span>' + esc(e.lugar) + '</span></p>' +
      '</div>' + folio(n) + '</section>' };
  }

  function pAgenda(n) {
    var e = C.evento;
    return { label: 'Agenda del evento', html:
      '<section class="page page--paper page--agenda">' + paperDeco() +
      '<div class="ag-head"><p class="eyebrow">' + esc(e.lema) + '</p><h2 class="sec-title">Agenda del evento</h2></div>' +
      '<ol class="timeline">' + C.agenda.map(function (a, i) {
        var d = dateParts(a.fecha);
        return '<li class="tl-item" style="--i:' + i + '"><div class="tl-date"><b>' + d.d + '</b><span>' + d.m + '</span></div>' +
          '<div class="tl-ic">' + (ICONS[a.icono] || '') + '</div>' +
          '<div class="tl-txt"><h3>' + esc(a.titulo) + '</h3><p class="tl-time">' + esc(a.hora) + ' hrs</p><p class="tl-place">' + esc(a.lugar) + '</p></div></li>';
      }).join('') + '</ol>' +
      '<img class="ag-mision" src="' + esc(IMG.mision) + '" alt="" loading="lazy">' +
      folio(n) + '</section>' };
  }

  function mediaMarkup(l) {
    var id = ytId(l.video);
    var poster = l.poster ? '<img class="v-poster" src="' + esc(l.poster) + '" alt="Vista previa del video del lote ' + l.n + '" loading="lazy" decoding="async">' : '';
    var link = id ? '<a class="v-yt" href="https://www.youtube.com/watch?v=' + id + '" target="_blank" rel="noopener">Ver en YouTube</a>' : '';
    if (id) return '<div class="vbox" data-yt="' + id + '">' + poster + '<div class="v-shield"></div>' + link + '</div>';
    if (l.video) return '<div class="vbox"><video data-mp4 data-src="' + esc(l.video) + '"' + (l.poster ? ' poster="' + esc(l.poster) + '"' : '') + ' muted loop playsinline preload="none"></video><div class="v-shield"></div></div>';
    return '<div class="vbox">' + poster + '</div>';
  }

  function pLot(l, n) {
    var nombre = l.name ? l.name + (l.categoria ? ' · ' + l.categoria : '') : null;
    var rows = [['Ejemplar', nombre, false, 'wide'], ['Registro', l.registro, true, 'c3'], ['Nacimiento', l.nacimiento, true, 'c3'], ['Padre', l.padre, true, 'c3'], ['Madre', l.madre, true, 'c3'], ['Datos genéticos', l.geneticos, false, 'wide']]
      .filter(function (r) { return r[1] || r[2]; });
    var seals = (l.seals || []).map(function (s, i) {
      return '<span class="seal-slot" style="--d:' + (0.35 + i * 0.28).toFixed(2) + 's;--rot:' + ((i % 2 ? 6 : -7) + (i % 3) * 1.5) + 'deg">' + window.LRSeals.render(s, l) + '</span>';
    }).join('');
    return { label: 'Lote ' + l.n, lot: l.n, html:
      '<section class="page page--paper page--lot" data-lot="' + l.n + '">' + paperDeco() +
      '<header class="lot-head"><span class="lot-kicker">Lote</span><span class="lot-num">' + pad(l.n) + '</span>' +
      '<span class="lot-brand"><i></i>' + esc(C.evento.raza) + '</span></header>' +
      '<div class="vframe">' + mediaMarkup(l) + '<div class="seals">' + seals + '</div></div>' +
      '<dl class="spec">' + rows.map(function (r) { var c = (r[1] ? '' : 'is-empty') + (r[3] ? ' ' + r[3] : ''); return '<div' + (c.trim() ? ' class="' + c.trim() + '"' : '') + '><dt>' + r[0] + '</dt><dd>' + (r[1] ? esc(r[1]) : 'Por confirmar') + '</dd></div>'; }).join('') + '</dl>' +
      (l.desc ? '<p class="lot-desc">' + esc(l.desc) + '</p>' : '') +
      (C.avisoDatos ? '<p class="lot-note">* ' + esc(C.avisoDatos) + '</p>' : '') +
      '<a class="cta" href="' + wa('Hola, quiero consultar por el Lote ' + l.n + ' del 2do Gran Remate San Rafael de Velasco.') + '" target="_blank" rel="noopener">Consultar por el lote ' + l.n + '</a>' +
      folio(n) + '</section>' };
  }

  function pSponsors(n) {
    return { label: 'Patrocinadores y auspiciadores', html:
      '<section class="page page--paper page--sponsors">' + paperDeco() +
      '<h2 class="sec-title">Patrocinadores</h2>' +
      '<div class="logos logos--1">' + C.patrocinadores.map(function (s) { return '<figure><img src="' + esc(s.img) + '" alt="' + esc(s.nombre) + '" loading="lazy"></figure>'; }).join('') + '</div>' +
      '<div class="orn" aria-hidden="true"><i></i><b></b><i></i></div>' +
      '<h2 class="sec-title sec-title--2">Auspiciadores</h2>' +
      '<div class="logos logos--4">' + C.auspiciadores.map(function (s) { return '<figure><img src="' + esc(s.img) + '" alt="' + esc(s.nombre) + '" loading="lazy"></figure>'; }).join('') + '</div>' +
      '<p class="thanks">Gracias por acompañarnos y hacer posible este evento.</p>' +
      folio(n) + '</section>' };
  }

  function pContact(n) {
    var k = C.contacto;
    return { label: 'Contacto', html:
      '<section class="page page--paper page--contact">' + paperDeco() +
      '<div class="ct-hero"><img src="' + esc(IMG.atardecer) + '" alt="" loading="lazy"><h2 class="sec-title sec-title--light">Contacto</h2></div>' +
      '<div class="ct-body">' +
      '<ul class="ct-list">' +
      '<li><span>Teléfono</span><a href="tel:' + esc(k.telefono.replace(/\s/g, '')) + '">' + esc(k.telefono) + '</a></li>' +
      '<li><span>Correo</span><a href="mailto:' + esc(k.email) + '">' + esc(k.email) + '</a></li>' +
      '<li><span>Web</span><a href="https://' + esc(k.web) + '" target="_blank" rel="noopener">' + esc(k.web) + '</a></li>' +
      '</ul>' +
      '<a class="cta cta--big" href="' + wa('Hola, quiero información del 2do Gran Remate San Rafael de Velasco.') + '" target="_blank" rel="noopener">Escribir por WhatsApp</a>' +
      '<div class="social">' + k.redes.map(function (r) { return '<a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.nombre) + '</a>'; }).join('') + '</div>' +
      '</div>' + folio(n) + '</section>' };
  }

  function pBack() {
    var e = C.evento, c = C.creditos;
    return { label: 'Contraportada', html:
      '<section class="page page--back">' +
      '<div class="cover-veil"></div><div class="cover-frame"></div>' +
      '<div class="cover-body">' +
      '<img class="cover-logo" src="' + esc(IMG.logo) + '" alt="' + esc(e.marca) + '">' +
      '<p class="back-lema">' + esc(e.lema) + '</p>' +
      '<p class="back-date">' + esc(e.fechaLarga) + '<br><span>' + esc(e.lugar) + '</span></p>' +
      '<p class="back-contact"><a href="tel:' + esc(C.contacto.telefono.replace(/\s/g, '')) + '">' + esc(C.contacto.telefono) + '</a><br><a href="mailto:' + esc(C.contacto.email) + '">' + esc(C.contacto.email) + '</a></p>' +
      '<p class="back-credit">Desarrollo del sitio: <a href="' + esc(c.url) + '" target="_blank" rel="noopener">' + esc(c.empresa) + '</a></p>' +
      '</div></section>' };
  }

  function buildPageList() {
    var list = [pCover()];
    var make = [pWelcome, pAgenda];
    make.forEach(function (f) { list.push(f(list.length + 1)); });
    C.lotes.forEach(function (l) { list.push(pLot(l, list.length + 1)); });
    list.push(pSponsors(list.length + 1));
    list.push(pContact(list.length + 1));
    list.push(pBack());
    if (list.length % 2) list.splice(list.length - 1, 0, { label: 'Página en blanco', html: '<section class="page page--paper page--blank"></section>' });
    return list;
  }

  /* ---------- medios (carga perezosa) ---------- */
  var soundOn = false;
  function ytSend(frame, func) {
    try { frame.contentWindow.postMessage(JSON.stringify({ event: 'command', func: func, args: [] }), '*'); } catch (e) { /* ignorar */ }
  }
  /* Inserta el reproductor de YouTube. En modo ligero solo al tocar el video (cada reproductor
     pesa ~1 MB de JavaScript y frena mucho los equipos modestos); en modo normal, cuando la hoja
     termina de girar, para no competir con la animación del pase de página. */
  var ytTimers = [];
  function mediaOn(page, delay) {
    $$('[data-yt]', page).forEach(function (box) {
      if (box.querySelector('iframe') || FILE_MODE) { if (FILE_MODE) box.classList.add('no-embed'); return; }
      if (lite() && !box.classList.contains('wants-play')) { box.classList.add('tap-to-play'); return; }
      if (delay) {
        ytTimers.push(setTimeout(function () { if (page.classList.contains('is-visible')) embedYT(box); }, delay));
        return;
      }
      embedYT(box);
    });
    $$('video[data-mp4]', page).forEach(function (v) {
      if (lite() && v.classList.contains('cover-video')) return;   // modo ligero: portada fija (póster)
      if (!v.getAttribute('src')) v.src = (lite() || mode === 'single') && v.getAttribute('data-src-lite') ? v.getAttribute('data-src-lite') : v.getAttribute('data-src');
      v.muted = true;
      var p = v.play();
      if (p && p.catch) p.catch(function () { /* autoplay bloqueado: queda el póster */ });
    });
  }
  function embedYT(box) {
    if (box.querySelector('iframe')) return;
    box.classList.remove('tap-to-play');
    var id = box.getAttribute('data-yt');
    var f = document.createElement('iframe');
    f.className = 'v-frame';
    f.title = 'Video del lote';
    f.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
    f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    f.setAttribute('tabindex', '-1');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&mute=1&loop=1&playlist=' + id + '&playsinline=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&enablejsapi=1';
    f.addEventListener('load', function () {
      box.classList.add('is-playing');
      ytSend(f, 'mute');
      ytSend(f, 'playVideo');
    });
    box.insertBefore(f, box.firstChild);
  }
  function mediaOff(page) {
    $$('[data-yt]', page).forEach(function (box) {
      var f = box.querySelector('iframe');
      if (f) { f.remove(); box.classList.remove('is-playing'); }
      box.classList.remove('wants-play');
    });
    $$('video[data-mp4]', page).forEach(function (v) { v.pause(); });
  }
  /* El botón controla solo la música de fondo (js/music.js); los videos siempre van en silencio. */
  function setSound(on, porUsuario) {
    if (on && !(window.LRMusic && window.LRMusic.play())) on = false;
    if (!on && window.LRMusic) window.LRMusic.pause();
    soundOn = on;
    if (porUsuario) { try { sessionStorage.setItem('lr-music', on ? '1' : '0'); } catch (e) { /* ignorar */ } }
    var b = $('#sound');
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    $('#soundLabel').textContent = on ? 'Silenciar música' : 'Activar música';
  }

  /* ---------- libro ---------- */
  var book = $('#book'), wrap = $('#bookWrap'), pagesData = [], pageEls = [], sheets = [], leaves = [];
  var mode = null, cur = 0, vis = [];          // cur: spread (escritorio) o índice de página (móvil)
  var busy = false;
  var N = 0, S = 0;

  function wantMode() { return window.matchMedia('(min-width: 900px) and (min-aspect-ratio: 1/1)').matches ? 'spread' : 'single'; }

  function mount() {
    mode = wantMode();
    document.documentElement.setAttribute('data-mode', mode);
    book.innerHTML = '';
    pagesData = buildPageList();
    N = pagesData.length;
    pageEls = []; sheets = []; leaves = [];
    var tmp = document.createElement('div');
    pagesData.forEach(function (p) { tmp.innerHTML = p.html; pageEls.push(tmp.firstElementChild); });
    if (mode === 'spread') {
      S = N / 2;
      for (var j = 0; j < S; j++) {
        var sh = document.createElement('div');
        sh.className = 'sheet';
        var fr = document.createElement('div'); fr.className = 'face face--front';
        var bk = document.createElement('div'); bk.className = 'face face--back';
        fr.appendChild(pageEls[2 * j]); bk.appendChild(pageEls[2 * j + 1]);
        sh.appendChild(fr); sh.appendChild(bk); book.appendChild(sh); sheets.push(sh);
      }
    } else {
      S = N - 1;
      pageEls.forEach(function (el) {
        var lf = document.createElement('div'); lf.className = 'leaf'; lf.appendChild(el); book.appendChild(lf); leaves.push(lf);
      });
    }
  }

  function visibleIdx(c) {
    if (mode === 'spread') { var v = []; if (c > 0) v.push(2 * c - 1); if (c < S) v.push(2 * c); return v; }
    return [c];
  }
  function maxCur() { return S; }

  function layout(prev, next, animate) {
    var lo = Math.min(prev, next), hi = Math.max(prev, next);
    if (mode === 'spread') {
      book.classList.toggle('at-start', next === 0);
      book.classList.toggle('at-end', next === S);
      sheets.forEach(function (s, j) {
        var flipped = j < next, moving = animate && j >= lo && j < hi;
        s.classList.toggle('flipped', flipped);
        s.classList.toggle('turning', !!moving);
        s.style.zIndex = moving ? 500 : (flipped ? j + 1 : S - j);
        s.style.transitionDelay = moving ? Math.min((flipped ? j - lo : hi - 1 - j) * 55, 330) + 'ms' : '0ms';
        s.style.transitionDuration = animate && !REDUCED.matches ? '' : '0ms';
        /* solo se pintan las hojas que pueden verse: las que giran y las de arriba de cada pila */
        s.hidden = animate ? (j < lo - 1 || j > hi + 1) : (j < next - 2 || j > next + 1);
      });
      if (animate) setTimeout(function () {
        sheets.forEach(function (s, j) {
          s.classList.remove('turning'); s.style.zIndex = j < cur ? j + 1 : S - j;
          if (!s.classList.contains('turning')) s.hidden = j < cur - 2 || j > cur + 1;
        });
      }, REDUCED.matches ? 0 : DUR + 400);
    } else {
      leaves.forEach(function (l, i) {
        var gone = i < next;
        l.classList.toggle('gone', gone);
        l.style.zIndex = gone ? 100 + i : N - i;
        l.style.transitionDuration = animate && !REDUCED.matches ? '' : '0ms';
        l.hidden = Math.abs(i - next) > 2;
        l.setAttribute('aria-hidden', i === next ? 'false' : 'true');
        if (i !== next) l.setAttribute('inert', ''); else l.removeAttribute('inert');
      });
    }
  }

  function syncVisible(prevVis) {
    var nowVis = visibleIdx(cur);
    pageEls.forEach(function (el, i) {
      var on = nowVis.indexOf(i) > -1;
      if (on && !el.classList.contains('is-visible')) { el.classList.add('is-visible'); mediaOn(el, prevVis && !REDUCED.matches ? DUR : 0); }
    });
    var off = (prevVis || []).filter(function (i) { return nowVis.indexOf(i) < 0; });
    var doOff = function () { off.forEach(function (i) { if (visibleIdx(cur).indexOf(i) < 0) { pageEls[i].classList.remove('is-visible'); mediaOff(pageEls[i]); } }); };
    if (prevVis && !REDUCED.matches) setTimeout(doOff, DUR * 0.75); else doOff();
    vis = nowVis;
  }

  function updateUI() {
    var v = visibleIdx(cur), first = v[0] + 1, last = v[v.length - 1] + 1;
    var txt = v.length > 1 ? 'Págs. ' + first + '–' + last : 'Pág. ' + first;
    $('#counter').textContent = txt + ' / ' + N;
    var pct = Math.round(last / N * 100);
    $('#bar').style.width = pct + '%';
    $('.progress').setAttribute('aria-valuenow', pct);
    var atStart = cur === 0, atEnd = cur === maxCur();
    ['#btnPrev', '#edgePrev'].forEach(function (s) { $(s).disabled = atStart; });
    ['#btnNext', '#edgeNext'].forEach(function (s) { $(s).disabled = atEnd; });
    var g = $('#goto');
    g.value = String(mode === 'spread' ? Math.max(0, v[0] === undefined ? 0 : (cur === 0 ? 0 : 2 * cur - 1)) : cur);
    if (history.replaceState) { try { history.replaceState(null, '', '#p' + (v[0] + 1)); } catch (e) { /* ignorar */ } }
  }

  function goTo(target, animate) {
    target = Math.max(0, Math.min(maxCur(), target));
    if (target === cur && vis.length) return;
    clearPeek();
    var prev = cur, prevVis = vis.slice();
    var far = Math.abs(target - prev) > 3;
    cur = target;
    layout(prev, cur, animate !== false && !far);
    syncVisible(prevVis);
    updateUI();
  }
  function clearPeek() { $$('.peek-next, .peek-prev', book).forEach(function (e) { e.classList.remove('peek-next', 'peek-prev'); }); }
  function peek(dir) {
    clearPeek();
    if (REDUCED.matches) return;
    var el = mode === 'spread' ? (dir > 0 ? sheets[cur] : sheets[cur - 1]) : (dir > 0 ? leaves[cur] : null);
    if (el && !el.classList.contains('turning')) el.classList.add(dir > 0 ? 'peek-next' : 'peek-prev');
  }
  function pageToPos(idx) { return mode === 'spread' ? Math.ceil(idx / 2) : idx; }
  function next() { goTo(cur + 1); }
  function prev() { goTo(cur - 1); }

  function buildSelect() {
    var g = $('#goto'); g.innerHTML = '';
    pagesData.forEach(function (p, i) {
      var o = document.createElement('option'); o.value = i; o.textContent = (i + 1) + ' · ' + p.label; g.appendChild(o);
    });
  }

  /* ---------- eventos ---------- */
  function bind() {
    $('#btnNext').addEventListener('click', next); $('#edgeNext').addEventListener('click', next);
    $('#btnPrev').addEventListener('click', prev); $('#edgePrev').addEventListener('click', prev);
    /* esquina que se levanta al pasar el mouse por el borde */
    [['#edgeNext', 1], ['#edgePrev', -1]].forEach(function (d) {
      var el = $(d[0]);
      el.addEventListener('mouseenter', function () { peek(d[1]); });
      el.addEventListener('mouseleave', clearPeek);
      el.addEventListener('focus', function () { peek(d[1]); });
      el.addEventListener('blur', clearPeek);
    });
    $('#sound').addEventListener('click', function (e) { e.stopPropagation(); setSound(!soundOn, true); });
    /* La música empieza sola con el primer toque, clic o tecla (los navegadores no permiten sonido antes),
       salvo que la persona la haya silenciado en esta visita. */
    var arrancar = function (e) {
      ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) { document.removeEventListener(ev, arrancar, true); });
      if (e && e.target && e.target.closest && e.target.closest('#sound')) return; // el propio botón decide
      var pref = null; try { pref = sessionStorage.getItem('lr-music'); } catch (e) { /* ignorar */ }
      if (pref !== '0' && !soundOn) setSound(true);
    };
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) { document.addEventListener(ev, arrancar, true); });
    $('#goto').addEventListener('change', function (e) { goTo(pageToPos(+e.target.value)); e.target.blur(); });
    document.addEventListener('keydown', function (e) {
      var t = e.target && e.target.tagName;
      if (t === 'SELECT' || t === 'INPUT' || t === 'TEXTAREA' || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
      else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
      else if (e.key === 'End') { e.preventDefault(); goTo(maxCur()); }
    });
    /* deslizar */
    var sx = null, sy = null, st = 0;
    $('#stage').addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse' && e.button !== 0) return; sx = e.clientX; sy = e.clientY; st = Date.now(); });
    window.addEventListener('pointerup', function (e) {
      if (sx === null) return;
      var dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4 && Date.now() - st < 900) { lastSwipe = Date.now(); dx < 0 ? next() : prev(); }
    });
    /* modo ligero: el video del lote se carga al tocarlo */
    var lastSwipe = 0;
    book.addEventListener('click', function (e) {
      var box = e.target.closest && e.target.closest('.vbox.tap-to-play');
      if (!box || Date.now() - lastSwipe < 400 || e.target.closest('.v-yt')) return;
      box.classList.add('wants-play');
      embedYT(box);
    });
    /* si fx.js detecta que el equipo va lento, pasar a modo ligero sin recargar */
    document.addEventListener('lr:lite', function () {
      ytTimers.forEach(clearTimeout); ytTimers = [];
      $$('.cover-video', book).forEach(function (v) { v.pause(); });
      $$('.page.is-visible [data-yt]', book).forEach(function (box) { if (!box.querySelector('iframe')) box.classList.add('tap-to-play'); });
    });
    var rz;
    window.addEventListener('resize', function () {
      clearTimeout(rz);
      rz = setTimeout(function () { if (wantMode() !== mode) remount(); }, 160);
    });
    REDUCED.addEventListener && REDUCED.addEventListener('change', function () { document.documentElement.classList.toggle('reduce', REDUCED.matches); });
  }

  function currentPageIdx() { var v = visibleIdx(cur); return v[0] === undefined ? 0 : v[0]; }
  function remount() {
    var idx = currentPageIdx();
    $$('iframe.v-frame').forEach(function (f) { f.remove(); });
    mount(); buildSelect();
    vis = []; cur = -1;
    var t = pageToPos(idx);
    cur = t; layout(t, t, false); syncVisible(null); updateUI();
  }

  function init() {
    document.documentElement.classList.toggle('reduce', REDUCED.matches);
    mount(); buildSelect(); bind();
    var m = /^#p(\d+)$/.exec(location.hash), start = m ? Math.min(N, Math.max(1, +m[1])) - 1 : 0;
    cur = pageToPos(start); vis = [];
    layout(cur, cur, false); syncVisible(null); updateUI();
    document.body.classList.add('ready');
    window.__catalog = { goTo: goTo, next: next, prev: prev, state: function () { return { mode: mode, cur: cur, N: N, vis: vis.slice() }; } };
  }
  init();
})();
