// src/utils/widgetManager.js
export const handleOnDrag = (e, widgetType) => {
  e.dataTransfer.setData("widgetType", widgetType);
};

export const handleOnDrop = (e, windowId, windows, setWindows) => {
  e.preventDefault();
  const widgetType = e.dataTransfer.getData("widgetType");
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
};

export const addWidgetModal = (windowId, widgetId, modalType, windows, setWindows) => {
  const updatedWindows = windows.map(window => {
      if (window.id === windowId) {
          return {
              ...window,
              widgets: window.widgets.map(widget => {
                  if (widget.id === widgetId) {
                      let updatedWidget = { ...widget, modals: [...widget.modals, modalType] };

                      // Initialize the corresponding data structure based on the modal type
                      switch (modalType) {
                          case 'color':
                              updatedWidget.colors = updatedWidget.colors || [{ id: Date.now(), value: '' }];
                              break;
                          case 'link':
                              updatedWidget.links = updatedWidget.links || [{ id: Date.now(), name: '', url: '' }];
                              break;
                          case 'image':
                              updatedWidget.images = updatedWidget.images || [{ id: Date.now(), value: '' }];
                              break;
                          case 'prompt':
                              updatedWidget.promptString = updatedWidget.promptString || '';
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
  setWindows(updatedWindows);
};

export const removeWidget = (windowId, widgetId, windows, setWindows) => {
  const updatedWindows = windows.map(window =>
      window.id === windowId
          ? { ...window, widgets: window.widgets.filter(widget => widget.id !== widgetId) }
          : window
  );
  setWindows(updatedWindows);
};

export const removeWidgetModal = (windowId, widgetId, modalType, windows, setWindows) => {
  const updatedWindows = windows.map(window => {
      if (window.id === windowId) {
          return {
              ...window,
              widgets: window.widgets.map(widget => {
                  if (widget.id === widgetId) {
                      const updatedModals = widget.modals.filter(modal => modal !== modalType);
                      const updatedWidget = { ...widget, modals: updatedModals };

                      // Optionally, remove the associated data structure when the modal is removed
                      switch (modalType) {
                          case 'color':
                              delete updatedWidget.colors;
                              break;
                          case 'link':
                              delete updatedWidget.links;
                              break;
                          case 'image':
                              delete updatedWidget.images;
                              break;
                          case 'prompt':
                              delete updatedWidget.promptString;
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
  setWindows(updatedWindows);
};

export const handleDragOver = (e) => {
  e.preventDefault();
};
