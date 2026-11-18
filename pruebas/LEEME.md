# Pruebas del catálogo

Herramientas de verificación de interfaz. No forman parte de la web (el Dockerfile no las copia).

## Preparación (una vez)

```sh
mkdir -p ~/.cache/laribera-pruebas && cd ~/.cache/laribera-pruebas
npm init -y && PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm i playwright-core@1.48.2 axe-core@4.10.2 lighthouse@11.7.1
ln -sfn ~/.cache/laribera-pruebas/node_modules <repo>/pruebas/node_modules
```

`playwright-core` debe corresponder al Chromium instalado (1.48.2 ↔ `~/.cache/ms-playwright/chromium-1140`);
otro Chromium se indica con la variable `CHROME`.

## Servir la web

Como en producción (recomendado): `docker build -t laribera . && docker run --rm -p 127.0.0.1:8080:8080 laribera`.
Sin Docker: `python3 pruebas/servir.py 8080`. Imita la regla de nginx que convierte `/v<versión>/css/…` en `/css/…`.
`python3 -m http.server` ya no sirve: no conoce las rutas versionadas.

## Pruebas

| Comando | Qué revisa |
|---|---|
| `node pruebas/auditar.js http://127.0.0.1:8080/ /tmp/auditoria` | capturas, axe WCAG 2.2 AA, desbordes, áreas táctiles, letra mínima, teclado y visor en 360/768/1366/1920 px |
| `python3 pruebas/resumen.py auditoria /tmp/auditoria/informe.json` | resumen de lo anterior |
| `node pruebas/encaje.js http://127.0.0.1:8080/` | que las 44 páginas quepan en 8 tamaños de teléfono y tableta (sale con error si no) |
| `node pruebas/lighthouse.mjs <url> movil /tmp/lh-1.json` | Lighthouse móvil o `escritorio` |
| `python3 pruebas/resumen.py lighthouse móvil /tmp/lh-*.json` | mediana de varias pasadas |
