import React from 'react';
import plusSymbol from '../../assets/images/plus-symbol.png';
import trashcan from '../../assets/images/trashcan.png';
import '../../assets/styles/LinkModal.css';

const LinkModal = ({ isOpen, onClose, windows, setWindows, currentWidget }) => {
  if (!isOpen) return null;

  const { windowId, widgetId } = currentWidget;

  const addLinkInput = () => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? {
          ...window,
          widgets: window.widgets.map(widget =>
            widget.id === widgetId
              ? { ...widget, links: [...(widget.links || []), { id: Date.now(), name: '', url: '' }] }
              : widget
          )
        }
        : window
    );
    setWindows(updatedWindows);
  };

  const removeLinkInput = (linkId) => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? {
          ...window,
          widgets: window.widgets.map(widget =>
            widget.id === widgetId
              ? { ...widget, links: (widget.links || []).filter(link => link.id !== linkId) }
              : widget
          )
        }
        : window
    );
    setWindows(updatedWindows);
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
                  link.id === linkId ? { ...link, [field]: value } : link
                )
              }
              : widget
          )
        }
        : window
    );
    setWindows(updatedWindows);
  };

  const closeLinkModal = () => {
    onClose();
    const widget = windows.find(w => w.id === windowId)?.widgets.find(w => w.id === widgetId);
    const linkValues = widget?.links?.map(link => ({ name: link.name, url: link.url })) || [];
    console.log('Links:', linkValues);
  };

  const links = windows.find(w => w.id === windowId)?.widgets.find(w => w.id === widgetId)?.links || [];

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
                value={link.name}
                onChange={(e) => handleLinkChange(link.id, 'name', e.target.value)}
                placeholder="Link Name"
              />
              <input
                type="text"
                className="link-url-input"
                value={link.url}
                onChange={(e) => handleLinkChange(link.id, 'url', e.target.value)}
                placeholder="Link URL"
              />
              {index === links.length - 1 ? (
                <img
                  src={plusSymbol}
                  alt="Add Link"
                  className="add-link-button"
                  onClick={addLinkInput}
                />
              ) : (
                index !== 0 && (
                  <img
                    src={trashcan}
                    alt="Remove Link"
                    className="remove-link-button"
                    onClick={() => removeLinkInput(link.id)}
                  />
                )
              )}
            </div>
          ))}
          {links.length === 0 && (
            <img
              src={plusSymbol}
              alt="Add Link"
              className="add-link-button"
              onClick={addLinkInput}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkModal;