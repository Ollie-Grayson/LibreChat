from flask import Flask, jsonify, request, send_from_directory
from werkzeug.utils import safe_join
import os
import uuid
import requests
import time

app = Flask(__name__, static_folder="/home/azureuser/LibreChat/DeepLApp/my-react-app/build", static_url_path="")

# DeepL API configuration
DEEPL_API_KEY = '7ac3ec65-b648-43fc-93cb-42cad99a3236'
DEEPL_API_URL = 'https://api.deepl.com/v2/document'  # DeepL Pro API URL

# File upload directories
UPLOAD_FOLDER = '/home/azureuser/LibreChat/uploads'
TRANSLATED_FOLDER = '/home/azureuser/LibreChat/translated'

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(TRANSLATED_FOLDER, exist_ok=True)

# Allowed file extensions for translation
ALLOWED_EXTENSIONS = {'docx', 'pptx', 'xlsx', 'pdf', 'htm', 'html', 'txt', 'xlf', 'xliff', 'srt'}


def allowed_file(filename):
    """Check if the file type is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/")
def serve_react():
    """Serve the React frontend."""
    print("Serving React app...")
    return send_from_directory(app.static_folder, "index.html")


@app.route("/translate", methods=["POST"])
def translate_document():
    print("Translation request received.")

    # Validate file
    if 'file' not in request.files:
        print("Error: No file uploaded!")
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']

    target_lang = request.form.get('target_lang', None)  # Target language
    if not target_lang:
        print("Error: No target language provided!")
        return jsonify({'error': 'No target language provided'}), 400

    # Validate file type
    if file.filename == '':
        print("Error: No filename provided.")
        return jsonify({'error': 'No filename provided'}), 400
    if not allowed_file(file.filename):
        print(f"Error: Unsupported file type {file.filename}")
        return jsonify({'error': f'Unsupported file type {file.filename}'}), 400

    # Save file locally
    file_extension = file.filename.rsplit('.', 1)[1].lower()
    file_id = str(uuid.uuid4())
    saved_filename = f"{file_id}.{file_extension}"
    original_path = os.path.join(UPLOAD_FOLDER, saved_filename)
    print(f"Storing file locally as {saved_filename}")
    file.save(original_path)

    try:
        # Upload file to DeepL API
        print(f"Sending file to DeepL API for translation to {target_lang}...")
        with open(original_path, 'rb') as f:
            response = requests.post(
                DEEPL_API_URL,
                headers={'Authorization': f'DeepL-Auth-Key {DEEPL_API_KEY}'},
                data={'target_lang': target_lang},
                files={'file': (saved_filename, f, 'application/octet-stream')}
            )
            print(f"DeepL Upload Response: {response.status_code} {response.text}")
            response.raise_for_status()

        # Get document ID and key
        data = response.json()
        document_id = data.get('document_id')
        document_key = data.get('document_key')
        if not document_id or not document_key:
            print("Error: Missing document ID or document key.")
            return jsonify({'error': 'Error processing translation'}), 500

        # Poll for translation status
        print(f"Polling document status for Document ID: {document_id}")
        polling_delay = 5
        max_delay = 60
        status_url = f"{DEEPL_API_URL}/{document_id}"

        while True:
            status_response = requests.post(
                status_url,
                headers={'Authorization': f'DeepL-Auth-Key {DEEPL_API_KEY}'},
                data={'document_key': document_key}
            )
            print(f"DeepL Polling Response: {status_response.status_code} {status_response.text}")
            status_response.raise_for_status()

            status_data = status_response.json()
            if status_data['status'] == 'done':
                print("Translation completed successfully.")
                break
            elif status_data['status'] == 'error':
                print(f"Translation error: {status_data.get('message', 'Unknown error')}")
                return jsonify({'error': status_data.get('message', 'Unknown error')}), 500

            time.sleep(polling_delay)
            polling_delay = min(polling_delay * 2, max_delay)

        # Download the translated document
        print("Downloading the translated document...")
        download_response = requests.post(
            f"{status_url}/result",
            headers={'Authorization': f'DeepL-Auth-Key {DEEPL_API_KEY}', 'Content-Type': 'application/json'},
            json={'document_key': document_key}
        )
        print(f"DeepL Download Response: {download_response.status_code} Length: {len(download_response.content)}")
        download_response.raise_for_status()

        # Save translated file
        translated_filename = f"{file_id}.{file_extension}"
        translated_path = os.path.join(TRANSLATED_FOLDER, translated_filename)
        with open(translated_path, 'wb') as f:
            f.write(download_response.content)

        print(f"Translated file saved successfully at {translated_path}")
        return jsonify({'download_id': translated_filename, 'filename': file.filename})

    except requests.exceptions.RequestException as e:
        print(f"DeepL API RequestException: {e}")
        return jsonify({'error': 'Error connecting to DeepL API', 'details': str(e)}), 500
    except Exception as e:
        print(f"Internal Server Error: {e}")
        return jsonify({'error': 'An internal server error occurred', 'details': str(e)}), 500


@app.route("/download/<file_id>", methods=["GET"])
def download_file(file_id):
    """Serve the translated file for download."""
    try:
        print(f"Download request received for File ID: {file_id}")
        filepath = safe_join(TRANSLATED_FOLDER, file_id)
        if not os.path.exists(filepath):
            print(f"File not found: {filepath}")
            return jsonify({'error': 'File not found'}), 404
        return send_from_directory(TRANSLATED_FOLDER, file_id, as_attachment=True)
    except Exception as e:
        print(f"Error serving file: {e}")
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)