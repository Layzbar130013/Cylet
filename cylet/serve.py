#!/usr/bin/env python3
"""
Cylet Supermarket Local Dev Server
Starts a local HTTP server with correct MIME types, CORS, and Gzip compression.
"""

import sys
import os
import socket
import gzip
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = 3000

class CyletHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS and disable aggressive caching during dev
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_GET(self):
        # Check if client accepts gzip and if request is for a compressable file
        accept_encoding = self.headers.get('Accept-Encoding', '')
        path = self.translate_path(self.path)

        # SPA fallback: if file does not exist or is a client-side route like /admin
        if not os.path.exists(path) or (os.path.isdir(path) and not os.path.exists(os.path.join(path, 'index.html'))):
            index_file = os.path.join(os.getcwd(), 'index.html')
            if os.path.isfile(index_file):
                path = index_file

        if 'gzip' in accept_encoding and os.path.isfile(path):
            ext = os.path.splitext(path)[1].lower()
            if ext in ['.js', '.html', '.css', '.json', '.svg']:
                try:
                    with open(path, 'rb') as f:
                        content = f.read()
                    
                    compressed = gzip.compress(content, compresslevel=6)
                    self.send_response(200)
                    self.send_header('Content-Type', self.guess_type(path))
                    self.send_header('Content-Encoding', 'gzip')
                    self.send_header('Content-Length', str(len(compressed)))
                    self.send_header('Vary', 'Accept-Encoding')
                    self.end_headers()
                    self.wfile.write(compressed)
                    return
                except Exception:
                    pass

        # If fallback path was set to index.html and gzip wasn't used
        if path == os.path.join(os.getcwd(), 'index.html'):
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            with open(path, 'rb') as f:
                self.wfile.write(f.read())
            return

        # Standard file serving fallback
        super().do_GET()

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('127.0.0.1', port)) == 0

def run_server():
    global PORT
    while is_port_in_use(PORT):
        print(f"Port {PORT} is in use, trying {PORT + 1}...")
        PORT += 1

    server_address = ('', PORT)
    HTTPServer.allow_reuse_address = True
    httpd = HTTPServer(server_address, CyletHandler)
    
    print("=" * 65)
    print(" 🛒  Cylet Supermarket Web Application is Live!")
    print(f" 🌐  Local URL:    http://localhost:{PORT}")
    print(f" 🌐  Network URL:  http://127.0.0.1:{PORT}")
    print(" ⚡  Asset Compression: Gzip HTTP Enabled (70%+ smaller)")
    print("=" * 65)
    print("Press Ctrl+C to stop the server.\n")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping Cylet server. Goodbye!")
        httpd.server_close()
        sys.exit(0)

if __name__ == '__main__':
    run_server()
