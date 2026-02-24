from http.server import BaseHTTPRequestHandler
import json
import os

# Optional: import supabase if you want server-side insertion
# from supabase import create_client, Client

class handler(BaseHTTPRequestHandler):
    """
    Serverless Python handler for Vercel.
    POST /api/contact — Receives contact form submissions.
    """

    def do_OPTIONS(self):
        """Handle CORS preflight."""
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()

    def do_POST(self):
        """Handle contact form submission."""
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body)

            name = data.get('name', '').strip()
            email = data.get('email', '').strip()
            message = data.get('message', '').strip()

            # Validation
            if not name or not email or not message:
                self._send_json(400, {
                    'success': False,
                    'error': 'All fields (name, email, message) are required.'
                })
                return

            if '@' not in email or '.' not in email:
                self._send_json(400, {
                    'success': False,
                    'error': 'Please provide a valid email address.'
                })
                return

            # ---- Store in Supabase (optional, uncomment when configured) ----
            # supabase_url = os.environ.get('SUPABASE_URL')
            # supabase_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
            #
            # if supabase_url and supabase_key:
            #     client: Client = create_client(supabase_url, supabase_key)
            #     client.table('contact_messages').insert({
            #         'name': name,
            #         'email': email,
            #         'message': message
            #     }).execute()

            self._send_json(200, {
                'success': True,
                'message': f'Thank you, {name}! Your message has been received.'
            })

        except json.JSONDecodeError:
            self._send_json(400, {
                'success': False,
                'error': 'Invalid JSON body.'
            })
        except Exception as e:
            self._send_json(500, {
                'success': False,
                'error': 'Internal server error.'
            })

    def _send_json(self, status_code, data):
        """Send a JSON response with CORS headers."""
        self.send_response(status_code)
        self._set_cors_headers()
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def _set_cors_headers(self):
        """Set CORS headers for cross-origin requests."""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
