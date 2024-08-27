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
  const [projectName, setProjectName] = useState('');
  const [currentProjectName, setCurrentProjectName] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [windows, setWindows] = useState([]);
  const [editingWindowId, setEditingWindowId] = useState(null);
  const [tempPageName, setTempPageName] = useState('');
  const [newPageName, setNewPageName] = useState('');
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [currentWidget, setCurrentWidget] = useState(null);
  const [generatedWebsite, setGeneratedWebsite] = useState(null);
  const navigate = useNavigate();

  const serverProjectURL = process.env.REACT_APP_SERVER_PROJECT;
  const serverPageURL = process.env.REACT_APP_SERVER_PAGE;

  // Function to handle project creation
  const handleCreateProject = async (e) => {
    e.preventDefault();

    // Check if projectName is empty before making the request
    if (!projectName.trim()) {
      alert("Project name cannot be empty");
      return;
    }

    try {
      const response = await fetch(`${serverProjectURL}/create-project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: projectName }),
      });

      // Updated error handling inside handleCreateProject
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          errorData = await response.text();
        }
        const errorMessage = typeof errorData === 'object' ? JSON.stringify(errorData) : errorData;
        alert(`Failed to create project: ${errorMessage}`);
        return;
      }


      const projectData = await response.json();
      console.log('Project created successfully:', projectData);

      // Set the current project name for ongoing operations
      setCurrentProjectName(projectName);

      // Add the default page to the project, passing projectName directly
      const addPageResult = await addPageToProject(projectName, 'Page 1', 1);

      if (addPageResult) {
        // Clear the form inputs only if the page was added successfully
        setWindows([{ id: 1, name: 'Page 1', widgets: [] }]);
        setIsFormVisible(false);
        setProjectName('');  // Still clear the input field
      } else {
        console.error('Failed to add the default page.');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('An unexpected error occurred while creating the project.');
    }
  };

  // Make /add-page/ POST call to the backend to add a page
  const addPageToProject = async (currentProjectName, pageName, position) => {
    try {
      const response = await fetch(`${serverPageURL}/add-page`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ projectName: currentProjectName, name: pageName, position }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          errorData = await response.text();
        }
        const errorMessage = typeof errorData === 'object' ? JSON.stringify(errorData) : errorData;
        alert(`Failed to create project: ${errorMessage}`);
        return;
      }

      return await response.json(); // Assuming the API returns some relevant data
    } catch (error) {
      console.error('Error adding page:', error);
      alert('An unexpected error occurred while adding the page.');
      return null;
    }
  };

  // Adds a workspace window rectangle
  const addWindow = async (id) => {
    const newPageName = `Page ${windows.length + 1}`;
    const newWindow = { id: windows.length + 1, name: newPageName, widgets: [] };

    try {
      // Use the existing addPageToProject function to handle the API call
      const addPageResult = await addPageToProject(currentProjectName, newPageName, newWindow.id);

      if (addPageResult) {
        // If the page was successfully added, update the UI
        const updatedWindows = windows.map(window =>
          window.id === id ? { ...window, hasPlusButton: false } : window
        );
        setWindows([...updatedWindows, newWindow]);
      } else {
        console.error('Failed to add the new window.');
      }
    } catch (error) {
      console.error('Error adding page:', error);
      alert('An unexpected error occurred while adding the page.');
    }
  };

  // Removes a workspace window rectangle and deletes the page from the database
  const removeWindow = async (id, currentProjectName, windowName) => {
    try {
      // Make the API call to delete the page
      const response = await fetch(`${serverPageURL}/delete-page`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: windowName, projectName: currentProjectName }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          errorData = await response.text();
        }
        const errorMessage = typeof errorData === 'object' ? JSON.stringify(errorData) : errorData;
        alert(`Failed to delete page: ${errorMessage}`);
        return;
      }

      // Remove the window from the UI only if the page was successfully deleted from the database
      const remainingWindows = windows.filter(window => window.id !== id);
      if (remainingWindows.length === 1) {
        remainingWindows[0].hasPlusButton = true;
      }
      setWindows(remainingWindows);

    } catch (error) {
      console.error('Error deleting page:', error);
      alert('An unexpected error occurred while deleting the page.');
    }
  };

  const handlePageNameChange = async (windowId, oldName, newName) => {
    try {
      // Make an API call to update the page name
      const response = await fetch(`${serverPageURL}/update-page`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: oldName, projectName: currentProjectName, newName: newName }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          errorData = await response.text();
        }
        const errorMessage = typeof errorData === 'object' ? JSON.stringify(errorData) : errorData;
        alert(`Failed to update page: ${errorMessage}`);
        return;
      }

      // If the API call was successful, update the window name in the state
      const updatedWindows = windows.map(window =>
        window.id === windowId ? { ...window, name: newName } : window
      );
      setWindows(updatedWindows);
      alert('Page name updated successfully.');
    } catch (error) {
      console.error('Error updating page name:', error);
      alert('An unexpected error occurred while updating the page name.');
    }
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
  const debugGenerateWebsitePrompt = async () => {
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
          <li
            className="draggable-component create-project-button"
            onClick={() => setIsFormVisible(true)}
          >
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
          <form onSubmit={handleCreateProject} className="create-project-form">
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
                      handlePageNameChange(window.id, window.name, tempPageName);
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
                        <button
                          className="colors-button"
                          onClick={() => openColorModal(window.id, widget.id)}
                        >
                          <img src={colors} alt="Colors" className="colors-icon" /> Colors
                        </button>
                        <button
                          className="links-button"
                          onClick={() => openLinkModal(window.id, widget.id)}
                        >
                          <img src={linkIcon} alt="Links" className="links-icon" /> Links
                        </button>
                        <button
                          className="images-button"
                          onClick={() => openImageModal(window.id, widget.id)}
                        >
                          <img src={imageIcon} alt="Images" className="images-icon" /> Images
                        </button>
                        <button
                          className="prompt-button"
                          onClick={() => openPromptModal(window.id, widget.id)}
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
                    onClick={() => removeWindow(window.id, currentProjectName, window.name)}
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
