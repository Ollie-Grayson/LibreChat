// Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function Navbar({ isDarkMode, toggleTheme }) {
  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Toolbar>
        {/* App Title */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Translation Suite
        </Typography>

        {/* Navigation Buttons */}
        <Box sx={{ flexGrow: 1, display: 'flex', gap: '16px' }}>
          {/* Home */}
          <Button
            component={Link}
            to="/"
            sx={{ color: 'inherit', textTransform: 'none' }}
          >
            Home
          </Button>

          {/* Document Translation */}
          <Button
            component={Link}
            to="/translator"
            sx={{ color: 'inherit', textTransform: 'none' }}
          >
            Document Translation
          </Button>

          {/* Go to LibreChat */}
          <Button
            href="https://chatai.noricangroup.com/login"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: 'inherit', textTransform: 'none' }}
          >
            Go to LibreChat
          </Button>
        </Box>

        {/* Theme Toggle Button */}
        <IconButton edge="end" color="inherit" onClick={toggleTheme}>
          {isDarkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}