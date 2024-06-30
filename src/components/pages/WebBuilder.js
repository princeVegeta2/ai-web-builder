import React, { useState } from 'react';
import '../../assets/styles/WebBuilder.css';
import plusSymbol from '../../assets/images/plus-symbol.png';
import trashcan from '../../assets/images/trashcan.png';
import DraggableComponent from '../common/DraggableComponent';
import DroppableArea from '../common/DroppableArea';

function WebBuilder() {
  const [windows, setWindows] = useState([{ id: 1, components: [] }]);

  const addWindow = (id) => {
    const newWindow = { id: windows.length + 1, components: [] };
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

  const handleDrop = (windowId, component) => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? { ...window, components: [...window.components, component] }
        : window
    );
    setWindows(updatedWindows);
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
            <DraggableComponent key={index} name={component.name} />
          ))}
        </ul>
      </div>
      <div className="webbuilder">
        {windows.map((window) => (
          <div key={window.id} className="workspace-window">
            <DroppableArea onDrop={(component) => handleDrop(window.id, component)}>
              <div className="rectangle">
                {window.components.map((component, index) => (
                  <div key={index} className="component">{component}</div>
                ))}
                {window.id !== 1 && (
                  <img
                    src={trashcan}
                    alt="Remove Window"
                    className="trashcan-button"
                    onClick={() => removeWindow(window.id)}
                  />
                )}
              </div>
            </DroppableArea>
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
      </div>
    </div>
  );
}

export default WebBuilder;
