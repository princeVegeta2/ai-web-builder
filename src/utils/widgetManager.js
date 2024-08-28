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
  
  export const removeWidget = (windowId, widgetId, windows, setWindows) => {
    const updatedWindows = windows.map(window =>
      window.id === windowId
        ? { ...window, widgets: window.widgets.filter(widget => widget.id !== widgetId) }
        : window
    );
    setWindows(updatedWindows);
  };
  
  export const handleDragOver = (e) => {
    e.preventDefault();
  };
  