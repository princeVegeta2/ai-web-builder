import React from 'react';
import plusSymbol from '../../assets/images/plus-symbol.png';
import '../../assets/styles/ColorModal.css';
import trashcan from '../../assets/images/trashcan.png';

const ColorModal = ({ isOpen, onClose, windows, setWindows, currentWidget, currentProjectName, serverModalValuesURL }) => {
  if (!isOpen) return null;

  const { windowId, widgetId } = currentWidget;

  const addColorInput = () => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? {
            ...window,
            widgets: window.widgets.map(widget =>
              widget.id === widgetId
                ? { 
                    ...widget, 
                    colors: [...(widget.colors || []), { id: Date.now(), value: '', isChanged: true, isEditing: true, originalValue: '' }] 
                  }
                : widget
            )
          }
        : window
    );
    setWindows(updatedWindows);
  };

  const removeColorInput = (colorId) => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? {
            ...window,
            widgets: window.widgets.map(widget =>
              widget.id === widgetId
                ? { 
                    ...widget, 
                    colors: (widget.colors || []).filter(color => color.id !== colorId) 
                  }
                : widget
            )
          }
        : window
    );
    setWindows(updatedWindows);
  };

  const handleColorChange = (colorId, value) => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? {
            ...window,
            widgets: window.widgets.map(widget =>
              widget.id === widgetId
                ? {
                    ...widget,
                    colors: (widget.colors || []).map(color =>
                      color.id === colorId 
                        ? { ...color, value: value || '', isChanged: true } 
                        : color
                    )
                  }
                : widget
            )
          }
        : window
    );

    console.log('Updated Colors:', updatedWindows); // Debugging the state update
    setWindows(updatedWindows);
  };

  const handleSaveColor = async (colorId) => {
    const widget = windows.find(w => w.id === windowId)?.widgets.find(w => w.id === widgetId);
    const colors = widget?.colors || [];
    const colorToSave = colors.find(color => color.id === colorId);
  
    if (!colorToSave || !colorToSave.value?.trim()) {
      alert('Color value cannot be empty.');
      return;
    }
  
    // Check for duplicates across other inputs (case-insensitive)
    const duplicate = colors.find(color => 
      color.id !== colorId && color.value?.trim().toLowerCase() === colorToSave.value.trim().toLowerCase()
    );
  
    if (duplicate) {
      alert('This color already exists in another input.');
      return;
    }
  
    const widgetIndex = windows.find(w => w.id === windowId)?.widgets.findIndex(widget => widget.id === widgetId) + 1;
    const pageName = windows.find(w => w.id === windowId)?.name;
  
    // Find the modal position for this specific modal in the context of all modals attached to the widget
    const modalPosition = widget.modals.indexOf('color') + 1;
  
    if (!widget || !pageName || widgetIndex < 0 || !currentProjectName || modalPosition < 0) {
      console.error('Error retrieving widget, page information, modal position, or project name.');
      return;
    }
  
    const payload = {
      position: colors.indexOf(colorToSave) + 1,
      color: colorToSave.value.trim(),
      projectName: currentProjectName,
      pageName: pageName,
      modalType: 'color',
      widgetPosition: widgetIndex,
      modalPosition: modalPosition, // This is the correct position within all modals
    };
  
    console.log(`Input Position: ${payload.position}, Widget position: ${payload.widgetPosition}, Modal position: ${payload.modalPosition}, ProjectName: ${payload.projectName}, PageName: ${payload.pageName}`);
  
    try {
      const response = await fetch(`${serverModalValuesURL}/add-color/`, {
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
        alert(`Failed to add color: ${errorMessage}`);
        return;
      }
  
      // If save is successful, mark the color as saved and disable editing
      const updatedWindows = windows.map(window =>
        window.id === windowId
          ? {
              ...window,
              widgets: window.widgets.map(widget =>
                widget.id === widgetId
                  ? {
                      ...widget,
                      colors: widget.colors.map(color =>
                        color.id === colorId ? { ...color, isChanged: false, isEditing: false, originalValue: color.value } : color
                      )
                    }
                  : widget
              )
            }
          : window
      );
  
      setWindows(updatedWindows);
      console.log('Color saved:', colorToSave.value);
      alert('Color saved successfully!');
    } catch (error) {
      console.error('Error adding color:', error);
      alert('An unexpected error occurred while adding the color.');
    }
  };
  
  
  


  const handleEditColor = (colorId) => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? {
            ...window,
            widgets: window.widgets.map(widget =>
              widget.id === widgetId
                ? {
                    ...widget,
                    colors: widget.colors.map(color =>
                      color.id === colorId ? { ...color, isEditing: true } : color
                    )
                  }
                : widget
            )
          }
        : window
    );

    setWindows(updatedWindows);
  };

  const handleCancelEdit = (colorId) => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? {
            ...window,
            widgets: window.widgets.map(widget =>
              widget.id === widgetId
                ? {
                    ...widget,
                    colors: widget.colors.map(color =>
                      color.id === colorId 
                        ? { 
                            ...color, 
                            value: color.originalValue || '',  // Ensure value fallback
                            isEditing: false 
                          } 
                        : color
                    )
                  }
                : widget
            )
          }
        : window
    );

    setWindows(updatedWindows);
  };

  const colors = windows.find(w => w.id === windowId)?.widgets.find(w => w.id === widgetId)?.colors || [];

  const closeColorModal = () => {
    onClose();
  };

  return (
    <div className="color-modal-overlay">
      <div className="color-modal">
        <div className="color-modal-header">
          <h2>Colors</h2>
          <button className="close-button" onClick={closeColorModal}>X</button>
        </div>
        <div className="color-modal-body">
          {colors.map((color, index) => (
            <div key={color.id} className="color-input-wrapper">
              <input
                type="text"
                className="color-input"
                value={color.value || ''}  // Ensure fallback for controlled component
                onChange={(e) => handleColorChange(color.id, e.target.value)}
                placeholder="Enter color (hex or RGB)"
                disabled={!color.isEditing} // Disable input if not editing
              />
              {color.isEditing ? (
                <>
                  <button
                    className="save-color-button"
                    onClick={() => handleSaveColor(color.id)}
                    disabled={!color.isChanged}
                  >
                    Save
                  </button>
                  <button
                    className="cancel-color-button"
                    onClick={() => handleCancelEdit(color.id)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="edit-color-button"
                  onClick={() => handleEditColor(color.id)}
                >
                  Edit
                </button>
              )}
              {index === colors.length - 1 ? (
                <img
                  src={plusSymbol}
                  alt="Add Color"
                  className="add-color-button"
                  onClick={addColorInput}
                />
              ) : (
                index !== 0 && (
                  <img
                    src={trashcan}
                    alt="Remove Color"
                    className="remove-color-button"
                    onClick={() => removeColorInput(color.id)}
                  />
                )
              )}
            </div>
          ))}
          {colors.length === 0 && (
            <img
              src={plusSymbol}
              alt="Add Color"
              className="add-color-button"
              onClick={addColorInput}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorModal;
