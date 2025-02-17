import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import '../../styles/draggableItem.css'; // Importação do CSS específico

function DraggableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} className="draggable-item" style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export default DraggableItem;
