import React from 'react';
import plusSymbol from '../../assets/images/plus-symbol.png';
import '../../assets/styles/ColorModal.css';
import trashcan from '../../assets/images/trashcan.png';

const ColorModal = ({ isOpen, onClose, colors, addColorInput, handleColorChange, removeColorInput, windowId, widgetId }) => {
  if (!isOpen) return null;

  return (
    <div className="color-modal-overlay">
      <div className="color-modal">
        <div className="color-modal-header">
          <h2>Colors</h2>
          <button className="close-button" onClick={onClose}>X</button>
        </div>
        <div className="color-modal-body">
          {colors.map((color, index) => (
            <div key={color.id} className="color-input-wrapper">
              <input
                type="text"
                className="color-input"
                value={color.value}
                onChange={(e) => handleColorChange(windowId, widgetId, color.id, e.target.value)}
                placeholder="Enter color (hex or RGB)"
              />
              {index === colors.length - 1 ? (
                <img
                  src={plusSymbol}
                  alt="Add Color"
                  className="add-color-button"
                  onClick={() => addColorInput(windowId, widgetId)}
                />
              ) : (
                index !== 0 && (
                  <img
                    src={trashcan}
                    alt="Remove Color"
                    className="remove-color-button"
                    onClick={() => removeColorInput(windowId, widgetId, color.id)}
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
