import React from 'react';
import '../../assets/styles/PromptModal.css';

const PromptModal = ({ isOpen, onClose, windows, setWindows, currentWidget, currentProjectName, serverModalValuesURL }) => {
  if (!isOpen) return null;

  const { windowId, widgetId } = currentWidget;

  const handlePromptChange = (value) => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? {
            ...window,
            widgets: window.widgets.map(widget =>
              widget.id === widgetId
                ? { ...widget, promptString: value, isChanged: true }
                : widget
            )
          }
        : window
    );
    setWindows(updatedWindows);
  };

  const handleSavePrompt = async () => {
    const widget = windows.find(w => w.id === windowId)?.widgets.find(w => w.id === widgetId);
    const promptString = widget?.promptString || '';

    if (!promptString.trim()) {
      alert('Prompt value cannot be empty.');
      return;
    }

    const widgetIndex = windows.find(w => w.id === windowId)?.widgets.findIndex(widget => widget.id === widgetId) + 1;
    const pageName = windows.find(w => w.id === windowId)?.name;

    // Find the modal position for this specific modal in the context of all modals attached to the widget
    const modalPosition = widget.modals.indexOf('prompt') + 1;

    if (!widget || !pageName || widgetIndex < 0 || !currentProjectName || modalPosition <= 0) {
      console.error('Error retrieving widget, page information, modal position, or project name.');
      return;
    }

    const payload = {
      position: 1, // Prompt is typically a single instance, so position is usually 1
      promptValue: promptString.trim(),
      projectName: currentProjectName,
      pageName: pageName,
      modalType: 'prompt',
      widgetPosition: widgetIndex,
      modalPosition: modalPosition, // This is the correct position within all modals
    };

    console.log(`Payload:`, payload);

    try {
      const response = await fetch(`${serverModalValuesURL}/add-prompt/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = typeof errorData === 'object' ? JSON.stringify(errorData) : errorData;
        } catch (e) {
          errorMessage = await response.text();
        }
        alert(`Failed to add prompt: ${errorMessage}`);
        return;
      }

      // If save is successful, mark the prompt as saved and disable editing
      const updatedWindows = windows.map(window =>
        window.id === windowId
          ? {
              ...window,
              widgets: window.widgets.map(widget =>
                widget.id === widgetId
                  ? { ...widget, promptString, isChanged: false, originalValue: promptString }
                  : widget
              )
            }
          : window
      );

      setWindows(updatedWindows);
      console.log('Prompt saved:', promptString);
      alert('Prompt saved successfully!');
    } catch (error) {
      console.error('Error adding prompt:', error);
      alert('An unexpected error occurred while adding the prompt.');
    }
  };

  const handleEditPrompt = () => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? {
            ...window,
            widgets: window.widgets.map(widget =>
              widget.id === widgetId
                ? { ...widget, isEditing: true }
                : widget
            )
          }
        : window
    );

    setWindows(updatedWindows);
  };

  const handleCancelEdit = () => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? {
            ...window,
            widgets: window.widgets.map(widget =>
              widget.id === widgetId
                ? { ...widget, promptString: widget.originalValue, isEditing: false }
                : widget
            )
          }
        : window
    );

    setWindows(updatedWindows);
  };

  const closePromptModal = () => {
    onClose();
    const widget = windows.find(w => w.id === windowId)?.widgets.find(w => w.id === widgetId);
    console.log('Prompt:', widget?.promptString);
  };

  const widget = windows.find(w => w.id === windowId)?.widgets.find(w => w.id === widgetId);
  const promptString = widget?.promptString || '';

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
            disabled={!widget.isEditing} // Disable textarea if not editing
          />
          {widget.isEditing ? (
            <>
              <button
                className="save-prompt-button"
                onClick={handleSavePrompt}
                disabled={!widget.isChanged}
              >
                Save
              </button>
              <button
                className="cancel-prompt-button"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="edit-prompt-button"
              onClick={handleEditPrompt}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptModal;
