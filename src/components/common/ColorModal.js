import React from 'react';
import plusSymbol from '../../assets/images/plus-symbol.png';
import '../../assets/styles/ColorModal.css';
import trashcan from '../../assets/images/trashcan.png';

const ColorModal = ({ isOpen, onClose, windows, setWindows, currentWidget }) => {
  if (!isOpen) return null;

  const { windowId, widgetId } = currentWidget;

  const addColorInput = () => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? {
          ...window,
          widgets: window.widgets.map(widget =>
            widget.id === widgetId
              ? { ...widget, colors: [...widget.colors, { id: Date.now(), value: '' }] }
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
              ? { ...widget, colors: widget.colors.filter(color => color.id !== colorId) }
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
                colors: widget.colors.map(color =>
                  color.id === colorId ? { ...color, value } : color
                )
              }
              : widget
          )
        }
        : window
    );
    setWindows(updatedWindows);
  };

  const closeColorModal = () => {
    onClose();
    const widget = windows.find(w => w.id === windowId).widgets.find(w => w.id === widgetId);
    const colorValues = widget.colors.map(color => color.value);
    console.log('Colors:', colorValues);
  };

  const colors = windows.find(w => w.id === windowId).widgets.find(w => w.id === widgetId).colors;

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
                value={color.value}
                onChange={(e) => handleColorChange(color.id, e.target.value)}
                placeholder="Enter color (hex or RGB)"
              />
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
        </div>
      </div>
    </div>
  );
};

export default ColorModal;
