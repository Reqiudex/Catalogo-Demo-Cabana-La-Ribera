/* Reproductor a pantalla completa para los videos de los lotes.
   Abre el video de YouTube sobre todo el catálogo, con controles y sonido, y pide pantalla
   completa real cuando el navegador lo permite (en móvil además intenta girar a horizontal).
   La música de fondo se pausa mientras está abierto y vuelve al cerrarlo.
   API: LRPlayer.open(idYouTube, titulo) · LRPlayer.close() · LRPlayer.isOpen() */
(function () {
  'use strict';
  var root = document.documentElement;
  var lb = null, box = null, frame = null, lastFocus = null, musicWas = false, isOpen = false;

  function build() {
    lb = document.createElement('div');
    lb.className = 'lb';
    lb.hidden = true;
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML =
      '<div class="lb-bar">' +
        '<p class="lb-title"></p>' +
        '<a class="lb-yt" target="_blank" rel="noopener">Ver en YouTube</a>' +
        '<button class="lb-close" type="button" aria-label="Cerrar video">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="lb-stage"><div class="lb-box"></div></div>';
    document.body.appendChild(lb);
    box = lb.querySelector('.lb-box');
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-stage')) close(); });
    document.addEventListener('keydown', function (e) {
      if (!isOpen) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key === 'Tab') {   // el foco no sale del reproductor
        var f = [lb.querySelector('.lb-yt'), lb.querySelector('.lb-close')];
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[1]) { e.preventDefault(); f[0].focus(); }
      }
    }, true);
  }

  function fsElement() { return document.fullscreenElement || document.webkitFullscreenElement || null; }
  function enterFullscreen() {
    var req = lb.requestFullscreen || lb.webkitRequestFullscreen;
    if (!req) return;                       // iPhone: se queda el visor a toda la ventana
    try {
      var p = req.call(lb);
      var lock = function () {
        if (screen.orientation && screen.orientation.lock && matchMedia('(pointer: coarse)').matches) {
          screen.orientation.lock('landscape').catch(function () { /* no soportado */ });
        }
      };
      if (p && p.then) p.then(lock).catch(function () { /* el visor ya ocupa la ventana */ }); else lock();
    } catch (e) { /* ignorar */ }
  }
  function exitFullscreen() {
    try { if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); } catch (e) { /* ignorar */ }
    if (fsElement() !== lb) return;
    var ex = document.exitFullscreen || document.webkitExitFullscreen;
    if (ex) { try { var p = ex.call(document); if (p && p.catch) p.catch(function () {}); } catch (e) { /* ignorar */ } }
  }

  function open(id, title) {
    if (!id) return;
    if (!lb) build();
    if (isOpen) close();
    lastFocus = document.activeElement;
    var label = title ? 'Video · ' + title : 'Video del lote';
    lb.querySelector('.lb-title').textContent = title || '';
    lb.setAttribute('aria-label', label);
    lb.querySelector('.lb-yt').href = 'https://www.youtube.com/watch?v=' + id;
    frame = document.createElement('iframe');
    frame.title = label;
    frame.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
    frame.setAttribute('allowfullscreen', '');
    frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&playsinline=1&controls=1&fs=1&rel=0&modestbranding=1&iv_load_policy=3';
    box.appendChild(frame);
    lb.hidden = false;
    root.classList.add('lb-open');
    isOpen = true;
    requestAnimationFrame(function () { requestAnimationFrame(function () { lb.classList.add('lb--in'); }); });
    musicWas = !!(window.LRMusic && window.LRMusic.isOn && window.LRMusic.isOn());
    if (musicWas) window.LRMusic.pause();
    enterFullscreen();
    lb.querySelector('.lb-close').focus({ preventScroll: true });
    document.dispatchEvent(new CustomEvent('lr:player', { detail: { open: true } }));
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    exitFullscreen();
    lb.classList.remove('lb--in');
    root.classList.remove('lb-open');
    if (frame) { frame.remove(); frame = null; }
    setTimeout(function () { if (!isOpen) lb.hidden = true; }, 300);
    if (musicWas && window.LRMusic) window.LRMusic.play();
    musicWas = false;
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) { /* ignorar */ } }
    document.dispatchEvent(new CustomEvent('lr:player', { detail: { open: false } }));
  }

  /* si la persona sale de la pantalla completa con el botón del sistema, el visor sigue abierto
     a toda la ventana; con Esc dentro de pantalla completa el navegador ya la cierra. */

  window.LRPlayer = { open: open, close: close, isOpen: function () { return isOpen; } };
})();
