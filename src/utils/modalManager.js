// src/utils/modalManager.js
import { useState } from 'react';

const useModalManager = () => {
  const [modals, setModals] = useState({});

  const openModal = (type, windowId, widgetId) => {
    const key = `${windowId}-${widgetId}`;
    setModals((prevModals) => ({
      ...prevModals,
      [key]: {
        ...(prevModals[key] || {}),
        [type]: true,
      },
    }));
  };

  const closeModal = (type, windowId, widgetId) => {
    const key = `${windowId}-${widgetId}`;
    setModals((prevModals) => ({
      ...prevModals,
      [key]: {
        ...(prevModals[key] || {}),
        [type]: false,
      },
    }));
  };

  const isModalOpen = (type, windowId, widgetId) => {
    const key = `${windowId}-${widgetId}`;
    return modals[key]?.[type] || false;
  };

  return {
    openModal,
    closeModal,
    isModalOpen,
  };
};

export default useModalManager;
