import React from 'react';
import { useLocation } from 'react-router-dom';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../../assets/styles/Result.css';
import clipboardIcon from '../../assets/images/copy.png';

function Result() {
  const location = useLocation();
  const response = location.state?.generatedWebsite?.content[0]?.text || '{}';

  let data;
  try {
    data = JSON.parse(response);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return <div>Error parsing the response. Please try again.</div>;
  }

  const pages = data.pages || [];

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).then(
      () => {
        alert('Code copied to clipboard!');
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  return (
    <div className="result-container">
      <h1>Generated Website Code</h1>
      {pages.map((page, pageIndex) => (
        <div className="page-section" key={pageIndex}>
          <h2>{page.pageName}</h2>
          {page.sections.map((section, sectionIndex) => (
            <div className="code-section" key={sectionIndex}>
              <h3>{section.sectionName}</h3>
              {section.jsCode && (
                <>
                  <h4>React Code</h4>
                  <div className="code-container">
                    <SyntaxHighlighter
                      language="javascript"
                      style={atomOneLight}
                      className="syntax-highlighter"
                    >
                      {section.jsCode}
                    </SyntaxHighlighter>
                    <img
                      src={clipboardIcon}
                      alt="Copy to clipboard"
                      className="clipboard-icon"
                      onClick={() => handleCopy(section.jsCode)}
                    />
                  </div>
                </>
              )}
              {section.cssCode && (
                <>
                  <h4>CSS Code</h4>
                  <div className="code-container">
                    <SyntaxHighlighter
                      language="css"
                      style={atomOneLight}
                      className="syntax-highlighter"
                    >
                      {section.cssCode}
                    </SyntaxHighlighter>
                    <img
                      src={clipboardIcon}
                      alt="Copy to clipboard"
                      className="clipboard-icon"
                      onClick={() => handleCopy(section.cssCode)}
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Result;
