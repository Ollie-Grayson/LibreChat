import requests

DEEPL_API_KEY = '7ac3ec65-b648-43fc-93cb-42cad99a3236'
DEEPL_API_URL = 'https://api.deepl.com/v2/document'
TEST_FILE = 'DeepLApp/uploads/test_doc.pdf'  # Replace with any supported file you have
TARGET_LANG = 'EN'

try:
    print("Sending test request to DeepL API...")

    with open(TEST_FILE, 'rb') as f:
        response = requests.post(
            DEEPL_API_URL,
            headers={'Authorization': f'DeepL-Auth-Key {DEEPL_API_KEY}'},
            data={'target_lang': TARGET_LANG},
            files={'file': f}
        )
        print(f"Response Status: {response.status_code}")
        print(f"Response Body: {response.text}")
        response.raise_for_status()
        data = response.json()
        print("SUCCESS! DeepL API Response:", data)

except requests.exceptions.RequestException as e:
    print(f"ERROR connecting to DeepL API: {e}")