// src/utils/pageManager.js
export const addPageToProject = async (serverPageURL, currentProjectName, pageName, position) => {
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
        const errorData = await response.json();
        const errorMessage = typeof errorData === 'object' ? JSON.stringify(errorData) : errorData;
        alert(`Failed to add page: ${errorMessage}`);
        return null;
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error adding page:', error);
      alert('An unexpected error occurred while adding the page.');
      return null;
    }
  };
  
  export const removeWindow = async (serverPageURL, id, currentProjectName, windowName, windows, setWindows) => {
    try {
      const response = await fetch(`${serverPageURL}/delete-page`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: windowName, projectName: currentProjectName }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = typeof errorData === 'object' ? JSON.stringify(errorData) : errorData;
        alert(`Failed to delete page: ${errorMessage}`);
        return;
      }
  
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
  
  export const handlePageNameChange = async (serverPageURL, windowId, oldName, newName, currentProjectName, windows, setWindows) => {
    try {
      const response = await fetch(`${serverPageURL}/update-page`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: oldName, projectName: currentProjectName, newName: newName }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = typeof errorData === 'object' ? JSON.stringify(errorData) : errorData;
        alert(`Failed to update page: ${errorMessage}`);
        return;
      }
  
      const updatedWindows = windows.map(window =>
        window.id === windowId ? { ...window, name: newName } : window
      );
      setWindows(updatedWindows);
    } catch (error) {
      console.error('Error updating page name:', error);
      alert('An unexpected error occurred while updating the page name.');
    }
  };
  