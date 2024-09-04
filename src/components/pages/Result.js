import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../assets/styles/Result.css';

function Result() {
  const [sections, setSections] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const response = location.state?.generatedWebsite || '';

    // Regular expressions to match the sections
    const sectionRegex = /\/\* (.*?) \*\//g;
    const jsCodeRegex = /\/\* React Code Start \*\/([\s\S]*?)\/\* React Code End \*\//g;
    const cssCodeRegex = /\/\* CSS Code Start \*\/([\s\S]*?)\/\* CSS Code End \*\//g;

    let match;
    let sectionsArray = [];

    // Iterate through the response to find all sections and extract their contents
    while ((match = sectionRegex.exec(response)) !== null) {
      const sectionName = match[1];
      //const sectionStartIndex = match.index;

      const jsMatch = jsCodeRegex.exec(response);
      const cssMatch = cssCodeRegex.exec(response);

      const jsCode = jsMatch ? jsMatch[1].trim() : '';
      const cssCode = cssMatch ? cssMatch[1].trim() : '';

      sectionsArray.push({ sectionName, jsCode, cssCode });

      // To prevent matching the same code block again
      if (jsMatch) {
        sectionRegex.lastIndex = jsCodeRegex.lastIndex;
      }
      if (cssMatch) {
        sectionRegex.lastIndex = cssCodeRegex.lastIndex;
      }
    }

    setSections(sectionsArray);
  }, [location.state]);

  return (
    <div className="result-container">
      <h1>Generated Website Code</h1>
      {sections.map((section, index) => (
        <div className="code-section" key={index}>
          <h2>{section.sectionName}</h2>
          <h3>React Code</h3>
          <textarea
            className="code-textarea"
            value={section.jsCode}
            readOnly
          />
          <h3>CSS Code</h3>
          <textarea
            className="code-textarea"
            value={section.cssCode}
            readOnly
          />
        </div>
      ))}
    </div>
  );
}

export default Result;
