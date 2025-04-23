//Translator.js
import React, { useState } from 'react';
import {
  Button,
  Container,
  Typography,
  Box,
  Input,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

export default function Translator({ darkMode }) {
  const [file, setFile] = useState(null); // File upload state
  const [targetLang, setTargetLang] = useState('EN-GB'); // Default target language
  const [loading, setLoading] = useState(false); // Handle loading state
  const [translation, setTranslation] = useState(null); // Backend response

  const API_BASE = 'http://10.54.0.8:5000'; // Backend URL

  const supportedLanguages = [
    { code: 'AR', name: 'Arabic' },
    { code: 'BG', name: 'Bulgarian' },
    { code: 'CS', name: 'Czech' },
    { code: 'DA', name: 'Danish' },
    { code: 'DE', name: 'German' },
    { code: 'EL', name: 'Greek' },
    { code: 'EN-GB', name: 'English (British)' },
    { code: 'EN-US', name: 'English (American)' },
    { code: 'ES', name: 'Spanish' },
    { code: 'ET', name: 'Estonian' },
    { code: 'FI', name: 'Finnish' },
    { code: 'FR', name: 'French' },
    { code: 'HU', name: 'Hungarian' },
    { code: 'ID', name: 'Indonesian' },
    { code: 'IT', name: 'Italian' },
    { code: 'JA', name: 'Japanese' },
    { code: 'KO', name: 'Korean' },
    { code: 'LT', name: 'Lithuanian' },
    { code: 'LV', name: 'Latvian' },
    { code: 'NB', name: 'Norwegian Bokmål' },
    { code: 'NL', name: 'Dutch' },
    { code: 'PL', name: 'Polish' },
    { code: 'PT-BR', name: 'Portuguese (Brazilian)' },
    { code: 'PT-PT', name: 'Portuguese (European)' },
    { code: 'RO', name: 'Romanian' },
    { code: 'RU', name: 'Russian' },
    { code: 'SK', name: 'Slovak' },
    { code: 'SL', name: 'Slovenian' },
    { code: 'SV', name: 'Swedish' },
    { code: 'TR', name: 'Turkish' },
    { code: 'UK', name: 'Ukrainian' },
    { code: 'ZH-HANS', name: 'Chinese (Simplified)' },
    { code: 'ZH-HANT', name: 'Chinese (Traditional)' },
  ];

  // **Handle file selection**
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      console.log('Selected file:', selectedFile); // Debug: Log selected file
    }
    setFile(selectedFile || null); // Set the selected file or null if none
  };

  // **Handle the translation process**
  const handleTranslate = async () => {
    if (!file || !targetLang) {
      alert('Please select a file and target language.');
      return;
    }

    setLoading(true); // Mark as loading

    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_lang', targetLang);

    console.log('FormData contents:'); // Debug FormData
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`); // Should log `file: [object File]` and `target_lang: EN-GB`
    }

    try {
      const response = await fetch(`${API_BASE}/translate`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.text(); // Extract error message as text
        console.error('Backend returned error:', {
          status: response.status,
          statusText: response.statusText,
          message: errorMessage,
        });
        alert(`Error: ${response.status} ${response.statusText}\n${errorMessage}`);
        return;
      }

      // Process success response
      const data = await response.json();
      console.log('Translation response:', data); // Debug response
      setTranslation(data);
      alert('Translation process started successfully! You can now download the translated file when ready.');
    } catch (error) {
      console.error('Network error while uploading file:', error); // Debug network error
      alert(`Failed to connect to the server.\n${error.message}`);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: darkMode ? 'background.default' : '#e8f4f8',
        color: darkMode ? 'text.primary' : '#000',
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Translate Your Document
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" paragraph>
            Upload your document and select the target language to get started.
          </Typography>

          {/* Language Dropdown */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Target Language</InputLabel>
            <Select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              label="Target Language"
            >
              {supportedLanguages.map((language) => (
                <MenuItem key={language.code} value={language.code}>
                  {language.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* File Upload */}
          <Input
            type="file"
            sx={{ display: 'none' }}
            id="file-input"
            onChange={handleFileChange}
          />
          <label htmlFor="file-input">
            <Button variant="contained" component="span" color="primary" sx={{ borderRadius: 3, width: '100%' }}>
              Choose File
            </Button>
          </label>
          {file && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected File: {file.name}
            </Typography>
          )}
        </Box>

        {/* Translate Button */}
        <Button
          variant="contained"
          color="secondary"
          disabled={!file || loading}
          onClick={handleTranslate}
          sx={{ borderRadius: 3, width: '100%' }}
        >
          {loading ? 'Translating...' : 'Translate Document'}
        </Button>

        {/* Download Link */}
        {translation && (
          <Box sx={{ mt: 3 }}>
            <a
              href={`${API_BASE}/download/${translation.download_id}`}
              target="_blank"
              rel="noopener noreferrer"
              download={translation.filename}
            >
              <Button variant="outlined" sx={{ borderRadius: 3 }}>
                Download Translated Document
              </Button>
            </a>
          </Box>
        )}
      </Container>
    </Box>
  );
}