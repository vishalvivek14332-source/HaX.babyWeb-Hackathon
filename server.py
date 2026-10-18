import http.server
import socketserver
import sys

class RobustHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable caching and CORS
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'public, max-age=3600')
        super().end_headers()

    def handle(self):
        try:
            super().handle()
        except (ConnectionResetError, BrokenPipeError, ConnectionAbortedError, TimeoutError):
            pass

    def log_message(self, format, *args):
        try:
            sys.stdout.write(f"[{self.log_date_time_string()}] {format % args}\n")
            sys.stdout.flush()
        except Exception:
            pass

class RobustThreadingServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True

if __name__ == '__main__':
    port = 8080
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    with RobustThreadingServer(('0.0.0.0', port), RobustHandler) as httpd:
        print(f"Pip's Workshop Server running at http://localhost:{port}/", flush=True)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
