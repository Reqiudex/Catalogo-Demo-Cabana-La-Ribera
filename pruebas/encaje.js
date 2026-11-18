// Comprueba que las 44 páginas caben en modo una página (teléfonos y tableta vertical) y mide la letra
// de la ficha del lote. Uso: node pruebas/encaje.js <url> [css-extra-a-probar]
const { chromium } = require('playwright-core'); const fs = require('fs');
const [url, cssFile] = process.argv.slice(2);
const css = cssFile ? fs.readFileSync(cssFile, 'utf8') : '';
const CHROME = process.env.CHROME || process.env.HOME + '/.cache/ms-playwright/chromium-1140/chrome-linux/chrome';
(async () => {
  const b = await chromium.launch({ executablePath: CHROME });
  let fallos = 0;
  for (const [w, h] of [[360, 640], [375, 667], [360, 740], [375, 812], [360, 800], [390, 844], [412, 915], [768, 1024]]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true })).newPage();
    await p.goto(url + (url.includes('?') ? '&' : '?') + 'lite=1', { waitUntil: 'load' });
    if (css) await p.addStyleTag({ content: css });
    await p.waitForTimeout(2500);
    const r = await p.evaluate(() => {
      const out = { desbordes: [], minGap: 999, minGapPag: '', pagina: null };
      [...document.querySelectorAll('.page')].forEach((pg, i) => {
        let el = pg; const rest = [];
        while (el && el !== document.body) { if (el.hidden) { el.hidden = false; rest.push(el); } el = el.parentElement; }
        const pr = pg.getBoundingClientRect(); if (!out.pagina) out.pagina = Math.round(pr.width) + 'x' + Math.round(pr.height);
        if (pg.scrollHeight > pg.clientHeight + 1) out.desbordes.push((i + 1) + ':' + (pg.scrollHeight - pg.clientHeight));
        if (pg.classList.contains('page--lot')) {
          const cta = pg.querySelector('.cta'), last = [...pg.querySelectorAll('.lot-note,.lot-desc,.spec')].pop();
          const g = Math.round(cta.getBoundingClientRect().top - last.getBoundingClientRect().bottom);
          if (g < out.minGap) { out.minGap = g; out.minGapPag = i + 1; }
        }
        rest.forEach(e => e.hidden = true);
      });
      const pg = document.querySelector('.page--lot'); const f = s => { const e = pg.querySelector(s); return e ? Math.round(parseFloat(getComputedStyle(e).fontSize) * 10) / 10 : null; };
      out.fuentes = { etiqueta: f('.spec dt'), valor: f('.spec dd'), nota: f('.lot-note'), descripcion: f('.lot-desc'), boton: f('.cta') };
      return out;
    });
    const mal = r.minGap < 4 || r.desbordes.length;
    if (mal) fallos++;
    console.log(`${mal ? 'FALLA' : 'OK   '} ${w}x${h} página ${r.pagina} · espacio sobre "Consultar" ${r.minGap}px (pág ${r.minGapPag}) · desbordes ${r.desbordes.join(',') || 'ninguno'} · letra ${JSON.stringify(r.fuentes)}`);
  }
  await b.close();
  process.exit(fallos ? 1 : 0);
})();
