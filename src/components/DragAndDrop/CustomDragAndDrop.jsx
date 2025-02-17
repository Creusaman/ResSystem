import React from 'react';
import { DndContext, SortableContext } from '@dnd-kit/core';
import DraggableItem from './DraggableItem';
import DragOverlayComponent from './DragOverlay';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';

import '../../styles/dragAndDrop.css'; // Importação do CSS global

function CustomDragAndDrop({ initialItems }) {
  const { items, setItems, activeId, setActiveId, handleDragEnd } = useDragAndDrop(initialItems);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={items}>
        <div className="drag-container">
          {items.map((item) => (
            <DraggableItem key={item.id} id={item.id}>
              {item.label}
            </DraggableItem>
          ))}
        </div>
      </SortableContext>
      <DragOverlayComponent activeItem={items.find((item) => item.id === activeId)} />
    </DndContext>
  );
}

export default CustomDragAndDrop;
