import React, { useState } from 'react';

const DeepLTranslator = () => {
  const [file, setFile] = useState(null);
  const [sourceLanguage, setSourceLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <div className="container">
      <h1>DeepL Document Translator</h1>
      <input type="file" onChange={handleFileChange} />
      <div>
        <label>
          Source Language:
          <select value={sourceLanguage} onChange={(e) => setSourceLanguage(e.target.value)}>
            <option value="">Select source language</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            {/* Add more languages as needed */}
          </select>
        </label>
      </div>
      <div>
        <label>
          Target Language:
          <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
            <option value="">Select target language</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            {/* Add more languages as needed */}
          </select>
        </label>
      </div>
      {/* Add any other necessary elements or functionality */}
    </div>
  );
};

export default DeepLTranslator;