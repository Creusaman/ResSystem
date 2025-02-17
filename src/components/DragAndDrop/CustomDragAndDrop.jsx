// src/components/DragAndDrop/CustomDragAndDrop.jsx
import React from 'react';
import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable'; // ✅ Importação corrigida
import DraggableItem from 'components/DragAndDrop/DraggableItem';
import DragOverlayComponent from 'components/DragAndDrop/DragOverlay';
import useDragAndDrop from 'components/DragAndDrop/hooks/useDragAndDrop'; // ✅ Corrigido para `export default`
import 'components/DragAndDrop/styles/dragAndDrop.css'; // ✅ Caminho corrigido

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
