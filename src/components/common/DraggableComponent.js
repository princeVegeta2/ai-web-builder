import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableComponent = ({ name }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: { name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <li ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }} className="draggable-component">
      {name}
    </li>
  );
};

export default DraggableComponent;
