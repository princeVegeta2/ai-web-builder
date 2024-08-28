// src/components/pages/WebBuilder.js
import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useProjectManager from '../../utils/projectManager';
import { addPageToProject, removeWindow, handlePageNameChange } from '../../utils/pageManager';
import { handleOnDrag, handleOnDrop, removeWidget, handleDragOver } from '../../utils/widgetManager';
import useModalManager from '../../utils/modalManager';
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
  const serverProjectURL = process.env.REACT_APP_SERVER_PROJECT;
  const serverPageURL = process.env.REACT_APP_SERVER_PAGE;

  const { projectName, setProjectName, currentProjectName, handleCreateProject } = useProjectManager(serverProjectURL, serverPageURL);
  const { isColorModalOpen, isLinkModalOpen, isImageModalOpen, isPromptModalOpen, currentWidget, openModal, closeModal } = useModalManager();
  const [windows, setWindows] = useState([]);
  const [editingWindowId, setEditingWindowId] = useState(null);
  const [tempPageName, setTempPageName] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [generatedWebsite, setGeneratedWebsite] = useState(null);
  const navigate = useNavigate();

  const addWindow = async (id) => {
    const newPageName = `Page ${windows.length + 1}`;
    const newWindow = { id: windows.length + 1, name: newPageName, widgets: [] };
    const addPageResult = await addPageToProject(process.env.REACT_APP_SERVER_PAGE, currentProjectName, newPageName, newWindow.id);

    if (addPageResult) {
      const updatedWindows = windows.map(window =>
        window.id === id ? { ...window, hasPlusButton: false } : window
      );
      setWindows([...updatedWindows, newWindow]);
    } else {
      console.error('Failed to add the new window.');
    }
  };

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

  const debugGenerateWebsitePrompt = async () => {
    const prompt = generatePrompt(windows);
    console.log('Generated Prompt:', prompt);
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
          <li className="draggable-component create-project-button" onClick={() => setIsFormVisible(true)}>
            Create Project
          </li>
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
        {windows.length === 0 && !isFormVisible && (
          <div className="no-windows-message">
            <p>No project created yet. Click "Create Project" to start.</p>
          </div>
        )}
        {isFormVisible && (
          <form onSubmit={(e) => handleCreateProject(e, setWindows, setIsFormVisible)} className="create-project-form">
            <label>
              Project Name:
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </label>
            <button type="submit">Submit</button>
          </form>
        )}
        {windows.length > 0 &&
          windows.map((window) => (
            <div key={window.id} className="workspace-window">
              {editingWindowId === window.id ? (
                <div className="editing-page-name">
                  <input
                    type="text"
                    className="page-name-input"
                    value={tempPageName}
                    onChange={(e) => setTempPageName(e.target.value)}
                  />
                  <button
                    className="button submit-button"
                    onClick={() => {
                      handlePageNameChange(process.env.REACT_APP_SERVER_PAGE, window.id, window.name, tempPageName, currentProjectName, windows, setWindows);
                      setEditingWindowId(null);
                    }}
                  >
                    Submit
                  </button>
                  <button
                    className="button cancel-button"
                    onClick={() => {
                      setEditingWindowId(null);
                      setTempPageName(window.name);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="page-name-display">
                  <span>{window.name}</span>
                  <button
                    className="edit-button"
                    onClick={() => {
                      setEditingWindowId(window.id);
                      setTempPageName(window.name);
                    }}
                  >
                    Edit
                  </button>
                </div>
              )}

              <div className="rectangle-container">
                <div
                  className="rectangle"
                  onDrop={(e) => handleOnDrop(e, window.id, windows, setWindows)}
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
                          onClick={() => removeWidget(window.id, widget.id, windows, setWindows)}
                        />
                      </div>
                      <div className="component-actions">
                        <button
                          className="colors-button"
                          onClick={() => openModal('color', window.id, widget.id)}
                        >
                          <img src={colors} alt="Colors" className="colors-icon" /> Colors
                        </button>
                        <button
                          className="links-button"
                          onClick={() => openModal('link', window.id, widget.id)}
                        >
                          <img src={linkIcon} alt="Links" className="links-icon" /> Links
                        </button>
                        <button
                          className="images-button"
                          onClick={() => openModal('image', window.id, widget.id)}
                        >
                          <img src={imageIcon} alt="Images" className="images-icon" /> Images
                        </button>
                        <button
                          className="prompt-button"
                          onClick={() => openModal('prompt', window.id, widget.id)}
                        >
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
                    onClick={() => removeWindow(process.env.REACT_APP_SERVER_PAGE, window.id, currentProjectName, window.name, windows, setWindows)}
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
              onClose={() => closeModal('color')}
              windows={windows}
              setWindows={setWindows}
              currentWidget={currentWidget}
            />
            <LinkModal
              isOpen={isLinkModalOpen}
              onClose={() => closeModal('link')}
              windows={windows}
              setWindows={setWindows}
              currentWidget={currentWidget}
            />
            <ImageModal
              isOpen={isImageModalOpen}
              onClose={() => closeModal('image')}
              windows={windows}
              setWindows={setWindows}
              currentWidget={currentWidget}
            />
            <PromptModal
              isOpen={isPromptModalOpen}
              onClose={() => closeModal('prompt')}
              windows={windows}
              setWindows={setWindows}
              currentWidget={currentWidget}
            />
          </>
        )}
        {windows.length > 0 && (
          <button className="generate-prompt-button" onClick={debugGenerateWebsitePrompt}>
            Generate Website Prompt
          </button>
        )}
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
