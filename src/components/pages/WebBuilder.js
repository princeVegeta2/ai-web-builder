import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/WebBuilder.css';
import plusSymbol from '../../assets/images/plus-symbol.png';
import trashcan from '../../assets/images/trashcan.png';
import colors from '../../assets/images/colors.png';
import linkIcon from '../../assets/images/link.png';
import imageIcon from '../../assets/images/image.png';
import promptIcon from '../../assets/images/prompt.png';
import ColorModal from '../common/ColorModal';
import LinkModal from '../common/LinkModal';
import ImageModal from '../common/ImageModal';
import PromptModal from '../common/PromptModal';
import { generateAndSendPrompt } from '../common/PromptGenerator';

function WebBuilder() {
  const [windows, setWindows] = useState([{ id: 1, widgets: [] }]);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [currentWidget, setCurrentWidget] = useState(null);
  const [generatedWebsite, setGeneratedWebsite] = useState(null);
  const navigate = useNavigate();


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
    const newWidget = {
      id: Date.now(),
      type: widgetType,
      colors: [{ id: Date.now(), value: '' }],
      links: [{ id: Date.now(), name: '', url: '' }],
      images: [{ id: Date.now(), value: '' }],
      promptString: ''
    };
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

  const openImageModal = (windowId, widgetId) => {
    setCurrentWidget({ windowId, widgetId });
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    if (currentWidget) {
      const widget = windows.find(w => w.id === currentWidget.windowId).widgets.find(w => w.id === currentWidget.widgetId);
      const imageValues = widget.images.map(image => image.value);
      console.log('Images:', imageValues);
    }
    setCurrentWidget(null);
  };

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

  const openPromptModal = (windowId, widgetId) => {
    setCurrentWidget({ windowId, widgetId });
    setIsPromptModalOpen(true);
  };

  const closePromptModal = () => {
    setIsPromptModalOpen(false);
    if (currentWidget) {
      const widget = windows.find(w => w.id === currentWidget.windowId).widgets.find(w => w.id === currentWidget.widgetId);
      console.log('Prompt:', widget.promptString);
    }
    setCurrentWidget(null);
  };

  const generateWebsitePrompt = async () => {
    try {
      const response = await generateAndSendPrompt(windows);
      setGeneratedWebsite(response);
      navigate('/result', { state: { generatedWebsite: response } });
    } catch (error) {
      console.error("Error generating website:", error);
    }
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
        <button className="generate-prompt-button" onClick={generateWebsitePrompt}>
          Generate Website Prompt
        </button>
        {generatedWebsite && (
        <div className="generated-website">
          <h3>Generated Website:</h3>
          <pre>{generatedWebsite}</pre>
        </div>
      )}
      </div>
    </div>
  );
}

export default WebBuilder;
