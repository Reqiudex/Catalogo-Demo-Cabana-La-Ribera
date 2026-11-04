/* Sellos de Cabaña La Ribera — diseño propio en SVG.
   Cada sello se anima solo cuando su página está visible (clase .is-visible en la página). */
(function () {
  var uid = 0;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  function star(n, r1, r2, cx, cy, rot) {
    var p = [], i, a, r;
    for (i = 0; i < n * 2; i++) {
      a = Math.PI * i / n + (rot || -Math.PI / 2);
      r = i % 2 ? r2 : r1;
      p.push((cx + r * Math.cos(a)).toFixed(2) + ',' + (cy + r * Math.sin(a)).toFixed(2));
    }
    return p.join(' ');
  }
  function gold(id) {
    return '<linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fdeeb0"/><stop offset=".42" stop-color="#d9a13a"/><stop offset=".75" stop-color="#a86a1c"/><stop offset="1" stop-color="#6d3f0e"/></linearGradient>';
  }
  function shine(id, clip) {
    return '<linearGradient id="' + id + '" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>';
  }
  function shineRect(id, clipId) {
    return '<g clip-path="url(#' + clipId + ')"><g class="s-shine"><rect x="-30" y="-10" width="26" height="140" fill="url(#' + id + ')" transform="skewX(-18)"/></g></g>';
  }
  function wrap(type, label, body) {
    return '<svg class="seal seal--' + type + '" viewBox="0 0 120 120" role="img" aria-label="' + esc(label) + '" focusable="false"><title>' + esc(label) + '</title>' + body + '</svg>';
  }

  var T = {};

  /* Medallón festoneado con anillo de texto */
  T.premium = function (o) {
    var i = ++uid, txt = esc(o.text || 'PREMIUM');
    return wrap('premium', 'Selección premium La Ribera',
      '<defs>' + gold('g' + i) + shine('h' + i) + '<path id="p' + i + '" d="M60,60 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"/><clipPath id="c' + i + '"><circle cx="60" cy="60" r="56"/></clipPath></defs>' +
      '<polygon points="' + star(28, 58, 54.5, 60, 60, 0) + '" fill="url(#g' + i + ')"/>' +
      '<circle cx="60" cy="60" r="50" fill="#2e170a"/>' +
      '<circle cx="60" cy="60" r="47" fill="none" stroke="url(#g' + i + ')" stroke-width="1.4"/>' +
      '<circle cx="60" cy="60" r="29" fill="none" stroke="url(#g' + i + ')" stroke-width="1"/>' +
      '<text font-family="Cinzel,serif" font-size="7.4" font-weight="700" fill="#f4d98c"><textPath href="#p' + i + '" textLength="236" lengthAdjust="spacing">SELECCIÓN · LA RIBERA · SELECCIÓN · LA RIBERA ·</textPath></text>' +
      '<polygon class="s-pop" points="' + star(5, 8, 3.3, 60, 43, -Math.PI / 2) + '" fill="url(#g' + i + ')"/>' +
      '<text x="60" y="66" text-anchor="middle" font-family="Cinzel,serif" font-weight="800" font-size="' + (txt.length > 7 ? 10 : 12) + '" fill="url(#g' + i + ')">' + txt + '</text>' +
      '<path d="M44 76 H76" stroke="url(#g' + i + ')" stroke-width="1"/><text x="60" y="86" text-anchor="middle" font-family="Montserrat,sans-serif" font-weight="600" font-size="5.2" letter-spacing="1.4" fill="#f4d98c">NELORE</text>' +
      shineRect('h' + i, 'c' + i));
  };

  /* Arco de joroba y cuernos (nelore) */
  T.nelore = function (o) {
    var i = ++uid;
    return wrap('nelore', 'Raza Nelore',
      '<defs>' + gold('g' + i) + '<clipPath id="c' + i + '"><circle cx="60" cy="60" r="56"/></clipPath></defs>' +
      '<circle cx="60" cy="60" r="57" fill="url(#g' + i + ')"/><circle cx="60" cy="60" r="53" fill="#f7ecd6"/>' +
      '<circle cx="60" cy="60" r="50" fill="none" stroke="#a8341c" stroke-width="1.3" stroke-dasharray="2 3.2"/>' +
      '<path class="s-draw" pathLength="100" d="M26 70 C30 40 48 30 60 34 C74 38 78 52 94 50" fill="none" stroke="#6d2a12" stroke-width="3.6" stroke-linecap="round"/>' +
      '<path class="s-draw s-draw2" pathLength="100" d="M40 44 C32 34 24 34 20 26 M80 42 C88 32 98 34 102 26" fill="none" stroke="#a8341c" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M26 70 H94" stroke="#6d2a12" stroke-width="1.2"/>' +
      '<text x="60" y="86" text-anchor="middle" font-family="Cinzel,serif" font-weight="800" font-size="13" fill="#6d2a12" letter-spacing="1.5">NELORE</text>' +
      '<text x="60" y="98" text-anchor="middle" font-family="Montserrat,sans-serif" font-weight="600" font-size="5" letter-spacing="1.6" fill="#a8341c">' + esc(o.sub || 'GENÉTICA CEBUINA') + '</text>');
  };

  /* Caravana (arete) con el código de registro */
  T.registro = function (o) {
    var i = ++uid, code = esc(o.text || 'REG');
    var len = Math.min(54, Math.max(26, code.length * 8.6));
    return wrap('registro', 'Registro ' + code,
      '<defs>' + gold('g' + i) + shine('h' + i) + '<clipPath id="c' + i + '"><rect x="24" y="22" width="72" height="92" rx="16"/></clipPath></defs>' +
      '<g class="s-tag" style="transform-origin:60px 14px">' +
      '<path d="M60 4 a10 10 0 1 1 0 20" fill="none" stroke="#8d8d8d" stroke-width="3"/>' +
      '<rect x="24" y="22" width="72" height="92" rx="16" fill="url(#g' + i + ')"/>' +
      '<rect x="29" y="27" width="62" height="82" rx="12" fill="#2e170a"/>' +
      '<circle cx="60" cy="38" r="5.4" fill="#f7ecd6" stroke="url(#g' + i + ')" stroke-width="1.4"/>' +
      '<text x="60" y="58" text-anchor="middle" font-family="Montserrat,sans-serif" font-size="6.2" font-weight="700" letter-spacing="2" fill="#f4d98c">REGISTRO</text>' +
      '<text x="60" y="80" text-anchor="middle" font-family="Cinzel,serif" font-size="14" font-weight="800" fill="#fdeeb0" textLength="' + len + '" lengthAdjust="spacingAndGlyphs">' + code + '</text>' +
      '<path d="M38 92 v10 M42 92 v10 M47 92 v10 M50 92 v10 M56 92 v10 M60 92 v10 M65 92 v10 M70 92 v10 M74 92 v10 M78 92 v10 M82 92 v10" stroke="#d9a13a" stroke-width="1.4"/>' +
      shineRect('h' + i, 'c' + i) + '</g>');
  };

  /* Globo que gira: genética internacional */
  T.internacional = function (o) {
    var i = ++uid;
    return wrap('internacional', o.text || 'Genética brasileña',
      '<defs>' + gold('g' + i) + '<path id="p' + i + '" d="M60,60 m-41,0 a41,41 0 1,1 82,0 a41,41 0 1,1 -82,0"/><clipPath id="c' + i + '"><circle cx="60" cy="60" r="27"/></clipPath>' +
      '<radialGradient id="r' + i + '" cx=".35" cy=".3"><stop offset="0" stop-color="#3f8f4f"/><stop offset="1" stop-color="#14502a"/></radialGradient></defs>' +
      '<circle cx="60" cy="60" r="58" fill="url(#g' + i + ')"/><circle cx="60" cy="60" r="54" fill="#12361f"/>' +
      '<circle cx="60" cy="60" r="51" fill="none" stroke="#f4d98c" stroke-width=".8"/>' +
      '<text font-family="Cinzel,serif" font-size="8" font-weight="700" fill="#f4d98c"><textPath href="#p' + i + '" textLength="246" lengthAdjust="spacing">GENÉTICA BRASILEÑA · GENÉTICA BRASILEÑA ·</textPath></text>' +
      '<circle cx="60" cy="60" r="27" fill="url(#r' + i + ')"/>' +
      '<g clip-path="url(#c' + i + ')" fill="none" stroke="#f4d98c" stroke-width="1">' +
      '<ellipse class="s-mer" cx="60" cy="60" rx="27" ry="27" style="transform-origin:60px 60px"/><ellipse class="s-mer s-mer2" cx="60" cy="60" rx="27" ry="27" style="transform-origin:60px 60px"/>' +
      '<path d="M33 60 H87 M36 48 H84 M36 72 H84" opacity=".8"/></g>' +
      '<circle cx="60" cy="60" r="27" fill="none" stroke="url(#g' + i + ')" stroke-width="1.6"/>' +
      '<polygon points="' + star(5, 6, 2.6, 60, 60, -Math.PI / 2) + '" fill="#fdeeb0" class="s-pop"/>');
  };

  /* Combo: cinta con muescas y número grande (2+1, 3+1, A+B ...) */
  T.combo = function (o) {
    var i = ++uid, t = esc(o.text || '2+1'), sub = esc(o.sub || 'COMBO');
    return wrap('combo', 'Combo ' + t,
      '<defs>' + gold('g' + i) + shine('h' + i) + '<clipPath id="c' + i + '"><path d="M4 30 H116 L106 60 L116 90 H4 L14 60 Z"/></clipPath></defs>' +
      '<g class="s-pulse" style="transform-origin:60px 60px">' +
      '<path d="M4 30 H116 L106 60 L116 90 H4 L14 60 Z" fill="#a8341c"/>' +
      '<path d="M9 34 H111 L102 60 L111 86 H9 L18 60 Z" fill="none" stroke="url(#g' + i + ')" stroke-width="1.6"/>' +
      '<text x="60" y="48" text-anchor="middle" font-family="Montserrat,sans-serif" font-weight="800" font-size="8" letter-spacing="3.2" fill="#fdeeb0">' + sub + '</text>' +
      '<text x="60" y="78" text-anchor="middle" font-family="Cinzel,serif" font-weight="900" font-size="' + (t.length > 3 ? 26 : 32) + '" fill="url(#g' + i + ')" stroke="#4d1408" stroke-width=".6" paint-order="stroke">' + t + '</text>' +
      shineRect('h' + i, 'c' + i) + '</g>');
  };

  /* Ranking */
  T.top = function (o) {
    var i = ++uid, t = esc(o.text || '1%');
    return wrap('top', 'Ranking top ' + t,
      '<defs>' + gold('g' + i) + shine('h' + i) + '<clipPath id="c' + i + '"><circle cx="60" cy="60" r="44"/></clipPath></defs>' +
      '<g class="s-rays" style="transform-origin:60px 60px"><polygon points="' + star(18, 58, 44, 60, 60, 0) + '" fill="url(#g' + i + ')"/></g>' +
      '<circle cx="60" cy="60" r="44" fill="#2e170a"/><circle cx="60" cy="60" r="40" fill="none" stroke="url(#g' + i + ')" stroke-width="1.2" stroke-dasharray="1.5 2.4"/>' +
      '<text x="60" y="48" text-anchor="middle" font-family="Montserrat,sans-serif" font-weight="800" font-size="9.5" letter-spacing="4" fill="#f4d98c">TOP</text>' +
      '<text x="60" y="78" text-anchor="middle" font-family="Cinzel,serif" font-weight="900" font-size="' + (t.length > 3 ? 22 : 30) + '" fill="url(#g' + i + ')">' + t + '</text>' +
      '<polygon points="' + star(5, 5, 2.2, 60, 90, -Math.PI / 2) + '" fill="#f4d98c"/>' + shineRect('h' + i, 'c' + i));
  };

  /* Genotipado: doble hélice que se traza */
  T.genotipado = function (o) {
    var i = ++uid, a = '', b = '', r = '', y, x1, x2;
    for (y = 0; y <= 56; y += 3.5) {
      x1 = 60 + 18 * Math.sin(y / 9); x2 = 60 - 18 * Math.sin(y / 9);
      a += (y ? 'L' : 'M') + x1.toFixed(1) + ' ' + (32 + y).toFixed(1);
      b += (y ? 'L' : 'M') + x2.toFixed(1) + ' ' + (32 + y).toFixed(1);
      if (Math.round(y / 3.5) % 2 === 0) r += '<line class="s-rung" style="animation-delay:' + (y / 56 * 1.2).toFixed(2) + 's" x1="' + x1.toFixed(1) + '" y1="' + (32 + y).toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + (32 + y).toFixed(1) + '" stroke="#f4d98c" stroke-width="1.2"/>';
    }
    return wrap('genotipado', 'Genotipado',
      '<defs>' + gold('g' + i) + '</defs><circle cx="60" cy="60" r="58" fill="url(#g' + i + ')"/><circle cx="60" cy="60" r="54" fill="#0f2a3a"/>' +
      '<circle cx="60" cy="60" r="51" fill="none" stroke="#f4d98c" stroke-width=".8"/>' + r +
      '<path class="s-draw" pathLength="100" d="' + a + '" fill="none" stroke="#fdeeb0" stroke-width="2.6" stroke-linecap="round"/>' +
      '<path class="s-draw s-draw2" pathLength="100" d="' + b + '" fill="none" stroke="#e8923c" stroke-width="2.6" stroke-linecap="round"/>' +
      '<text x="60" y="26" text-anchor="middle" font-family="Cinzel,serif" font-weight="800" font-size="9" letter-spacing="1.2" fill="#f4d98c">GENOTIPADO</text>' +
      '<text x="60" y="102" text-anchor="middle" font-family="Montserrat,sans-serif" font-weight="600" font-size="5.2" letter-spacing="2" fill="#f4d98c">ADN · VERIFICADO</text>');
  };

  /* Garantía: escudo con visto que se dibuja */
  T.garantia = function (o) {
    var i = ++uid, t = esc(o.text || 'GARANTÍA');
    return wrap('garantia', t,
      '<defs>' + gold('g' + i) + shine('h' + i) + '<clipPath id="c' + i + '"><path d="M60 6 L104 22 V58 C104 84 86 102 60 114 C34 102 16 84 16 58 V22 Z"/></clipPath></defs>' +
      '<path d="M60 6 L104 22 V58 C104 84 86 102 60 114 C34 102 16 84 16 58 V22 Z" fill="url(#g' + i + ')"/>' +
      '<path d="M60 14 L96 27 V58 C96 79 81 94 60 105 C39 94 24 79 24 58 V27 Z" fill="#2e170a"/>' +
      '<path class="s-draw" pathLength="100" d="M41 56 L55 70 L82 40" fill="none" stroke="#fdeeb0" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<text x="60" y="92" text-anchor="middle" font-family="Cinzel,serif" font-weight="800" font-size="' + (t.length > 8 ? 8 : 10) + '" letter-spacing="1" fill="#f4d98c">' + t + '</text>' +
      shineRect('h' + i, 'c' + i));
  };

  window.LRSeals = {
    types: Object.keys(T),
    render: function (seal, lot) {
      var o = Object.assign({}, seal);
      if (o.t === 'registro' && !o.text) o.text = lot && lot.registro;
      var fn = T[o.t];
      return fn ? fn(o) : '';
    }
  };
})();
