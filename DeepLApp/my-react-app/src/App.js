// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import Landing from './Landing';
import Translator from './Translator';
import Navbar from './Navbar';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check localStorage for saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Toggle light/dark mode
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light'); // Save theme to localStorage
      return newMode;
    });
  };

  // Create Material-UI themes
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      background: { default: '#f5f5f5' },
      text: { primary: '#000' },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: { default: '#121212' },
      text: { primary: '#ffffff' },
    },
  });

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Box
        sx={{
          minHeight: '100vh', // Ensure full viewport coverage
          backgroundColor: 'background.default', // Apply theme background
          color: 'text.primary', // Apply theme text color
          display: 'flex', // Ensure full app layout
          flexDirection: 'column',
        }}
      >
        <Router>
          {/* Render Navbar */}
          <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          <Routes>
            <Route path="/" element={<Landing darkMode={isDarkMode} />} />
            <Route path="/translator" element={<Translator darkMode={isDarkMode} />} />
          </Routes>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

export default App;