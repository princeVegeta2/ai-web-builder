// src/utils/modalManager.js
import { useState } from 'react';

const useModalManager = () => {
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [currentWidget, setCurrentWidget] = useState(null);

  const openModal = (type, windowId, widgetId) => {
    setCurrentWidget({ windowId, widgetId });
    switch (type) {
      case 'color':
        setIsColorModalOpen(true);
        break;
      case 'link':
        setIsLinkModalOpen(true);
        break;
      case 'image':
        setIsImageModalOpen(true);
        break;
      case 'prompt':
        setIsPromptModalOpen(true);
        break;
      default:
        break;
    }
  };

  const closeModal = (type) => {
    switch (type) {
      case 'color':
        setIsColorModalOpen(false);
        break;
      case 'link':
        setIsLinkModalOpen(false);
        break;
      case 'image':
        setIsImageModalOpen(false);
        break;
      case 'prompt':
        setIsPromptModalOpen(false);
        break;
      default:
        break;
    }
    setCurrentWidget(null);
  };

  return {
    isColorModalOpen,
    isLinkModalOpen,
    isImageModalOpen,
    isPromptModalOpen,
    currentWidget,
    openModal,
    closeModal,
  };
};

export default useModalManager;
