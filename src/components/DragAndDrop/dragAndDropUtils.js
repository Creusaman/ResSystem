// components/DragAndDrop/dragAndDropUtils.js
import { arrayMove } from '@dnd-kit/sortable';

/**
 * Reorganiza os itens após o evento de drag.
 *
 * @param {Array} items - Lista de itens atual.
 * @param {string} activeId - ID do item arrastado.
 * @param {string} overId - ID do item sobreposto.
 * @returns {Array} - Lista reordenada.
 */
export function reorderItems(items, activeId, overId) {
  const oldIndex = items.findIndex((item) => item.id === activeId);
  const newIndex = items.findIndex((item) => item.id === overId);
  return arrayMove(items, oldIndex, newIndex);
}
