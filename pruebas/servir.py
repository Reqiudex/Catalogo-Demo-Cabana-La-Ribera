#!/usr/bin/env python3
"""Servidor local de pruebas: sirve el repo como nginx en lo esencial.
/v<números>/ruta -> /ruta (versión de CSS/JS en la ruta) y /data/raw/ bloqueado.
Uso: python3 pruebas/servir.py [puerto]"""
import http.server, os, re, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class Manejador(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=RAIZ, **k)

    def translate_path(self, path):
        path = re.sub(r'^/v\d+/', '/', path)
        return super().translate_path(path)

    def do_GET(self):
        if re.match(r'^(/v\d+)?/data/raw/', self.path):
            self.send_error(403); return
        return super().do_GET()

if __name__ == '__main__':
    puerto = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    print(f'http://127.0.0.1:{puerto}/')
    http.server.ThreadingHTTPServer(('127.0.0.1', puerto), Manejador).serve_forever()
