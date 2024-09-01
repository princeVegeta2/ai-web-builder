import React from 'react';
import plusSymbol from '../../assets/images/plus-symbol.png';
import trashcan from '../../assets/images/trashcan.png';
import '../../assets/styles/ImageModal.css';

const ImageLinkModal = ({ isOpen, onClose, windows, setWindows, currentWidget, currentProjectName, serverModalValuesURL }) => {
  if (!isOpen) return null;

  const { windowId, widgetId } = currentWidget;

  const addImageInput = () => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? {
            ...window,
            widgets: window.widgets.map(widget =>
              widget.id === widgetId
                ? {
                    ...widget,
                    imageLinks: [...(widget.imageLinks || []), { id: Date.now(), value: '', isChanged: true, isEditing: true, originalValue: '' }]
                  }
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
                ? { 
                    ...widget, 
                    imageLinks: (widget.imageLinks || []).filter(image => image.id !== imageId) 
                  }
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
                    imageLinks: (widget.imageLinks || []).map(image =>
                      image.id === imageId 
                        ? { ...image, value: value || '', isChanged: true } 
                        : image
                    )
                  }
                : widget
            )
          }
        : window
    );
    setWindows(updatedWindows);
  };

  const handleSaveImageLink = async (imageId) => {
    const widget = windows.find(w => w.id === windowId)?.widgets.find(w => w.id === widgetId);
    const imageLinks = widget?.imageLinks || [];
    const imageToSave = imageLinks.find(image => image.id === imageId);
  
    if (!imageToSave || !imageToSave.value?.trim()) {
      alert('Image link cannot be empty.');
      return;
    }
  
    // Check for duplicates across other inputs (case-insensitive)
    const duplicate = imageLinks.find(image => 
      image.id !== imageId && image.value?.trim().toLowerCase() === imageToSave.value.trim().toLowerCase()
    );
  
    if (duplicate) {
      alert('This image link already exists in another input.');
      return;
    }
  
    const widgetIndex = windows.find(w => w.id === windowId)?.widgets.findIndex(widget => widget.id === widgetId) + 1;
    const pageName = windows.find(w => w.id === windowId)?.name;
  
    console.log("Widget:", widget);
    console.log("Widget Index:", widgetIndex);
    console.log("Page Name:", pageName);
    console.log("Project Name:", currentProjectName);
  
    // Ensure all necessary variables are retrieved correctly
    if (!widget || !pageName || widgetIndex < 0 || !currentProjectName) {
      console.error('Error retrieving widget, page information, or project name.');
      return;
    }
  
    // Find the modal position for this specific modal in the context of all modals attached to the widget
    const modalPosition = widget.modals.indexOf('image-link') + 1;
  
    console.log("Modal Position:", modalPosition);
  
    if (modalPosition <= 0) {
      console.error('Error calculating modal position.');
      return;
    }
  
    const payload = {
      position: imageLinks.indexOf(imageToSave) + 1,
      imageUrl: imageToSave.value.trim(),
      projectName: currentProjectName,
      pageName: pageName,
      modalType: 'image-link',
      widgetPosition: widgetIndex,
      modalPosition: modalPosition, // This is the correct position within all modals
    };
  
    console.log(`Payload:`, payload);
  
    try {
      const response = await fetch(`${serverModalValuesURL}/add-image-link/`, {
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
        alert(`Failed to add image link: ${errorMessage}`);
        return;
      }
  
      // If save is successful, mark the image link as saved and disable editing
      const updatedWindows = windows.map(window =>
        window.id === windowId
          ? {
              ...window,
              widgets: window.widgets.map(widget =>
                widget.id === widgetId
                  ? {
                      ...widget,
                      imageLinks: widget.imageLinks.map(image =>
                        image.id === imageId ? { ...image, isChanged: false, isEditing: false, originalValue: image.value } : image
                      )
                    }
                  : widget
              )
            }
          : window
      );
  
      setWindows(updatedWindows);
      console.log('Image link saved:', imageToSave.value);
      alert('Image link saved successfully!');
    } catch (error) {
      console.error('Error adding image link:', error);
      alert('An unexpected error occurred while adding the image link.');
    }
  };
  

  const handleEditImageLink = (imageId) => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? {
            ...window,
            widgets: window.widgets.map(widget =>
              widget.id === widgetId
                ? {
                    ...widget,
                    imageLinks: widget.imageLinks.map(image =>
                      image.id === imageId ? { ...image, isEditing: true } : image
                    )
                  }
                : widget
            )
          }
        : window
    );

    setWindows(updatedWindows);
  };

  const handleCancelEdit = (imageId) => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? {
            ...window,
            widgets: window.widgets.map(widget =>
              widget.id === widgetId
                ? {
                    ...widget,
                    imageLinks: widget.imageLinks.map(image =>
                      image.id === imageId 
                        ? { 
                            ...image, 
                            value: image.originalValue || '',  // Ensure value fallback
                            isEditing: false 
                          } 
                        : image
                    )
                  }
                : widget
            )
          }
        : window
    );

    setWindows(updatedWindows);
  };

  const imageLinks = windows.find(w => w.id === windowId)?.widgets.find(w => w.id === widgetId)?.imageLinks || [];

  const closeImageModal = () => {
    onClose();
  };

  return (
    <div className="image-modal-overlay">
      <div className="image-modal">
        <div className="image-modal-header">
          <h2>Image Links</h2>
          <button className="close-button" onClick={closeImageModal}>X</button>
        </div>
        <div className="image-modal-body">
          {imageLinks.map((image, index) => (
            <div key={image.id} className="image-input-wrapper">
              <input
                type="text"
                className="image-input"
                value={image.value || ''}  // Ensure fallback for controlled component
                onChange={(e) => handleImageChange(image.id, e.target.value)}
                placeholder="Enter image link"
                disabled={!image.isEditing} // Disable input if not editing
              />
              {image.isEditing ? (
                <>
                  <button
                    className="save-image-link-button"
                    onClick={() => handleSaveImageLink(image.id)}
                    disabled={!image.isChanged}
                  >
                    Save
                  </button>
                  <button
                    className="cancel-image-button"
                    onClick={() => handleCancelEdit(image.id)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="edit-image-button"
                  onClick={() => handleEditImageLink(image.id)}
                >
                  Edit
                </button>
              )}
              {index === imageLinks.length - 1 ? (
                <img
                  src={plusSymbol}
                  alt="Add Image"
                  className="add-image-button"
                  onClick={addImageInput}
                />
              ) : (
                index !== 0 && (
                  <img
                    src={trashcan}
                    alt="Remove Image"
                    className="remove-image-button"
                    onClick={() => removeImageInput(image.id)}
                  />
                )
              )}
            </div>
          ))}
          {imageLinks.length === 0 && (
            <img
              src={plusSymbol}
              alt="Add Image"
              className="add-image-button"
              onClick={addImageInput}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageLinkModal;
