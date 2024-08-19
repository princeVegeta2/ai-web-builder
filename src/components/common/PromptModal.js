// File: components/common/PromptModal.js
import React from 'react';
import '../../assets/styles/PromptModal.css';

const PromptModal = ({ isOpen, onClose, windows, setWindows, currentWidget }) => {
  if (!isOpen) return null;

  const { windowId, widgetId } = currentWidget;

  const handlePromptChange = (value) => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? {
          ...window,
          widgets: window.widgets.map(widget =>
            widget.id === widgetId
              ? { ...widget, promptString: value }
              : widget
          )
        }
        : window
    );
    setWindows(updatedWindows);
  };

  const closePromptModal = () => {
    onClose();
    if (currentWidget) {
      const widget = windows.find(w => w.id === windowId).widgets.find(w => w.id === widgetId);
      console.log('Prompt:', widget.promptString);
    }
  };

  const promptString = windows.find(w => w.id === windowId).widgets.find(w => w.id === widgetId).promptString;

  return (
    <div className="prompt-modal-overlay">
      <div className="prompt-modal">
        <div className="prompt-modal-header">
          <h2>Prompt</h2>
          <button className="close-button" onClick={closePromptModal}>X</button>
        </div>
        <div className="prompt-modal-body">
          <textarea
            className="prompt-input"
            value={promptString}
            onChange={(e) => handlePromptChange(e.target.value)}
            placeholder="Enter your prompt here"
          />
        </div>
      </div>
    </div>
  );
};

export default PromptModal;
