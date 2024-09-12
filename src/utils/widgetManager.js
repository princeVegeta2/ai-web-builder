// src/utils/widgetManager.js
export const handleOnDrag = (e, widgetType) => {
  e.dataTransfer.setData("widgetType", widgetType);
};

export const handleOnDrop = async (e, windowId, windows, setWindows, currentProjectName, serverWidgetURL) => {
    e.preventDefault();
    
    const widgetType = e.dataTransfer.getData("widgetType");
  
    // Find the page name using the windowId
    const window = windows.find(window => window.id === windowId);
    if (!window) {
      console.error("Window not found for the given windowId");
      return;
    }
  
    const pageName = window.name;
    
    // Create the payload
    const payload = {
      type: widgetType,
      position: window.widgets.length + 1, // Position is based on the order in the array
      projectName: currentProjectName,
      pageName: pageName,
    };
  
    try {
      const response = await fetch(`${serverWidgetURL}/add-widget/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = typeof errorData === 'object' ? JSON.stringify(errorData) : errorData;
        alert(`Failed to add widget: ${errorMessage}`);
        return;
      }
  
      // Proceed to update the state only if the widget is successfully created
      const newWidget = {
        id: Date.now(),
        type: widgetType,
        modals: [],  // Store the type of modals added by the user
      };
  
      const updatedWindows = windows.map(window =>
        window.id === windowId
          ? { ...window, widgets: [...window.widgets, newWidget] }
          : window
      );
  
      setWindows(updatedWindows);
  
    } catch (error) {
      console.error('Error adding widget:', error);
      alert('An unexpected error occurred while adding the widget.');
    }
  };
  

  export const addWidgetModal = async (windowId, widgetId, modalType, windows, setWindows, currentProjectName, serverModalURL) => {
    // Find the correct window by its id
    const window = windows.find(w => w.id === windowId);
    if (!window) {
      console.error("Window not found for the given windowId");
      return;
    }
  
    // Find the widget by its id
    const widgetIndex = window.widgets.findIndex(widget => widget.id === widgetId);
    if (widgetIndex === -1) {
      console.error("Widget not found for the given widgetId");
      return;
    }
  
    // Now we correctly have the window and widget, so let's work on updating the state
    const updatedWindows = windows.map(w =>
      w.id === windowId
        ? {
            ...w,
            widgets: w.widgets.map(widget =>
              widget.id === widgetId
                ? { ...widget, modals: [...(widget.modals || []), modalType] } // Ensure modals array is initialized
                : widget
            ),
          }
        : w
    );
  
    // Position is now based on the correct window and widget
    const position = updatedWindows.find(w => w.id === windowId).widgets[widgetIndex].modals.length;
    const pageName = window.name;
    const widgetPosition = widgetIndex + 1;
  
    // Create the payload for the POST request
    const payload = {
      position: position,
      widgetPosition: widgetPosition,
      projectName: currentProjectName,
      pageName: pageName,
      type: modalType,
    };
  
    // Debug log
    console.log(`${payload.type} modal added. Position: ${payload.position}, Widget Position: ${payload.widgetPosition}`);
  
    try {
      const response = await fetch(`${serverModalURL}/add-modal/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = typeof errorData === 'object' ? JSON.stringify(errorData) : errorData;
        alert(`Failed to add modal: ${errorMessage}`);
        return;
      }
  
      // Update the state only if the modal is successfully added
      setWindows(updatedWindows);
    } catch (error) {
      console.error('Error adding modal:', error);
      alert('An unexpected error occurred while adding the modal.');
    }
  };
  
  

export const removeWidget = async (windowId, widgetId, windows, setWindows, currentProjectName, serverWidgetURL) => {
    // Find the window and widget to get the necessary data for the API call
    const window = windows.find(w => w.id === windowId);
    if (!window) {
      console.error("Window not found for the given windowId");
      return;
    }
  
    const widgetIndex = window.widgets.findIndex(widget => widget.id === widgetId);
    if (widgetIndex === -1) {
      console.error("Widget not found for the given widgetId");
      return;
    }
  
    const pageName = window.name;
    const position = widgetIndex + 1; // Position is based on the widget's index
  
    // Create the payload for the DELETE request
    const payload = {
      position: position,
      projectName: currentProjectName,
      pageName: pageName,
    };
  
    try {
      const response = await fetch(`${serverWidgetURL}/delete-widget/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = typeof errorData === 'object' ? JSON.stringify(errorData) : errorData;
        alert(`Failed to delete widget: ${errorMessage}`);
        return;
      }
  
      // Proceed to update the state only if the widget is successfully deleted
      const updatedWindows = windows.map(window =>
        window.id === windowId
          ? { ...window, widgets: window.widgets.filter(widget => widget.id !== widgetId) }
          : window
      );
      setWindows(updatedWindows);
  
    } catch (error) {
      console.error('Error deleting widget:', error);
      alert('An unexpected error occurred while deleting the widget.');
    }
  };
  

  export const removeWidgetModal = async (windowId, widgetId, modalType, windows, setWindows, currentProjectName, serverModalURL) => {
    const updatedWindows = windows.map(window => {
        if (window.id === windowId) {
            return {
                ...window,
                widgets: window.widgets.map(widget => {
                    if (widget.id === widgetId) {
                        const modalIndex = widget.modals.findIndex(modal => modal === modalType);
  
                        // Remove the modal from the widget
                        const updatedModals = widget.modals.filter((modal, index) => index !== modalIndex);
                        const updatedWidget = { ...widget, modals: updatedModals };
  
                        // Optionally, remove the associated data structure when the modal is removed
                        switch (modalType) {
                            case 'color':
                                delete updatedWidget.colors;
                                break;
                            case 'link':
                                delete updatedWidget.links;
                                break;
                            case 'image-link':
                                delete updatedWidget.imageLinks;
                                break;
                            case 'prompt':
                                delete updatedWidget.promptString;
                                break;
                            default:
                              console.log("Modal not found");
                              break;
                        }
  
                        return updatedWidget;
                    }
                    return widget;
                }),
            };
        }
        return window;
    });
  
    // Find the window and widget positions
    const window = windows.find(w => w.id === windowId);
    if (!window) {
      console.error("Window not found for the given windowId");
      return;
    }
  
    const widgetIndex = window.widgets.findIndex(widget => widget.id === widgetId);
    if (widgetIndex === -1) {
      console.error("Widget not found for the given widgetId");
      return;
    }
  
    const modalIndex = window.widgets[widgetIndex].modals.findIndex(modal => modal === modalType);
    const pageName = window.name;
    const widgetPosition = widgetIndex + 1;
  
    // Create the payload for the DELETE request
    const payload = {
      position: modalIndex + 1,  // Adding 1 to make it 1-based index
      widgetPosition: widgetPosition,
      projectName: currentProjectName,
      pageName: pageName,
      type: modalType
    };
  
    try {
      const response = await fetch(`${serverModalURL}/delete-modal/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = typeof errorData === 'object' ? JSON.stringify(errorData) : errorData;
        alert(`Failed to delete modal: ${errorMessage}`);
        return;
      }
  
      // If the server-side operation is successful, update the local state
      setWindows(updatedWindows);
  
    } catch (error) {
      console.error('Error deleting modal:', error);
      alert('An unexpected error occurred while deleting the modal.');
    }
  };
  

export const handleDragOver = (e) => {
  e.preventDefault();
};
