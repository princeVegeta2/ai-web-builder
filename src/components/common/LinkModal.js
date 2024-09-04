import React from 'react';
import plusSymbol from '../../assets/images/plus-symbol.png';
import trashcan from '../../assets/images/trashcan.png';
import '../../assets/styles/LinkModal.css';

const LinkModal = ({ isOpen, onClose, windows, setWindows, currentWidget, currentProjectName, serverModalValuesURL }) => {
  if (!isOpen) return null;

  const { windowId, widgetId } = currentWidget;

  const addLinkInput = () => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? {
            ...window,
            widgets: window.widgets.map(widget =>
              widget.id === widgetId
                ? { 
                    ...widget, 
                    links: [...(widget.links || []), { 
                      id: Date.now(), 
                      name: '', 
                      url: '', 
                      isChanged: true, 
                      isEditing: true, 
                      originalName: '', 
                      originalUrl: '' 
                    }] 
                  }
                : widget
            )
          }
        : window
    );
    setWindows(updatedWindows);
  };

  const removeLinkInput = async (linkId) => {
    const widget = windows.find(w => w.id === windowId)?.widgets.find(w => w.id === widgetId);
    const links = widget?.links || [];
    const linkToRemove = links.find(link => link.id === linkId);
  
    if (!linkToRemove) {
      console.error('Link to remove not found.');
      return;
    }
  
    const widgetIndex = windows.find(w => w.id === windowId)?.widgets.findIndex(widget => widget.id === widgetId) + 1;
    const pageName = windows.find(w => w.id === windowId)?.name;
  
    // Find the modal position for link modals
    const modalPosition = widget.modals.indexOf('link') + 1;
  
    if (!widget || !pageName || widgetIndex < 0 || !currentProjectName || modalPosition < 0) {
      console.error('Error retrieving widget, page information, modal position, or project name.');
      return;
    }
  
    const payload = {
      position: links.indexOf(linkToRemove) + 1,
      projectName: currentProjectName,
      pageName: pageName,
      modalType: 'link',
      widgetPosition: widgetIndex,
      modalPosition: modalPosition,
    };
  
    console.log(`Deleting link at Position: ${payload.position}, Widget position: ${payload.widgetPosition}, Modal position: ${payload.modalPosition}, ProjectName: ${payload.projectName}, PageName: ${payload.pageName}`);
  
    try {
      const response = await fetch(`${serverModalValuesURL}/delete-link/`, {
        method: 'DELETE',
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
        alert(`Failed to delete link: ${errorMessage}`);
        return;
      }
  
      // Update the state to remove the link input from the frontend
      const updatedWindows = windows.map(window =>
        window.id === windowId
          ? {
              ...window,
              widgets: window.widgets.map(widget =>
                widget.id === widgetId
                  ? { 
                      ...widget, 
                      links: (widget.links || []).filter(link => link.id !== linkId) 
                    }
                  : widget
              )
            }
          : window
      );
  
      setWindows(updatedWindows);
      console.log('Link removed successfully.');
    } catch (error) {
      console.error('Error deleting link:', error);
      alert('An unexpected error occurred while deleting the link.');
    }
  };
  

  const handleLinkChange = (linkId, field, value) => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? {
            ...window,
            widgets: window.widgets.map(widget =>
              widget.id === widgetId
                ? {
                    ...widget,
                    links: (widget.links || []).map(link =>
                      link.id === linkId 
                        ? { ...link, [field]: value, isChanged: true } 
                        : link
                    )
                  }
                : widget
            )
          }
        : window
    );
    setWindows(updatedWindows);
  };

  const handleSaveLink = async (linkId) => {
    const widget = windows.find(w => w.id === windowId)?.widgets.find(w => w.id === widgetId);
    const links = widget?.links || [];
    const linkToSave = links.find(link => link.id === linkId);
  
    if (!linkToSave || !linkToSave.name?.trim() || !linkToSave.url?.trim()) {
      alert('Link name and URL cannot be empty.');
      return;
    }
  
    // Check for duplicates (case-insensitive)
    const duplicate = links.find(link =>
      link.id !== linkId && 
      (link.name?.trim().toLowerCase() === linkToSave.name.trim().toLowerCase() ||
      link.url?.trim().toLowerCase() === linkToSave.url.trim().toLowerCase())
    );
  
    if (duplicate) {
      alert('This link name or URL already exists in another input.');
      return;
    }
  
    const widgetIndex = windows.find(w => w.id === windowId)?.widgets.findIndex(widget => widget.id === widgetId) + 1;
    const pageName = windows.find(w => w.id === windowId)?.name;
  
    // Find the modal position for this specific modal in the context of all modals attached to the widget
    const modalPosition = widget.modals.indexOf('link') + 1;
  
    if (!widget || !pageName || widgetIndex < 0 || !currentProjectName || modalPosition < 0) {
      console.error('Error retrieving widget, page information, modal position, or project name.');
      return;
    }
  
    const payload = {
      position: links.indexOf(linkToSave) + 1,
      name: linkToSave.name.trim(),
      url: linkToSave.url.trim(),
      projectName: currentProjectName,
      pageName: pageName,
      modalType: 'link',
      widgetPosition: widgetIndex,
      modalPosition: modalPosition, // This is the correct position within all modals
    };
  
    console.log(`Input Position: ${payload.position}, Widget position: ${payload.widgetPosition}, Modal position: ${payload.modalPosition}, ProjectName: ${payload.projectName}, PageName: ${payload.pageName}`);
  
    try {
      const response = await fetch(`${serverModalValuesURL}/add-link/`, {
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
        alert(`Failed to add link: ${errorMessage}`);
        return;
      }
  
      // If save is successful, mark the link as saved and disable editing
      const updatedWindows = windows.map(window =>
        window.id === windowId
          ? {
              ...window,
              widgets: window.widgets.map(widget =>
                widget.id === widgetId
                  ? {
                      ...widget,
                      links: widget.links.map(link =>
                        link.id === linkId 
                          ? { ...link, isChanged: false, isEditing: false, originalName: link.name, originalUrl: link.url } 
                          : link
                      )
                    }
                  : widget
              )
            }
          : window
      );
  
      setWindows(updatedWindows);
      console.log('Link saved:', linkToSave.name, linkToSave.url);
    } catch (error) {
      console.error('Error adding link:', error);
      alert('An unexpected error occurred while adding the link.');
    }
  };

  const handleEditLink = (linkId) => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? {
            ...window,
            widgets: window.widgets.map(widget =>
              widget.id === widgetId
                ? {
                    ...widget,
                    links: widget.links.map(link =>
                      link.id === linkId ? { ...link, isEditing: true } : link
                    )
                  }
                : widget
            )
          }
        : window
    );

    setWindows(updatedWindows);
  };

  const handleCancelEdit = (linkId) => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? {
            ...window,
            widgets: window.widgets.map(widget =>
              widget.id === widgetId
                ? {
                    ...widget,
                    links: widget.links.map(link =>
                      link.id === linkId 
                        ? { 
                            ...link, 
                            name: link.originalName || '', 
                            url: link.originalUrl || '', 
                            isEditing: false 
                          } 
                        : link
                    )
                  }
                : widget
            )
          }
        : window
    );

    setWindows(updatedWindows);
  };

  const links = windows.find(w => w.id === windowId)?.widgets.find(w => w.id === widgetId)?.links || [];

  const closeLinkModal = () => {
    onClose();
  };

  return (
    <div className="link-modal-overlay">
      <div className="link-modal">
        <div className="link-modal-header">
          <h2>Links</h2>
          <button className="close-button" onClick={closeLinkModal}>X</button>
        </div>
        <div className="link-modal-body">
          {links.map((link, index) => (
            <div key={link.id} className="link-input-wrapper">
              <input
                type="text"
                className="link-name-input"
                value={link.name || ''}  // Ensure fallback for controlled component
                onChange={(e) => handleLinkChange(link.id, 'name', e.target.value)}
                placeholder="Link Name"
                disabled={!link.isEditing} // Disable input if not editing
              />
              <input
                type="text"
                className="link-url-input"
                value={link.url || ''}  // Ensure fallback for controlled component
                onChange={(e) => handleLinkChange(link.id, 'url', e.target.value)}
                placeholder="Link URL"
                disabled={!link.isEditing} // Disable input if not editing
              />
              {link.isEditing ? (
                <>
                  <button
                    className="save-link-button"
                    onClick={() => handleSaveLink(link.id)}
                    disabled={!link.isChanged}
                  >
                    Save
                  </button>
                  <button
                    className="cancel-link-button"
                    onClick={() => handleCancelEdit(link.id)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="edit-link-button"
                  onClick={() => handleEditLink(link.id)}
                >
                  Edit
                </button>
              )}
              <img
                src={trashcan}
                alt="Remove Link"
                className="remove-link-button"
                onClick={() => removeLinkInput(link.id)}
              />
              {index === links.length - 1 && (
                <img
                  src={plusSymbol}
                  alt="Add Link"
                  className="add-link-button"
                  onClick={addLinkInput}
                />
              )}
            </div>
          ))}
          {links.length === 0 && (
            <div className="empty-state">
              <img
                src={plusSymbol}
                alt="Add Link"
                className="add-link-button"
                onClick={addLinkInput}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkModal;
