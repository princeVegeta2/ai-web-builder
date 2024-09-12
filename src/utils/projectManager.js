import { useState } from 'react';
import { addPageToProject } from './pageManager';

export const useProjectManager = (serverProjectURL, serverPageURL) => {
  const [projectName, setProjectName] = useState('');
  const [currentProjectName, setCurrentProjectName] = useState('');

  const handleCreateProject = async (e, setWindows, setIsFormVisible) => {
    e.preventDefault();

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

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = typeof errorData === 'object' ? JSON.stringify(errorData) : errorData;
        alert(`Failed to create project: ${errorMessage}`);
        return;
      }

      const projectData = await response.json();
      console.log('Project created successfully:', projectData);

      setCurrentProjectName(projectName);

      const addPageResult = await addPageToProject(serverPageURL, projectName, 'Page 1', 1);

      if (addPageResult) {
        setWindows([{ id: 1, name: 'Page 1', widgets: [] }]);
        setIsFormVisible(false);
        setProjectName('');
      } else {
        console.error('Failed to add the default page.');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('An unexpected error occurred while creating the project.');
    }
  };

  const fetchUserProjects = async () => {
    try {
      const response = await fetch(`${serverProjectURL}/user-projects`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (!response.ok) {
        return [];
      }
  
      const projectNames = await response.json();
      return projectNames;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  };
  
 const fetchProjectByName = async (serverProjectURL, projectName) => {
    try {
      const response = await fetch(`${serverProjectURL}/load-project?projectName=${encodeURIComponent(projectName)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = typeof errorData === 'object' ? JSON.stringify(errorData) : errorData;
        alert(`Failed to load project: ${errorMessage}`);
        return null;
      }
  
      const projectData = await response.json();
      return projectData;
    } catch (error) {
      console.error('Error loading project:', error);
      alert('An unexpected error occurred while loading the project.');
      return null;
    }
  };

const deleteProject = async (serverProjectURL, projectName) => {
    try {
      const response = await fetch(`${serverProjectURL}/delete-project`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: projectName }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = typeof errorData === 'object' ? JSON.stringify(errorData) : errorData;
        alert(`Failed to delete project: ${errorMessage}`);
        return false;
      }
  
      alert('Project deleted successfully.');
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('An unexpected error occurred while deleting the project.');
      return false;
    }
  };
  

  return {
    projectName,
    setProjectName,
    currentProjectName,
    setCurrentProjectName, // Export this function for use in WebBuilder.js
    handleCreateProject,
    fetchUserProjects,
    fetchProjectByName,
    deleteProject
  };
};

export default useProjectManager;
