import React, { useState } from 'react';
import '../../assets/styles/WebBuilder.css';
import plusSymbol from '../../assets/images/plus-symbol.png';
import trashcan from '../../assets/images/trashcan.png';
import colors from '../../assets/images/colors.png';
import ColorModal from '../common/ColorModal';

function WebBuilder() {
  const [windows, setWindows] = useState([{ id: 1, widgets: [] }]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    const newWidget = { id: Date.now(), type: widgetType, colors: [{ id: Date.now(), value: '' }] }; // Add a default color input
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

  const openModal = (windowId, widgetId) => {
    setCurrentWidget({ windowId, widgetId });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (currentWidget) {
      const widget = windows.find(w => w.id === currentWidget.windowId).widgets.find(w => w.id === currentWidget.widgetId);
      const colorValues = widget.colors.map(color => color.value);
      console.log('Colors:', colorValues);
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
                    <button className="colors-button" onClick={() => openModal(window.id, widget.id)}>
                      <img src={colors} alt="Colors" className="colors-icon" /> Colors
                    </button>
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
          <ColorModal
            isOpen={isModalOpen}
            onClose={closeModal}
            colors={windows.find(w => w.id === currentWidget.windowId).widgets.find(w => w.id === currentWidget.widgetId).colors}
            addColorInput={addColorInput}
            handleColorChange={handleColorChange}
            removeColorInput={removeColorInput}
            windowId={currentWidget.windowId}
            widgetId={currentWidget.widgetId}
          />
        )}
      </div>
    </div>
  );
}

export default WebBuilder;
