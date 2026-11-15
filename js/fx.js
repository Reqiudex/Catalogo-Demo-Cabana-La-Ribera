/* Efectos de ambiente: telón de entrada y polvo dorado en portada y contraportada.
   Todo se desactiva con prefers-reduced-motion; en modo ligero (js/perf.js) el telón es más corto
   y no hay polvo. Además mide los fotogramas reales y activa el modo ligero si el equipo no da abasto. */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var body = document.body;
  var intro = document.getElementById('intro');
  var perf = window.LRPerf || { lite: false, enable: function () { return false; } };
  function isLite() { return perf.lite; }

  /* ---------- telón de entrada ---------- */
  var introDone = false, onIntroDone = [];
  function endIntro() {
    if (introDone) return;
    introDone = true;
    body.classList.remove('intro-on');
    try { sessionStorage.setItem('lr-intro', '1'); } catch (e) { /* ignorar */ }
    if (intro) {
      intro.classList.add('intro--out');
      setTimeout(function () { if (intro.parentNode) intro.parentNode.removeChild(intro); }, isLite() ? 700 : 1300);
    }
    onIntroDone.forEach(function (f) { f(); });
  }
  var seen = false;
  try { seen = sessionStorage.getItem('lr-intro') === '1'; } catch (e) { /* ignorar */ }
  if (!intro || reduced || seen) {
    if (intro) intro.parentNode.removeChild(intro);
    intro = null; endIntro();
  } else {
    var minMs = isLite() ? 900 : 2300, maxMs = isLite() ? 2200 : 4200;
    var minTime = new Promise(function (r) { setTimeout(r, minMs); });
    var loaded = new Promise(function (r) { if (document.readyState === 'complete') r(); else window.addEventListener('load', r); });
    var maxTime = new Promise(function (r) { setTimeout(r, maxMs); });
    Promise.race([Promise.all([minTime, loaded]), maxTime]).then(endIntro);
    intro.addEventListener('click', endIntro);
    document.addEventListener('keydown', endIntro, { once: true });
  }
  if (reduced) return;

  /* ---------- polvo dorado (sprite pre-dibujado, 30 fps) ---------- */
  var SPRITE = 32, sprite = document.createElement('canvas');
  sprite.width = sprite.height = SPRITE;
  (function () {
    var g = sprite.getContext('2d'), h = SPRITE / 2, rg = g.createRadialGradient(h, h, 0, h, h, h);
    rg.addColorStop(0, 'rgba(255,232,170,1)');
    rg.addColorStop(.35, 'rgba(240,200,110,.45)');
    rg.addColorStop(1, 'rgba(217,161,58,0)');
    g.fillStyle = rg; g.fillRect(0, 0, SPRITE, SPRITE);
  })();
  var canvas = null, ctx = null, host = null, parts = [], raf = 0, w = 0, h = 0, dpr = 1, last = 0;
  function seed() {
    parts = [];
    var n = Math.round(Math.min(45, w * h / 7000));
    for (var i = 0; i < n; i++) parts.push(make(true));
  }
  function make(any) {
    return {
      x: Math.random() * w, y: any ? Math.random() * h : h + 10,
      r: .5 + Math.random() * 1.9, vy: -(.24 + Math.random() * .76), vx: (Math.random() - .5) * .3,
      a: .15 + Math.random() * .6, tw: Math.random() * Math.PI * 2, ts: .02 + Math.random() * .06
    };
  }
  function attach(page) {
    if (host === page) return;
    detach();
    host = page;
    canvas = document.createElement('canvas');
    canvas.className = 'dust';
    canvas.setAttribute('aria-hidden', 'true');
    page.appendChild(canvas);
    ctx = canvas.getContext('2d');
    resize(); seed();
    raf = requestAnimationFrame(loop);
  }
  function detach() {
    cancelAnimationFrame(raf); raf = 0;
    if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    canvas = ctx = host = null;
  }
  function resize() {
    if (!canvas || !host) return;
    dpr = Math.min(1.5, window.devicePixelRatio || 1);
    w = host.clientWidth; h = host.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function loop(t) {
    raf = requestAnimationFrame(loop);
    if (!ctx || t - last < 32) return;           // ~30 fps: el polvo no necesita más
    last = t;
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      p.x += p.vx; p.y += p.vy; p.tw += p.ts;
      if (p.y < -10) parts[i] = p = make(false);
      ctx.globalAlpha = p.a * (.55 + .45 * Math.sin(p.tw));
      var s = p.r * 6;
      ctx.drawImage(sprite, p.x - s / 2, p.y - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
  }
  var dustTimer = setInterval(function () {
    if (isLite()) { detach(); clearInterval(dustTimer); return; }
    var p = document.querySelector('.page--cover.is-visible, .page--back.is-visible');
    if (document.hidden) p = null;
    if (p) attach(p); else if (host) detach();
    if (host && !document.body.contains(host)) detach();
  }, 500);
  window.addEventListener('resize', function () { resize(); });
  document.addEventListener('lr:lite', detach);

  /* ---------- medición real: si el equipo va lento, pasar a modo ligero ---------- */
  function probe() {
    if (isLite() || perf.forced === '0') return;
    setTimeout(function () {
      if (document.hidden) return;
      var frames = 0, t0 = 0, worst = 0, prev = 0;
      function tick(t) {
        if (!t0) { t0 = prev = t; }
        frames++; worst = Math.max(worst, t - prev); prev = t;
        if (t - t0 < 2000) { requestAnimationFrame(tick); return; }
        var fps = frames / ((t - t0) / 1000);
        perf.probe = { fps: Math.round(fps), worstMs: Math.round(worst) };
        /* un tirón aislado (decodificar una imagen) no basta: hace falta lentitud sostenida */
        if (!document.hidden && (fps < 32 || (fps < 45 && worst > 300))) perf.enable();
      }
      requestAnimationFrame(tick);
    }, 1200);
  }
  if (introDone) probe(); else onIntroDone.push(probe);
})();
