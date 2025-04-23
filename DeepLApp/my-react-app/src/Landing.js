//Landing.js
import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Landing({ darkMode }) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh', // Occupy the full viewport height
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: darkMode ? 'background.default' : '#f7f7f7', // Use dynamic background
        color: darkMode ? 'text.primary' : '#000', // Use dynamic text color
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Welcome to Translation Suite
        </Typography>
        <Typography variant="h6" paragraph>
          A powerful tool to translate your documents with ease. Let's get started!
        </Typography>
        {/* <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/translator')}
            sx={{ borderRadius: 3 }}
          >
            Document Translator
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            size="large"
            href="https://chatai.noricangroup.com/login"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ borderRadius: 3 }}
          >
            Open LibreChat
          </Button>
        </Box> */}
      </Container>
    </Box>
  );
}