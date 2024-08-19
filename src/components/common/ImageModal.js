// File: components/common/ImageModal.js
import React from 'react';
import plusSymbol from '../../assets/images/plus-symbol.png';
import trashcan from '../../assets/images/trashcan.png';
import '../../assets/styles/ImageModal.css';

const ImageModal = ({ isOpen, onClose, windows, setWindows, currentWidget }) => {
  if (!isOpen) return null;

  const { windowId, widgetId } = currentWidget;

  const addImageInput = () => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? {
          ...window,
          widgets: window.widgets.map(widget =>
            widget.id === widgetId
              ? { ...widget, images: [...widget.images, { id: Date.now(), value: '' }] }
              : widget
          )
        }
        : window
    );
    setWindows(updatedWindows);
  };

  const removeImageInput = (imageId) => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? {
          ...window,
          widgets: window.widgets.map(widget =>
            widget.id === widgetId
              ? { ...widget, images: widget.images.filter(image => image.id !== imageId) }
              : widget
          )
        }
        : window
    );
    setWindows(updatedWindows);
  };

  const handleImageChange = (imageId, value) => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? {
          ...window,
          widgets: window.widgets.map(widget =>
            widget.id === widgetId
              ? {
                ...widget,
                images: widget.images.map(image =>
                  image.id === imageId ? { ...image, value } : image
                )
              }
              : widget
          )
        }
        : window
    );
    setWindows(updatedWindows);
  };

  const closeImageModal = () => {
    onClose();
    const widget = windows.find(w => w.id === windowId).widgets.find(w => w.id === widgetId);
    const imageValues = widget.images.map(image => image.value);
    console.log('Images:', imageValues);
  };

  const images = windows.find(w => w.id === windowId).widgets.find(w => w.id === widgetId).images;

  return (
    <div className="image-modal-overlay">
      <div className="image-modal">
        <div className="image-modal-header">
          <h2>Images</h2>
          <button className="close-button" onClick={closeImageModal}>X</button>
        </div>
        <div className="image-modal-body">
          {images.map((image, index) => (
            <div key={image.id} className="image-input-wrapper">
              <input
                type="text"
                className="image-input"
                value={image.value}
                onChange={(e) => handleImageChange(image.id, e.target.value)}
                placeholder="Image link"
              />
              {index === images.length - 1 ? (
                <img
                  src={plusSymbol}
                  alt="Add"
                  className="add-image-button"
                  onClick={addImageInput}
                />
              ) : (
                index !== 0 && (
                  <img
                    src={trashcan}
                    alt="Remove"
                    className="remove-image-button"
                    onClick={() => removeImageInput(image.id)}
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
