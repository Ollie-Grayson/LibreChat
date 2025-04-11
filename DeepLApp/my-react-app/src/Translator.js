import React, { useState } from 'react';
import { Button, CircularProgress, Container, Typography, Box, Input, Select, MenuItem, FormControl, InputLabel, LinearProgress } from '@mui/material';

export default function Translator() {
  const [file, setFile] = useState(null); // Uploaded file state
  const [targetLang, setTargetLang] = useState('EN'); // Target language state
  const [translation, setTranslation] = useState(null); // Backend translation response
  const [loading, setLoading] = useState(false); // Translation request progress
  const [isFileReady, setIsFileReady] = useState(false); // File readiness state
  const [uploadProgress, setUploadProgress] = useState(0); // Simulated file upload progress

  const API_BASE = 'http://10.54.0.5:5000'; // Backend URL

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setIsFileReady(false);
      simulateUpload(uploadedFile); // Simulate upload progress (for demo purposes)
    } else {
      setFile(null);
      setIsFileReady(false);
      setUploadProgress(0);
    }
  };

  const simulateUpload = (file) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsFileReady(true); // Mark as ready once upload completes
      }
    }, 100); // Increase progress every 100ms
  };

  const handleTargetLangChange = (e) => {
    setTargetLang(e.target.value);
  };

  const handleTranslate = async () => {
    if (!file || !isFileReady) {
      alert('Please wait until the file is fully uploaded.');
      return;
    }

    setLoading(true);
    setIsFileReady(false);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_lang', targetLang);

    try {
      const response = await fetch(`${API_BASE}/translate`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setTranslation(data); // Backend returns { download_id, filename }
      } else {
        alert(data.error || 'Translation failed. Please try again.');
      }
    } catch (error) {
      alert('Error connecting to the server.');
      console.error('Translation Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#e8f4f8' }}>
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Document Translator
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" paragraph>
            Upload your document, select a target language, and we'll translate it for you!
          </Typography>

          {/* Target Language Dropdown */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Target Language</InputLabel>
            <Select value={targetLang} onChange={handleTargetLangChange} label="Target Language">
              <MenuItem value="EN">English</MenuItem>
              <MenuItem value="DE">German</MenuItem>
              <MenuItem value="FR">French</MenuItem>
              <MenuItem value="ES">Spanish</MenuItem>
              <MenuItem value="IT">Italian</MenuItem>
              <MenuItem value="NL">Dutch</MenuItem>
              <MenuItem value="PT">Portuguese</MenuItem>
              {/* Add more languages here */}
            </Select>
          </FormControl>

          {/* File Upload */}
          <Input type="file" sx={{ display: 'none' }} id="file-input" onChange={handleFileChange} />
          <label htmlFor="file-input">
            <Button variant="contained" component="span" color="primary" sx={{ borderRadius: 3, width: '100%' }}>
              Choose File
            </Button>
          </label>

          {uploadProgress > 0 && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2">{`Upload Progress: ${uploadProgress}%`}</Typography>
            </Box>
          )}
        </Box>

        {/* Translate Button */}
        <Button
          variant="contained"
          color="secondary"
          disabled={!isFileReady || loading}
          onClick={handleTranslate}
          sx={{ borderRadius: 3, width: '100%' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Translate Document'}
        </Button>

        {/* Download Translated File */}
        {translation && (
          <Box sx={{ mt: 3 }}>
            <a href={`${API_BASE}/download/${translation.download_id}`} download={translation.filename}>
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