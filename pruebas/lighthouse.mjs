// Lighthouse 11 sobre un Chromium arrancado con Playwright (lanzado directamente, el Chromium 1140 de
// este servidor se cae al crear la pestaña). Uso: node pruebas/lighthouse.mjs <url> movil|escritorio <salida.json>
import { createRequire } from 'node:module'; import fs from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright-core');
const lighthouse = (await import('lighthouse')).default;
const [url, preset, salida] = process.argv.slice(2);
const puerto = 9300 + Math.floor(Math.random() * 600);
const CHROME = process.env.CHROME || process.env.HOME + '/.cache/ms-playwright/chromium-1140/chrome-linux/chrome';
const b = await chromium.launch({ executablePath: CHROME, args: ['--remote-debugging-port=' + puerto] });
const config = preset === 'escritorio' ? (await import('lighthouse/core/config/desktop-config.js')).default : undefined;
try {
  const r = await lighthouse(url, { port: puerto, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] }, config);
  fs.writeFileSync(salida, r.report);
} catch (e) { console.log('FALLA', String(e).split('\n')[0]); }
await b.close();
