// File: components/common/ImageModal.js
import React from 'react';
import plusSymbol from '../../assets/images/plus-symbol.png';
import trashcan from '../../assets/images/trashcan.png';
import '../../assets/styles/ImageModal.css';

const ImageModal = ({ isOpen, onClose, images, addImageInput, handleImageChange, removeImageInput, windowId, widgetId }) => {
  if (!isOpen) return null;

  return (
    <div className="image-modal-overlay">
      <div className="image-modal">
        <div className="image-modal-header">
          <h2>Images</h2>
          <button className="close-button" onClick={onClose}>X</button>
        </div>
        <div className="image-modal-body">
          {images.map((image, index) => (
            <div key={image.id} className="image-input-wrapper">
              <input
                type="text"
                className="image-input"
                value={image.value}
                onChange={(e) => handleImageChange(windowId, widgetId, image.id, e.target.value)}
                placeholder="Image link"
              />
              {index === images.length - 1 ? (
                <img
                  src={plusSymbol}
                  alt="Add"
                  className="add-image-button"
                  onClick={() => addImageInput(windowId, widgetId)}
                />
              ) : (
                index !== 0 && (
                  <img
                    src={trashcan}
                    alt="Remove"
                    className="remove-image-button"
                    onClick={() => removeImageInput(windowId, widgetId, image.id)}
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

export default ImageModal;
