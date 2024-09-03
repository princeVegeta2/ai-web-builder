import { useState } from 'react';
import { addPageToProject } from './pageManager';

const useProjectManager = (serverProjectURL, serverPageURL) => {
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
        const errorData = await response.json();
        const errorMessage = typeof errorData === 'object' ? JSON.stringify(errorData) : errorData;
        alert(`Failed to load projects: ${errorMessage}`);
        return [];
      }

      const projectNames = await response.json();
      return projectNames;
    } catch (error) {
      console.error('Error fetching projects:', error);
      alert('An unexpected error occurred while loading projects.');
      return [];
    }
  };

  return {
    projectName,
    setProjectName,
    currentProjectName,
    handleCreateProject,
    fetchUserProjects,
  };
};

export default useProjectManager;
