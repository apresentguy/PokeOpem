from flask import Flask, send_from_directory, jsonify
import os

app = Flask(__name__, static_folder='.', static_url_path='')
ROOT = os.path.dirname(os.path.abspath(__file__))
IMG_EXT = ('.jpg', '.jpeg', '.png', '.webp', '.gif')

@app.route('/')
def home():
    return send_from_directory(ROOT, 'index.html')

@app.route('/api/files')
def list_files():
    found = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if not d.startswith('.') and d not in ('venv', 'env', '__pycache__', 'node_modules')]
        for f in filenames:
            if f.lower().endswith(IMG_EXT):
                rel = os.path.relpath(os.path.join(dirpath, f), ROOT).replace(os.sep, '/')
                found.append(rel)
    return jsonify(found)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)))
