#!/usr/bin/env python3
"""Resúmenes de las pruebas.
  python3 pruebas/resumen.py auditoria <informe.json>          axe, desbordes, letra y teclado por vista
  python3 pruebas/resumen.py lighthouse <etiqueta> <a.json> ... mediana de varias pasadas de Lighthouse
"""
import json, sys, collections, statistics as st

def auditoria(f):
    d = json.load(open(f)); tipos = collections.Counter(); nodos = 0
    for w, r in d.items():
        print(f"== {w}px · {r['paginas']} páginas · telón {r['introMs']} ms · teclado {r['teclado']} · foco {r['focoSiguiente']} · visor {r.get('visor')}")
        for k, v in r['vistas'].items():
            for x in v['axe']:
                tipos[(x['id'], x['impact'])] += 1; nodos += x['n']
            print(f"   {k:15} axe={[(x['id'], x['n']) for x in v['axe']]} desborde={v['desborde']} pequeños={v['pequenos'][:3]} letraMín={v['fuenteMin']} ({v['fuenteMinEl'][:36]})")
        if r['errores']: print('   errores:', r['errores'][:4])
    print('TOTAL axe:', len(tipos), 'tipos,', nodos, 'nodos', tipos.most_common())

def lighthouse(etq, fs):
    R = [json.load(open(f)) for f in fs]
    med = lambda fn: st.median([fn(r) for r in R])
    sc = lambda k: med(lambda r: round(r['categories'][k]['score'] * 100))
    au = lambda k: med(lambda r: r['audits'][k]['numericValue'])
    print(etq.ljust(18), f"n={len(R)} rendimiento={sc('performance')} accesibilidad={sc('accessibility')} buenas={sc('best-practices')} seo={sc('seo')} | "
          f"LCP {au('largest-contentful-paint')/1000:.2f}s TBT {au('total-blocking-time'):.0f}ms CLS {au('cumulative-layout-shift'):.3f} | "
          f"{au('total-byte-weight')/1024:.0f} KB | por pasada {[round(r['categories']['performance']['score']*100) for r in R]}")

if __name__ == '__main__':
    if sys.argv[1] == 'auditoria': auditoria(sys.argv[2])
    else: lighthouse(sys.argv[2], sys.argv[3:])
