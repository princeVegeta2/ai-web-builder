// src/components/WebBuilder.js

import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import useProjectManager from '../../utils/projectManager'; // Import useProjectManager hook
import { addPageToProject, removeWindow, handlePageNameChange } from '../../utils/pageManager';
import { handleOnDrag, handleOnDrop, removeWidget, handleDragOver, addWidgetModal, removeWidgetModal } from '../../utils/widgetManager';
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
import ImageLinkModal from '../common/ImageLinkModal';
import PromptModal from '../common/PromptModal';
import generatePrompt from '../common/PromptGenerator';

function WebBuilder() {
  // Environment URLs
  const serverProjectURL = process.env.REACT_APP_SERVER_PROJECT;
  const serverPageURL = process.env.REACT_APP_SERVER_PAGE;
  const serverWidgetURL = process.env.REACT_APP_SERVER_WIDGET;
  const serverModalURL = process.env.REACT_APP_SERVER_MODAL;
  const serverModalValuesURL = process.env.REACT_APP_SERVER_MODAL_VALUES;

  // Destructure necessary functions and states from useProjectManager
  const { projectName, setProjectName, currentProjectName, setCurrentProjectName, handleCreateProject, fetchUserProjects, fetchProjectByName } = useProjectManager(serverProjectURL, serverPageURL);


  // Modal management
  const { openModal, closeModal, isModalOpen } = useModalManager();

  // Local component states
  const [windows, setWindows] = useState([]);
  const [editingWindowId, setEditingWindowId] = useState(null);
  const [tempPageName, setTempPageName] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoadDropboxVisible, setIsLoadDropboxVisible] = useState(false);
  const [projectNames, setProjectNames] = useState([]);
  const [selectedProject, setSelectedProject] = useState(''); // New state for selected project name
  const [generatedWebsite] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  //const navigate = useNavigate();

  // Function to handle loading projects when "Load Project" button is clicked
  const handleLoadProjects = async () => {
    setIsLoadDropboxVisible(!isLoadDropboxVisible);
    if (!isLoadDropboxVisible) {
      // Fetch user projects only when the dropdown is about to be displayed
      const projects = await fetchUserProjects();
      setProjectNames(projects); // Set the projects to state
    }
  };

  // Function to handle project selection from the dropdown
  const handleProjectSelection = async (e) => {
    const projectName = e.target.value;
    setSelectedProject(projectName); // Set the selected project
  
    if (projectName) { // Ensure a project is selected
      // Fetch the project data
      const projectData = await fetchProjectByName(serverProjectURL, projectName);
  
      if (projectData) {
        // Set the current project name in the project manager
        setCurrentProjectName(projectName);  // Set the current project name here
        constructProjectFromData(projectData); // Construct the project structure from data
      }
    }
  };
  

  // Function to construct project structure from fetched data
  const constructProjectFromData = (projectData) => {
    const loadedWindows = projectData.pages.map((page) => {
      const widgets = page.widgets.map((widget) => {
        // Initialize the modals for each widget
        const initializedWidget = {
          id: Date.now() + Math.random(), // Create unique IDs
          type: widget.type,
          modals: [], // Initialize empty modals array
          ...widget, // Spread other properties like position, etc.
        };
  
        // If the widget has modals, map them to the correct structure
        if (widget.colorModal) {
          initializedWidget.modals.push('color');
          initializedWidget.colors = widget.colorModal.colors.map(color => ({
            id: Date.now() + Math.random(), // Unique ID for the color
            value: color.color, // Load the color value from the JSON payload
            position: color.position,
            isChanged: false,
            isEditing: false,
            originalValue: color.color
          }));
        }
  
        if (widget.linkModal) {
          initializedWidget.modals.push('link');
          initializedWidget.links = widget.linkModal.links.map(link => ({
            id: Date.now() + Math.random(), // Unique ID for the link
            name: link.name, // Load the link name from the JSON payload
            url: link.url, // Load the link URL from the JSON payload
            position: link.position,
            isChanged: false,
            isEditing: false,
            originalName: link.name,
            originalUrl: link.url
          }));
        }
  
        if (widget.imageLinkModal) {
          initializedWidget.modals.push('image-link');
          initializedWidget.imageLinks = widget.imageLinkModal.imageLinks.map(imageLink => ({
            id: Date.now() + Math.random(), // Unique ID for the image link
            value: imageLink.url, // Load the image link from the JSON payload
            position: imageLink.position,
            isChanged: false,
            isEditing: false,
            originalValue: imageLink.url
          }));
        }
  
        if (widget.promptModal) {
          initializedWidget.modals.push('prompt');
          initializedWidget.promptString = widget.promptModal.prompt; // Load the prompt value from the JSON payload
        }
  
        return initializedWidget;
      });
  
      return {
        id: Date.now() + Math.random(), // Unique ID for each window
        name: page.pageName,
        widgets: widgets, // Initialized widgets with modals and values
        hasPlusButton: true,
      };
    });
  
    setWindows(loadedWindows); // Update state with loaded project structure
    setIsLoadDropboxVisible(false); // Hide dropdown after loading project
  };
  
  

  // Function to add a new window (page)
  const addWindow = async (id) => {
    const newPageName = `Page ${windows.length + 1}`;
    const newWindow = { id: windows.length + 1, name: newPageName, widgets: [] };
    const addPageResult = await addPageToProject(serverPageURL, currentProjectName, newPageName, newWindow.id);

    if (addPageResult) {
      const updatedWindows = windows.map(window =>
        window.id === id ? { ...window, hasPlusButton: false } : window
      );
      setWindows([...updatedWindows, newWindow]);
    } else {
      console.error('Failed to add the new window.');
    }
  };

  // Function to generate the website prompt (debug version)
  const debugGenerateWebsitePrompt = async () => {
    const prompt = generatePrompt(windows);
    console.log('Generated Prompt:', prompt);
  };

  // List of draggable components
  const components = [
    { name: 'Navbar' },
    { name: 'Header' },
    { name: 'Footer' },
    { name: 'Section' },
    { name: 'Card' },
  ];

  // Function to get display names for modals
  const getModalDisplayName = (modalType) => {
    switch (modalType) {
      case 'color':
        return 'Colors';
      case 'link':
        return 'Links';
      case 'image-link':
        return 'Image links';
      case 'prompt':
        return 'Prompt';
      default:
        return modalType;
    }
  };

  // Function to handle adding a modal to a widget
  const handleAddModal = (windowId, widgetId, modalType) => {
    if (modalType) {
      addWidgetModal(windowId, widgetId, modalType, windows, setWindows, currentProjectName, serverModalURL);
      setActiveDropdown(null); // Hide dropdown after selection
    }
  };

  // Function to handle removing a modal from a widget
  const handleRemoveModal = (windowId, widgetId, modalType) => {
    removeWidgetModal(windowId, widgetId, modalType, windows, setWindows, currentProjectName, serverModalURL);
  };

  // Function to toggle the dropdown for adding modals
  const toggleDropdown = (widgetId) => {
    setActiveDropdown(activeDropdown === widgetId ? null : widgetId); // Toggle dropdown visibility
  };

  // Function to get icons based on modal type
  const getModalIcon = (modalType) => {
    switch (modalType) {
      case 'color':
        return colors;
      case 'link':
        return linkIcon;
      case 'image-link':
        return imageIcon;
      case 'prompt':
        return promptIcon;
      default:
        return null;
    }
  };

  return (
    <div className="webbuilder-container">
      {/* Sidebar Section */}
      <div className="sidebar">
        <button className="create-project-button" onClick={() => setIsFormVisible(true)}>
          Create Project
        </button>
        <button className="load-project-button" onClick={handleLoadProjects}>
          Load Project
        </button>
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

      {/* Main WebBuilder Section */}
      <div className="webbuilder">
        {/* No Windows Message */}
        {windows.length === 0 && !isFormVisible && !isLoadDropboxVisible && (
          <div className="no-windows-message">
            <p>No project created yet. Click "Create Project" or "Load Project" to start.</p>
          </div>
        )}

        {/* Create Project Form */}
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

        {/* Load Project Dropdown */}
        {isLoadDropboxVisible && projectNames.length > 0 && (
          <div className="load-project-dropdown">
            <select onChange={handleProjectSelection} value={selectedProject}>
              <option value="">Select a project</option>
              {projectNames.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* No Projects Available Message */}
        {isLoadDropboxVisible && projectNames.length === 0 && (
          <div className="no-projects-message">
            <p>No projects available.</p>
          </div>
        )}

        {/* Render Windows (Pages) */}
        {windows.length > 0 &&
          windows.map((window) => (
            <div key={window.id} className="workspace-window">
              {/* Editing Page Name */}
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
                    onClick={(e) => {
                      e.preventDefault(); // Prevent form submission
                      handlePageNameChange(serverPageURL, window.id, window.name, tempPageName, currentProjectName, windows, setWindows);
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

              {/* Widgets Area */}
              <div className="rectangle-container">
                <div
                  className="rectangle"
                  onDrop={(e) => handleOnDrop(e, window.id, windows, setWindows, currentProjectName, serverWidgetURL)}
                  onDragOver={handleDragOver}
                >
                  {window.widgets.map((widget) => (
                    <div key={widget.id} className="component">
                      {/* Widget Header */}
                      <div className="component-header">
                        {widget.type}
                        <img
                          src={trashcan}
                          alt="Remove Widget"
                          className="widget-trashcan-button"
                          onClick={() => removeWidget(window.id, widget.id, windows, setWindows, currentProjectName, serverWidgetURL)}
                        />
                      </div>

                      {/* Widget Actions */}
                      <div className="component-actions">
                        <img
                          src={plusSymbol}
                          alt="Add Modal"
                          className="add-modal-button"
                          onClick={() => toggleDropdown(widget.id)}
                        />
                        {activeDropdown === widget.id && (
                          <select
                            value=""
                            onChange={(e) => handleAddModal(window.id, widget.id, e.target.value)}
                            className="modal-dropdown"
                          >
                            <option value="">Select Modal</option>
                            <option value="color">Colors</option>
                            <option value="link">Links</option>
                            <option value="image-link">Image links</option>
                            <option value="prompt">Prompt</option>
                          </select>
                        )}
                      </div>

                      {/* Added Modals */}
                      <div className="added-modals">
                        {widget.modals.map((modalType, index) => (
                          <div key={index} className="modal-item">
                            <button
                              className="modal-button"
                              onClick={() => openModal(modalType, window.id, widget.id)}
                            >
                              <img src={getModalIcon(modalType)} alt={`${modalType} icon`} className="modal-icon" />
                              <span className="modal-title">{getModalDisplayName(modalType)}</span>
                            </button>
                            <img
                              src={trashcan}
                              alt="Remove Modal"
                              className="modal-trashcan-button"
                              onClick={() => handleRemoveModal(window.id, widget.id, modalType)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Remove Window Button */}
                {window.id !== 1 && (
                  <img
                    src={trashcan}
                    alt="Remove Window"
                    className="trashcan-button"
                    onClick={() => removeWindow(serverPageURL, window.id, currentProjectName, window.name, windows, setWindows)}
                  />
                )}
              </div>

              {/* Add Window Button */}
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

        {/* Render Modals */}
        {windows.map((window) =>
          window.widgets.map((widget) =>
            widget.modals.map((modalType) => {
              switch (modalType) {
                case 'color':
                  return (
                    <ColorModal
                      key={`${window.id}-${widget.id}-${modalType}`}
                      isOpen={isModalOpen(modalType, window.id, widget.id)}
                      onClose={() => closeModal(modalType, window.id, widget.id)}
                      windows={windows}
                      setWindows={setWindows}
                      currentWidget={{ windowId: window.id, widgetId: widget.id }}
                      serverModalValuesURL={serverModalValuesURL}
                      currentProjectName={currentProjectName}
                    />
                  );
                case 'link':
                  return (
                    <LinkModal
                      key={`${window.id}-${widget.id}-${modalType}`}
                      isOpen={isModalOpen(modalType, window.id, widget.id)}
                      onClose={() => closeModal(modalType, window.id, widget.id)}
                      windows={windows}
                      setWindows={setWindows}
                      currentWidget={{ windowId: window.id, widgetId: widget.id }}
                      serverModalValuesURL={serverModalValuesURL}
                      currentProjectName={currentProjectName}
                    />
                  );
                case 'image-link':
                  return (
                    <ImageLinkModal
                      key={`${window.id}-${widget.id}-${modalType}`}
                      isOpen={isModalOpen(modalType, window.id, widget.id)}
                      onClose={() => closeModal(modalType, window.id, widget.id)}
                      windows={windows}
                      setWindows={setWindows}
                      currentWidget={{ windowId: window.id, widgetId: widget.id }}
                      serverModalValuesURL={serverModalValuesURL}
                      currentProjectName={currentProjectName}
                    />
                  );
                case 'prompt':
                  return (
                    <PromptModal
                      key={`${window.id}-${widget.id}-${modalType}`}
                      isOpen={isModalOpen(modalType, window.id, widget.id)}
                      onClose={() => closeModal(modalType, window.id, widget.id)}
                      windows={windows}
                      setWindows={setWindows}
                      currentWidget={{ windowId: window.id, widgetId: widget.id }}
                      serverModalValuesURL={serverModalValuesURL}
                      currentProjectName={currentProjectName}
                    />
                  );
                default:
                  return null;
              }
            })
          )
        )}

        {/* Generate Website Prompt Button */}
        {windows.length > 0 && (
          <button className="generate-prompt-button" onClick={debugGenerateWebsitePrompt}>
            Generate Website Prompt
          </button>
        )}

        {/* Display Generated Website */}
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
