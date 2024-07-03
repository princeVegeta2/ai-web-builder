// File: components/common/LinkModal.js
import React from 'react';
import plusSymbol from '../../assets/images/plus-symbol.png';
import trashcan from '../../assets/images/trashcan.png';
import '../../assets/styles/LinkModal.css';

const LinkModal = ({ isOpen, onClose, links, addLinkInput, handleLinkChange, removeLinkInput, windowId, widgetId }) => {
  if (!isOpen) return null;

  return (
    <div className="link-modal-overlay">
      <div className="link-modal">
        <div className="link-modal-header">
          <h2>Links</h2>
          <button className="close-button" onClick={onClose}>X</button>
        </div>
        <div className="link-modal-body">
          {links.map((link, index) => (
            <div key={link.id} className="link-input-wrapper">
              <input
                type="text"
                className="link-name-input"
                value={link.name}
                onChange={(e) => handleLinkChange(windowId, widgetId, link.id, 'name', e.target.value)}
                placeholder="Link Name"
              />
              <input
                type="text"
                className="link-url-input"
                value={link.url}
                onChange={(e) => handleLinkChange(windowId, widgetId, link.id, 'url', e.target.value)}
                placeholder="Link URL"
              />
              {index === links.length - 1 ? (
                <img
                  src={plusSymbol}
                  alt="Add Link"
                  className="add-link-button"
                  onClick={() => addLinkInput(windowId, widgetId)}
                />
              ) : (
                index !== 0 && (
                  <img
                    src={trashcan}
                    alt="Remove Link"
                    className="remove-link-button"
                    onClick={() => removeLinkInput(windowId, widgetId, link.id)}
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

export default LinkModal;
