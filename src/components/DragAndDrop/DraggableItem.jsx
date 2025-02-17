// src/components/DragAndDrop/DraggableItem.jsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import 'components/DragAndDrop/styles/draggableItem.css'; // ✅ Caminho corrigido

/**
 * Componente para representar um item arrastável.
 *
 * @param {Object} props
 * @param {string} props.id - Identificador único do item.
 * @param {React.ReactNode} props.children - Conteúdo do item.
 */
function DraggableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="draggable-item">
      {children}
    </div>
  );
}

export default DraggableItem;
