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
    const jsCodeMatch = response.match(/\/\/ JavaScript code start([\s\S]*?)\/\/ JavaScript code end/);
    const cssCodeMatch = response.match(/\/\* CSS code start \*\/([\s\S]*?)\/\* CSS code end \*\//);

    if (jsCodeMatch) setJsCode(jsCodeMatch[1].trim());
    if (cssCodeMatch) setCssCode(cssCodeMatch[1].trim());
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