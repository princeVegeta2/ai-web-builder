// src/components/pages/Result.js

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../assets/styles/Result.css';

function Result() {
  const [jsCode, setJsCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const location = useLocation();

  useEffect(() => {
    const response = location.state?.generatedWebsite || '';
    console.log('AI Response:', response);

    // Extract JavaScript code using the updated regex pattern
    const jsCodeMatch = response.match(/\/\/ JavaScript code start([\s\S]*?)\/\/ JavaScript code end/);
    const cssCodeMatch = response.match(/\/\* CSS code start \*\/([\s\S]*?)\/\* CSS code end \*\//);

    if (jsCodeMatch && jsCodeMatch[1]) {
      console.log('JavaScript Code Matched:', jsCodeMatch[1].trim());
      setJsCode(jsCodeMatch[1].trim());
    } else {
      console.log('No JavaScript code found');
    }

    if (cssCodeMatch && cssCodeMatch[1]) {
      console.log('CSS Code Matched:', cssCodeMatch[1].trim());
      setCssCode(cssCodeMatch[1].trim());
    } else {
      console.log('No CSS code found');
    }
  }, [location.state]);

  return (
    <div className="result-container">
      <h1>Generated Website Code</h1>
      <div className="code-section">
        <h2>JavaScript</h2>
        <textarea
          className="code-textarea"
          value={jsCode}
          readOnly
        />
      </div>
      <div className="code-section">
        <h2>CSS</h2>
        <textarea
          className="code-textarea"
          value={cssCode}
          readOnly
        />
      </div>
    </div>
  );
}

export default Result;
