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
import generatePrompt, { generateAndSendPrompt } from '../common/PromptGenerator';

function WebBuilder() {
  const [windows, setWindows] = useState([{ id: 1, name: 'Page 1', widgets: [] }]);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [currentWidget, setCurrentWidget] = useState(null);
  const [generatedWebsite, setGeneratedWebsite] = useState(null);
  const navigate = useNavigate();

  // Adds a workspace window rectangle
  const addWindow = (id) => {
    const newWindow = { id: windows.length + 1, name: `Page ${windows.length + 1}`, widgets: [] };
    const updatedWindows = windows.map(window =>
      window.id === id ? { ...window, hasPlusButton: false } : window
    );
    setWindows([...updatedWindows, newWindow]);
  };

  // Removes a workspace window rectangle
  const removeWindow = (id) => {
    const remainingWindows = windows.filter(window => window.id !== id);
    if (remainingWindows.length === 1) {
      remainingWindows[0].hasPlusButton = true;
    }
    setWindows(remainingWindows);
  };

  // Widget drag 
  const handleOnDrag = (e, widgetType) => {
    e.dataTransfer.setData("widgetType", widgetType);
  };

  // Widget drop into a workspace window rectangle
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

  // Prevents default actions while dragging over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Removing a widget
  const removeWidget = (windowId, widgetId) => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? { ...window, widgets: window.widgets.filter(widget => widget.id !== widgetId) }
        : window
    );
    setWindows(updatedWindows);
  };

  // Handle Page Name Change
  const handlePageNameChange = (windowId, newName) => {
    const updatedWindows = windows.map(window =>
      window.id === windowId ? { ...window, name: newName } : window
    );
    setWindows(updatedWindows);
  };

  // Opens a Color Modal
  /*
   ColorModal logic and functions used are contained in
   the /src/components/common/ColorModal.js
  */
  const openColorModal = (windowId, widgetId) => {
    setCurrentWidget({ windowId, widgetId });
    setIsColorModalOpen(true);
  };

  // Closes a Color Modal
  const closeColorModal = () => {
    setIsColorModalOpen(false);
    setCurrentWidget(null);
  };

  // Opens a Link Modal
  /*
   LinkModal logic and functions used are contained in
   the /src/components/common/LinkModal.js
  */
  const openLinkModal = (windowId, widgetId) => {
    setCurrentWidget({ windowId, widgetId });
    setIsLinkModalOpen(true);
  };

  // Closes a Link Modal
  const closeLinkModal = () => {
    setIsLinkModalOpen(false);
    setCurrentWidget(null);
  };

  // Opens an Image Modal
  /*
   ImageModal logic and functions used are contained in
   the /src/components/common/ImageModal.js
  */
  const openImageModal = (windowId, widgetId) => {
    setCurrentWidget({ windowId, widgetId });
    setIsImageModalOpen(true);
  };

  // Closes an Image Modal
  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setCurrentWidget(null);
  };

  // Opens a Prompt Modal
  /*
   PromptModal logic and functions used are contained in
   the /src/components/common/PromptModal.js
  */
  const openPromptModal = (windowId, widgetId) => {
    setCurrentWidget({ windowId, widgetId });
    setIsPromptModalOpen(true);
  };

  // Closes a Prompt Modal
  const closePromptModal = () => {
    setIsPromptModalOpen(false);
    setCurrentWidget(null);
  };

  // Generates a prompt
  /*
   Uses generatePrompt and generateAndSendPrompt from /src/components/common/PromptGenerator.js
   then navigates to the Result page from /src/components/pages/Result.js
  */
  const generateWebsitePrompt = async () => {
    try {
      const prompt = generatePrompt(windows);
      const response = await generateAndSendPrompt(windows);
  
      setGeneratedWebsite(response);
      navigate('/result', { state: { generatedWebsite: response } });
    } catch (error) {
      alert('Something went wrong');
    }
  };


  // Generates a prompt but doesnt send it. Only for debugging purposes
  const debugGenerateWebsitePrompt = async() => {
    console.log('Generating prompt...');
    const prompt = generatePrompt(windows);
    console.log('Generated Prompt:', prompt);
  }

  // A list of Widgets in the left pannel of the WebBuilder page.
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
            <input
              type="text"
              className="page-name-input"
              value={window.name}
              onChange={(e) => handlePageNameChange(window.id, e.target.value)}
            />
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
              windows={windows}
              setWindows={setWindows}
              currentWidget={currentWidget}
            />
            <LinkModal
              isOpen={isLinkModalOpen}
              onClose={closeLinkModal}
              windows={windows}
              setWindows={setWindows}
              currentWidget={currentWidget}
            />
            <ImageModal
              isOpen={isImageModalOpen}
              onClose={closeImageModal}
              windows={windows}
              setWindows={setWindows}
              currentWidget={currentWidget}
            />
            <PromptModal
              isOpen={isPromptModalOpen}
              onClose={closePromptModal}
              windows={windows}
              setWindows={setWindows}
              currentWidget={currentWidget}
            />
          </>
        )}
        <button className="generate-prompt-button" onClick={debugGenerateWebsitePrompt}>
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
