import React from 'react';
import { useDrop } from 'react-dnd';

const DroppableArea = ({ onDrop, children }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item) => onDrop(item.name),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className="droppable-area" style={{ backgroundColor: isOver ? '#efede3' : 'white' }}>
      {children}
    </div>
  );
};

export default DroppableArea;
