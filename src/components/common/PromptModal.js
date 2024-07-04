// File: components/common/PromptModal.js
import React from 'react';
import '../../assets/styles/PromptModal.css';

const PromptModal = ({ isOpen, onClose, promptString, handlePromptChange, windowId, widgetId }) => {
  if (!isOpen) return null;

  return (
    <div className="prompt-modal-overlay">
      <div className="prompt-modal">
        <div className="prompt-modal-header">
          <h2>Prompt</h2>
          <button className="close-button" onClick={onClose}>X</button>
        </div>
        <div className="prompt-modal-body">
          <textarea
            className="prompt-input"
            value={promptString}
            onChange={(e) => handlePromptChange(windowId, widgetId, e.target.value)}
            placeholder="Enter your prompt here"
          />
        </div>
      </div>
    </div>
  );
};

export default PromptModal;
