// hooks/useDragAndDrop.js
import { useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

/**
 * Hook personalizado para gerenciar o estado do Drag and Drop.
 * 
 * @param {Array} initialItems - Lista inicial de itens no drag and drop.
 * @returns {Object} - Contém os estados e funções para manipular os itens.
 */
export function useDragAndDrop(initialItems) {
  const [items, setItems] = useState(initialItems);
  const [activeId, setActiveId] = useState(null);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  return { items, setItems, activeId, setActiveId, handleDragEnd };
}
