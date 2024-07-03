// File: components/pages/WebBuilder.js
import React, { useState } from 'react';
import '../../assets/styles/WebBuilder.css';
import plusSymbol from '../../assets/images/plus-symbol.png';
import trashcan from '../../assets/images/trashcan.png';
import colors from '../../assets/images/colors.png';
import linkIcon from '../../assets/images/link.png';
import ColorModal from '../common/ColorModal';
import LinkModal from '../common/LinkModal';

function WebBuilder() {
  const [windows, setWindows] = useState([{ id: 1, widgets: [] }]);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [currentWidget, setCurrentWidget] = useState(null);

  const addWindow = (id) => {
    const newWindow = { id: windows.length + 1, widgets: [] };
    const updatedWindows = windows.map(window =>
      window.id === id ? { ...window, hasPlusButton: false } : window
    );
    setWindows([...updatedWindows, newWindow]);
  };

  const removeWindow = (id) => {
    const remainingWindows = windows.filter(window => window.id !== id);
    if (remainingWindows.length === 1) {
      remainingWindows[0].hasPlusButton = true;
    }
    setWindows(remainingWindows);
  };

  const handleOnDrag = (e, widgetType) => {
    e.dataTransfer.setData("widgetType", widgetType);
  };

  const handleOnDrop = (e, windowId) => {
    e.preventDefault();
    const widgetType = e.dataTransfer.getData("widgetType");
    const newWidget = { id: Date.now(), type: widgetType, colors: [{ id: Date.now(), value: '' }], links: [{ id: Date.now(), name: '', url: '' }] }; // Add a default link input
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? { ...window, widgets: [...window.widgets, newWidget] }
        : window
    );
    setWindows(updatedWindows);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeWidget = (windowId, widgetId) => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? { ...window, widgets: window.widgets.filter(widget => widget.id !== widgetId) }
        : window
    );
    setWindows(updatedWindows);
  };

  // Functions for color modal
  const addColorInput = (windowId, widgetId) => {
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

  const removeColorInput = (windowId, widgetId, colorId) => {
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

  const handleColorChange = (windowId, widgetId, colorId, value) => {
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

  const openColorModal = (windowId, widgetId) => {
    setCurrentWidget({ windowId, widgetId });
    setIsColorModalOpen(true);
  };

  const closeColorModal = () => {
    setIsColorModalOpen(false);
    if (currentWidget) {
      const widget = windows.find(w => w.id === currentWidget.windowId).widgets.find(w => w.id === currentWidget.widgetId);
      const colorValues = widget.colors.map(color => color.value);
      console.log('Colors:', colorValues);
    }
    setCurrentWidget(null);
  };

  // Functions for link modal
  const addLinkInput = (windowId, widgetId) => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? {
          ...window,
          widgets: window.widgets.map(widget =>
            widget.id === widgetId
              ? { ...widget, links: [...widget.links, { id: Date.now(), name: '', url: '' }] }
              : widget
          )
        }
        : window
    );
    setWindows(updatedWindows);
  };

  const removeLinkInput = (windowId, widgetId, linkId) => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? {
          ...window,
          widgets: window.widgets.map(widget =>
            widget.id === widgetId
              ? { ...widget, links: widget.links.filter(link => link.id !== linkId) }
              : widget
          )
        }
        : window
    );
    setWindows(updatedWindows);
  };

  const handleLinkChange = (windowId, widgetId, linkId, field, value) => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? {
          ...window,
          widgets: window.widgets.map(widget =>
            widget.id === widgetId
              ? {
                ...widget,
                links: widget.links.map(link =>
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

  const openLinkModal = (windowId, widgetId) => {
    setCurrentWidget({ windowId, widgetId });
    setIsLinkModalOpen(true);
  };

  const closeLinkModal = () => {
    setIsLinkModalOpen(false);
    if (currentWidget) {
      const widget = windows.find(w => w.id === currentWidget.windowId).widgets.find(w => w.id === currentWidget.widgetId);
      const linkValues = widget.links.map(link => ({ name: link.name, url: link.url }));
      console.log('Links:', linkValues);
    }
    setCurrentWidget(null);
  };

  const components = [
    { name: 'Navbar' },
    { name: 'Header' },
    { name: 'Footer' },
    { name: 'Section' },
    { name: 'Card' },
  ];

  return (
    <div className="webbuilder-container">
      <div className="sidebar">
        <h2>Components</h2>
        <ul>
          {components.map((component, index) => (
            <li
              key={index}
              draggable
              onDragStart={(e) => handleOnDrag(e, component.name)}
              className="draggable-component"
            >
              {component.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="webbuilder">
        {windows.map((window) => (
          <div key={window.id} className="workspace-window">
            <div className="rectangle-container">
              <div
                className="rectangle"
                onDrop={(e) => handleOnDrop(e, window.id)}
                onDragOver={handleDragOver}
              >
                {window.widgets.map((widget) => (
                  <div key={widget.id} className="component">
                    <div className="component-header">
                      {widget.type}
                      <img
                        src={trashcan}
                        alt="Remove Widget"
                        className="widget-trashcan-button"
                        onClick={() => removeWidget(window.id, widget.id)}
                      />
                    </div>
                    <div className="component-actions">
                      <button className="colors-button" onClick={() => openColorModal(window.id, widget.id)}>
                        <img src={colors} alt="Colors" className="colors-icon" /> Colors
                      </button>
                      <button className="links-button" onClick={() => openLinkModal(window.id, widget.id)}>
                        <img src={linkIcon} alt="Links" className="links-icon" /> Links
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {window.id !== 1 && (
                <img
                  src={trashcan}
                  alt="Remove Window"
                  className="trashcan-button"
                  onClick={() => removeWindow(window.id)}
                />
              )}
            </div>
            {window.hasPlusButton !== false && (
              <img
                src={plusSymbol}
                alt="Add Window"
                className="plus-button"
                onClick={() => addWindow(window.id)}
              />
            )}
          </div>
        ))}
        {currentWidget && (
          <>
            <ColorModal
              isOpen={isColorModalOpen}
              onClose={closeColorModal}
              colors={windows.find(w => w.id === currentWidget.windowId).widgets.find(w => w.id === currentWidget.widgetId).colors}
              addColorInput={addColorInput}
              handleColorChange={handleColorChange}
              removeColorInput={removeColorInput}
              windowId={currentWidget.windowId}
              widgetId={currentWidget.widgetId}
            />
            <LinkModal
              isOpen={isLinkModalOpen}
              onClose={closeLinkModal}
              links={windows.find(w => w.id === currentWidget.windowId).widgets.find(w => w.id === currentWidget.widgetId).links}
              addLinkInput={addLinkInput}
              handleLinkChange={handleLinkChange}
              removeLinkInput={removeLinkInput}
              windowId={currentWidget.windowId}
              widgetId={currentWidget.widgetId}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default WebBuilder;
