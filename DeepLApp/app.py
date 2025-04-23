from flask import Flask, jsonify, request, send_from_directory
from werkzeug.utils import secure_filename
import os
import uuid
import requests
import time
import logging

app = Flask(__name__, static_folder="my-react-app/build", static_url_path="")

# Configure logging for debugging
logging.basicConfig(level=logging.INFO)

# DeepL API configuration
DEEPL_API_KEY = os.getenv('DEEPL_API_KEY', '7ac3ec65-b648-43fc-93cb-42cad99a3236')  # Replace with your paid API key
DEEPL_API_URL = 'https://api.deepl.com/v2/document'  # Paid DeepL endpoint

# Upload folder settings
UPLOAD_FOLDER = './uploads'
TRANSLATED_FOLDER = './translated'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(TRANSLATED_FOLDER, exist_ok=True)

# File size limit (Set to 100 MB for large files)
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # Allow files up to 100 MB

# Supported file types
ALLOWED_EXTENSIONS = {'docx', 'pptx', 'xlsx', 'pdf', 'htm', 'html', 'txt', 'xlf', 'xliff', 'srt'}

# Utility function to check the extension of uploaded files
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/")
def serve_react():
    """Serve the React front-end app."""
    return send_from_directory(app.static_folder, "index.html")

@app.route("/translate", methods=["POST"])
def translate_document():
    logging.info("Translation request received!")

    if 'file' not in request.files:
        logging.error("Missing 'file' in request.files!")
        return jsonify({'error': 'File not found in request.files'}), 400

    if not request.form.get('target_lang'):
        logging.error("Target language not specified in request.form!")
        return jsonify({'error': 'Target language not specified'}), 400

    file = request.files['file']
    target_lang = request.form['target_lang']

    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Allowed types: ' + ', '.join(ALLOWED_EXTENSIONS)}), 400

    # Save file to the upload folder
    file_extension = file.filename.rsplit('.', 1)[1].lower()
    original_filename = secure_filename(file.filename.rsplit('.', 1)[0])  # Filename without extension
    file_id = str(uuid.uuid4())  # Unique ID for uploaded file
    saved_filename = secure_filename(file_id + '.' + file_extension)
    filepath = os.path.join(UPLOAD_FOLDER, saved_filename)

    try:
        file.save(filepath)
        logging.info(f"File successfully saved: {filepath}")
    except Exception as e:
        logging.error(f"Failed to save file locally: {str(e)}")
        return jsonify({'error': 'Failed to save uploaded file', 'details': str(e)}), 500

    # Upload the file to DeepL
    try:
        with open(filepath, 'rb') as f:
            response = requests.post(
                DEEPL_API_URL,
                headers={'Authorization': f'DeepL-Auth-Key {DEEPL_API_KEY}'},
                data={'target_lang': target_lang},
                files={'file': (saved_filename, f)}
            )
        response.raise_for_status()
        data = response.json()
        logging.info(f"DeepL Upload Response: {data}")
    except requests.exceptions.RequestException as e:
        logging.error(f"Error during DeepL API upload: {str(e)}")
        return jsonify({'error': 'Failed to upload file to DeepL', 'details': str(e)}), 500

    # Start polling for translation status
    document_id = data['document_id']
    document_key = data['document_key']
    polling_url = f'{DEEPL_API_URL}/{document_id}'
    logging.info(f"Polling Translation Status for Document ID: {document_id}")

    while True:
        try:
            status_response = requests.post(
                polling_url,
                headers={'Authorization': f'DeepL-Auth-Key {DEEPL_API_KEY}'},
                data={'document_key': document_key}
            )
            status_response.raise_for_status()
            status_data = status_response.json()
            logging.info(f"Translation Status: {status_data}")

            if status_data['status'] == 'done':
                break
            elif status_data['status'] == 'error':
                error_message = status_data.get('message', 'Unknown error during translation')
                logging.error(f"Translation Error: {error_message}")
                return jsonify({'error': 'Translation failed', 'details': error_message}), 500

            time.sleep(5)  # Poll every 5 seconds
        except requests.exceptions.RequestException as e:
            logging.error(f"Error during translation status polling: {str(e)}")
            return jsonify({'error': 'Failed to poll translation status', 'details': str(e)}), 500

    # Download the translated file
    try:
        download_response = requests.post(
            f'{polling_url}/result',
            headers={'Authorization': f'DeepL-Auth-Key {DEEPL_API_KEY}'},
            data={'document_key': document_key}
        )
        
        translated_filename = f"{original_filename}_{target_lang}.{file_extension}"  # Append language to original filename
        translated_path = os.path.join(TRANSLATED_FOLDER, translated_filename)
        with open(translated_path, 'wb') as f:
            f.write(download_response.content)
        logging.info(f"Translated file saved: {translated_path}")
    except Exception as e:
        logging.error(f"Error during DeepL file download: {str(e)}")
        return jsonify({'error': 'Failed to download translated file', 'details': str(e)}), 500

    # Cleanup original file
    try:
        os.remove(filepath)
        logging.info(f"Original file removed: {filepath}")
    except Exception as e:
        logging.error(f"Failed to delete original file: {str(e)}")

    return jsonify({'download_id': translated_filename, 'filename': file.filename})

@app.route("/download/<file_id>")
def download_file(file_id):
    filepath = os.path.join(TRANSLATED_FOLDER, file_id)
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404
    return send_from_directory(TRANSLATED_FOLDER, file_id, as_attachment=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)