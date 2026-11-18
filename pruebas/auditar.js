// Auditoría de interfaz: capturas, axe (WCAG 2.2 A/AA), desbordes, áreas táctiles y letra mínima
// en 360, 768, 1366 y 1920 px, más teclado y visor a pantalla completa.
// Uso: node pruebas/auditar.js <url> <carpeta-salida>      (requiere pruebas/node_modules, ver pruebas/LEEME.md)
const { chromium } = require('playwright-core');
const fs = require('fs'), path = require('path');
const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const [BASE, OUT] = process.argv.slice(2);
fs.mkdirSync(OUT, { recursive: true });
const ANCHOS = [[360, 800, true], [768, 1024, true], [1366, 768, false], [1920, 1080, false]];
const CHROME = process.env.CHROME || process.env.HOME + '/.cache/ms-playwright/chromium-1140/chrome-linux/chrome';

async function medir(page) {
  await page.evaluate(AXE);
  const axe = await page.evaluate(async () => {
    const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } });
    return r.violations.map(v => ({ id: v.id, impact: v.impact, n: v.nodes.length, ej: v.nodes.slice(0, 3).map(x => x.target.join(' ') + ' :: ' + (x.failureSummary || '').split('\n').slice(1, 2).join('').slice(0, 140)) }));
  });
  const extra = await page.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
    const pequenos = [...document.querySelectorAll('a,button,select,input,[role=button]')].filter(vis)
      .filter(e => { const r = e.getBoundingClientRect(); return r.width < 24 || r.height < 24; })
      .map(e => (e.id || e.className || e.tagName).toString().slice(0, 40) + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height));
    let min = 99, minEl = '';
    for (const e of document.querySelectorAll('body *')) {
      if (!vis(e) || e.closest('svg')) continue;   // el texto de los sellos SVG es decorativo
      if (![...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1)) continue;
      const f = parseFloat(getComputedStyle(e).fontSize);
      if (f < min) { min = f; minEl = String(e.className || e.tagName).slice(0, 40) + ': ' + e.textContent.trim().slice(0, 30); }
    }
    return { desborde: document.documentElement.scrollWidth > innerWidth ? document.documentElement.scrollWidth : false, pequenos, fuenteMin: Math.round(min * 10) / 10, fuenteMinEl: minEl };
  });
  return { axe, ...extra };
}

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
  const informe = {};
  for (const [w, h, movil] of ANCHOS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: movil, hasTouch: movil, deviceScaleFactor: 1, locale: 'es-BO' });
    const page = await ctx.newPage();
    const errores = [];
    page.on('console', m => { if (m.type() === 'error') errores.push(m.text().slice(0, 160)); });
    page.on('pageerror', e => errores.push('pageerror: ' + e.message.slice(0, 160)));
    const t0 = Date.now();
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForFunction(() => !document.body.classList.contains('intro-on'), null, { timeout: 15000 }).catch(() => {});
    const r = { introMs: Date.now() - t0, vistas: {} };
    await page.waitForTimeout(1500);
    const opciones = await page.evaluate(() => [...document.querySelectorAll('#goto option')].map(o => o.textContent));
    const total = opciones.length;
    r.paginas = total;
    const idx = { portada: 0, bienvenida: 1, agenda: 2, lote1: 3, lote3: 5, patrocinadores: total - 3, contacto: total - 2, contraportada: total - 1 };
    for (const [nombre, i] of Object.entries(idx)) {
      if (i > 0) { await page.selectOption('#goto', String(i)); await page.waitForTimeout(2600); }
      await page.screenshot({ path: path.join(OUT, `${w}-${nombre}.png`) });
      r.vistas[nombre] = { opcion: opciones[i], ...(await medir(page)) };
    }
    await page.selectOption('#goto', '3'); await page.waitForTimeout(1500);
    const c1 = await page.textContent('#counter');
    await page.locator('body').focus(); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(1500);
    r.teclado = { antes: c1, despues: await page.textContent('#counter') };
    await page.locator('#btnNext').focus();
    r.focoSiguiente = await page.evaluate(() => { const s = getComputedStyle(document.activeElement); return s.outlineStyle + ' ' + s.outlineWidth; });
    const full = page.locator('.page.is-visible .v-full').first();
    if (await full.count()) {
      await full.click(); await page.waitForTimeout(1200);
      r.visor = await page.evaluate(() => ({ abierto: document.documentElement.classList.contains('lb-open'), foco: document.activeElement && document.activeElement.className }));
      await page.screenshot({ path: path.join(OUT, `${w}-visor.png`) });
      await page.keyboard.press('Escape'); await page.waitForTimeout(400);
      if (await page.evaluate(() => document.documentElement.classList.contains('lb-open'))) { await page.keyboard.press('Escape'); await page.waitForTimeout(400); }
      r.visor.cerrado = !(await page.evaluate(() => document.documentElement.classList.contains('lb-open')));
    }
    // axe descarga las hojas de estilo para revisar contraste; sus avisos de CSP no son de la página.
    r.errores = errores.filter(e => !/Refused to connect/.test(e));
    informe[w] = r;
    await ctx.close();
  }
  fs.writeFileSync(path.join(OUT, 'informe.json'), JSON.stringify(informe, null, 1));
  await browser.close();
  console.log('listo', OUT);
})().catch(e => { console.error(e); process.exit(1); });
