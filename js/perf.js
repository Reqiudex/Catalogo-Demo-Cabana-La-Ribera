/* Modo ligero para dispositivos de bajo rendimiento.
   Se carga en <head> para que la clase html.lite exista antes del primer pintado.
   - Se activa solo si el equipo tiene ≤ 2 GB de memoria o ≤ 2 núcleos, el usuario pidió ahorro de datos,
     la conexión es 2G/3G, o si fx.js mide que la portada se anima a menos de ~35 fotogramas por segundo.
   - Forzar: ?lite=1 (siempre ligero) · ?lite=0 (nunca ligero) · ?lite=auto (volver a detección automática).
   API: window.LRPerf.lite (boolean) · LRPerf.enable() */
(function () {
  'use strict';
  var root = document.documentElement, nav = navigator, con = nav.connection || {};
  var forced = null;
  try {
    var m = /[?&]lite=(1|0|auto)\b/.exec(location.search);
    if (m) { if (m[1] === 'auto') localStorage.removeItem('lr-lite'); else localStorage.setItem('lr-lite', m[1]); }
    forced = localStorage.getItem('lr-lite');
  } catch (e) { /* almacenamiento bloqueado: solo detección */ }
  var measuredSlow = false;
  try { measuredSlow = sessionStorage.getItem('lr-slow') === '1'; } catch (e) { /* ignorar */ }

  /* Solo los equipos claramente débiles entran directo; el resto lo decide la medición de fx.js. */
  var weak = (nav.deviceMemory && nav.deviceMemory <= 2) ||
             (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2) ||
             con.saveData === true ||
             /(^|-)(2g|3g)$/.test(con.effectiveType || '');

  var lite = forced === '1' || (forced !== '0' && (weak || measuredSlow));
  if (lite) root.classList.add('lite');

  window.LRPerf = {
    lite: lite,
    forced: forced,
    enable: function () {
      if (this.lite || forced === '0') return false;
      this.lite = true; root.classList.add('lite');
      try { sessionStorage.setItem('lr-slow', '1'); } catch (e) { /* ignorar */ }
      document.dispatchEvent(new CustomEvent('lr:lite'));
      return true;
    }
  };
})();
