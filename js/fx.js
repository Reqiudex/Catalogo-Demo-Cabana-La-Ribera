/* Efectos de ambiente: telón de entrada y polvo dorado en portada y contraportada.
   Todo se desactiva con prefers-reduced-motion. */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var body = document.body;
  var intro = document.getElementById('intro');

  /* ---------- telón de entrada ---------- */
  function endIntro() {
    if (!intro || intro.classList.contains('intro--out')) return;
    intro.classList.add('intro--out');
    body.classList.remove('intro-on');
    try { sessionStorage.setItem('lr-intro', '1'); } catch (e) { /* ignorar */ }
    setTimeout(function () { if (intro.parentNode) intro.parentNode.removeChild(intro); }, 1300);
  }
  var seen = false;
  try { seen = sessionStorage.getItem('lr-intro') === '1'; } catch (e) { /* ignorar */ }
  if (!intro) { body.classList.remove('intro-on'); }
  else if (reduced || seen) { intro.parentNode.removeChild(intro); body.classList.remove('intro-on'); }
  else {
    var minTime = new Promise(function (r) { setTimeout(r, 2300); });
    var loaded = new Promise(function (r) { if (document.readyState === 'complete') r(); else window.addEventListener('load', r); });
    var maxTime = new Promise(function (r) { setTimeout(r, 4200); });
    Promise.race([Promise.all([minTime, loaded]), maxTime]).then(endIntro);
    intro.addEventListener('click', endIntro);
    document.addEventListener('keydown', endIntro, { once: true });
  }

  /* ---------- polvo dorado ---------- */
  if (reduced) return;
  var canvas = null, ctx = null, host = null, parts = [], raf = 0, w = 0, h = 0, dpr = 1;
  function seed() {
    parts = [];
    var n = Math.round(Math.min(70, w * h / 5200));
    for (var i = 0; i < n; i++) parts.push(make(true));
  }
  function make(any) {
    return {
      x: Math.random() * w, y: any ? Math.random() * h : h + 10,
      r: .5 + Math.random() * 1.9, vy: -(.12 + Math.random() * .38), vx: (Math.random() - .5) * .15,
      a: .15 + Math.random() * .6, tw: Math.random() * Math.PI * 2, ts: .01 + Math.random() * .03
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
    loop();
  }
  function detach() {
    cancelAnimationFrame(raf); raf = 0;
    if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    canvas = ctx = host = null;
  }
  function resize() {
    if (!canvas || !host) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = host.clientWidth; h = host.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function loop() {
    raf = requestAnimationFrame(loop);
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      p.x += p.vx; p.y += p.vy; p.tw += p.ts;
      if (p.y < -10) parts[i] = p = make(false);
      var al = p.a * (.55 + .45 * Math.sin(p.tw));
      var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
      g.addColorStop(0, 'rgba(255,232,170,' + al + ')');
      g.addColorStop(1, 'rgba(217,161,58,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2); ctx.fill();
    }
  }
  /* revisa cada medio segundo qué página de tapa está a la vista (el libro rehace el DOM al cambiar de modo) */
  setInterval(function () {
    var p = document.querySelector('.page--cover.is-visible, .page--back.is-visible');
    if (document.hidden) p = null;
    if (p) attach(p); else if (host) detach();
    if (host && !document.body.contains(host)) detach();
  }, 500);
  window.addEventListener('resize', function () { resize(); });
})();
