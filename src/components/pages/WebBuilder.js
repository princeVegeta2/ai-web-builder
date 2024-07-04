// File: components/pages/WebBuilder.js
import React, { useState } from 'react';
import '../../assets/styles/WebBuilder.css';
import plusSymbol from '../../assets/images/plus-symbol.png';
import trashcan from '../../assets/images/trashcan.png';
import colors from '../../assets/images/colors.png';
import linkIcon from '../../assets/images/link.png';
import imageIcon from '../../assets/images/image.png';
import promptIcon from '../../assets/images/prompt.png'; // Import the prompt icon
import ColorModal from '../common/ColorModal';
import LinkModal from '../common/LinkModal';
import ImageModal from '../common/ImageModal';
import PromptModal from '../common/PromptModal'; // Import the PromptModal

function WebBuilder() {
  const [windows, setWindows] = useState([{ id: 1, widgets: [] }]); // Window(rectangle) state
  const [isColorModalOpen, setIsColorModalOpen] = useState(false); // Adds state for ColorModal
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false); // Adds state for LinkModal
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // Adds state for ImageModal
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false); // Adds state for PromptModal
  const [currentWidget, setCurrentWidget] = useState(null); // Current widget state

  // Function to add workspace rectangles
  const addWindow = (id) => {
    const newWindow = { id: windows.length + 1, widgets: [] };
    const updatedWindows = windows.map(window =>
      window.id === id ? { ...window, hasPlusButton: false } : window
    );
    setWindows([...updatedWindows, newWindow]);
  };

  // Function to remove workspace rectangles
  const removeWindow = (id) => {
    const remainingWindows = windows.filter(window => window.id !== id);
    if (remainingWindows.length === 1) {
      remainingWindows[0].hasPlusButton = true;
    }
    setWindows(remainingWindows);
  };

  // Function for drag
  const handleOnDrag = (e, widgetType) => {
    e.dataTransfer.setData("widgetType", widgetType);
  };

  // Function for drop
  const handleOnDrop = (e, windowId) => {
    e.preventDefault();
    const widgetType = e.dataTransfer.getData("widgetType");
    const newWidget = {
      id: Date.now(),
      type: widgetType,
      colors: [{ id: Date.now(), value: '' }],
      links: [{ id: Date.now(), name: '', url: '' }],
      images: [{ id: Date.now(), value: '' }],
      promptString: '' // Add a default prompt string
    };
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? { ...window, widgets: [...window.widgets, newWidget] }
        : window
    );
    setWindows(updatedWindows);
  };

  // Function for dragging over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Function to remove a widget from a workspace
  const removeWidget = (windowId, widgetId) => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? { ...window, widgets: window.widgets.filter(widget => widget.id !== widgetId) }
        : window
    );
    setWindows(updatedWindows);
  };

  // Functions for color modal
  // Adds a textbox for a color input
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

  // Removes a textbox for a color input
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

  // Color change
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

  // Handles opening the color modal 
  const openColorModal = (windowId, widgetId) => {
    setCurrentWidget({ windowId, widgetId });
    setIsColorModalOpen(true);
  };

  // Handles closing the color modal. Saves entered color strings into a colorValues array
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
  // Function to add link input textbox
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

  // Function to remove link modal input textbox
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

  // Function to handle link change
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

  // Function to handle opening of link modal
  const openLinkModal = (windowId, widgetId) => {
    setCurrentWidget({ windowId, widgetId });
    setIsLinkModalOpen(true);
  };

  // Function to close link modal. Saves strings into linkValues
  const closeLinkModal = () => {
    setIsLinkModalOpen(false);
    if (currentWidget) {
      const widget = windows.find(w => w.id === currentWidget.windowId).widgets.find(w => w.id === currentWidget.widgetId);
      const linkValues = widget.links.map(link => ({ name: link.name, url: link.url }));
      console.log('Links:', linkValues);
    }
    setCurrentWidget(null);
  };

  // Functions for image modal
  // Function to add image input textbox
  const addImageInput = (windowId, widgetId) => {
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

  // Function to remove input textbox
  const removeImageInput = (windowId, widgetId, imageId) => {
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

  // Function to handle image change
  const handleImageChange = (windowId, widgetId, imageId, value) => {
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

  // Function to handle opening of an image modal
  const openImageModal = (windowId, widgetId) => {
    setCurrentWidget({ windowId, widgetId });
    setIsImageModalOpen(true);
  };

  // Function to handle closing of the image modal. Saves the string to the imageValues array
  const closeImageModal = () => {
    setIsImageModalOpen(false);
    if (currentWidget) {
      const widget = windows.find(w => w.id === currentWidget.windowId).widgets.find(w => w.id === currentWidget.widgetId);
      const imageValues = widget.images.map(image => image.value);
      console.log('Images:', imageValues);
    }
    setCurrentWidget(null);
  };

  // Functions for prompt modal
  // Function to handle prompt change
  const handlePromptChange = (windowId, widgetId, value) => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? {
          ...window,
          widgets: window.widgets.map(widget =>
            widget.id === widgetId
              ? { ...widget, promptString: value }
              : widget
          )
        }
        : window
    );
    setWindows(updatedWindows);
  };

  // Function to handle opening prompt modal
  const openPromptModal = (windowId, widgetId) => {
    setCurrentWidget({ windowId, widgetId });
    setIsPromptModalOpen(true);
  };

  // Function to handle closing the prompt modal. Saves the value in PromptModal.promptString string
  const closePromptModal = () => {
    setIsPromptModalOpen(false);
    if (currentWidget) {
      const widget = windows.find(w => w.id === currentWidget.windowId).widgets.find(w => w.id === currentWidget.widgetId);
      console.log('Prompt:', widget.promptString);
    }
    setCurrentWidget(null);
  };

  // Website page list of elements(widgets in the sidebar)
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
                      <button className="images-button" onClick={() => openImageModal(window.id, widget.id)}>
                        <img src={imageIcon} alt="Images" className="images-icon" /> Images
                      </button>
                      <button className="prompt-button" onClick={() => openPromptModal(window.id, widget.id)}>
                        <img src={promptIcon} alt="Prompt" className="prompt-icon" /> Prompt
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
            <ImageModal
              isOpen={isImageModalOpen}
              onClose={closeImageModal}
              images={windows.find(w => w.id === currentWidget.windowId).widgets.find(w => w.id === currentWidget.widgetId).images}
              addImageInput={addImageInput}
              handleImageChange={handleImageChange}
              removeImageInput={removeImageInput}
              windowId={currentWidget.windowId}
              widgetId={currentWidget.widgetId}
            />
            <PromptModal
              isOpen={isPromptModalOpen}
              onClose={closePromptModal}
              promptString={windows.find(w => w.id === currentWidget.windowId).widgets.find(w => w.id === currentWidget.widgetId).promptString}
              handlePromptChange={handlePromptChange}
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
