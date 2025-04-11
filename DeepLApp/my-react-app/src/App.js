//App.js

import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Translator from './Translator';
import Landing from './Landing';

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
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light'); // Save theme to localStorage
      return newMode;
    });
  };

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
      <button className={`toggle ${isDarkMode ? 'dark' : ''}`} onClick={toggleTheme}>
        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>

      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/translator" element={<Translator />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
