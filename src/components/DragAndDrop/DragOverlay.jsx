// src/components/DragAndDrop/DragOverlay.jsx
import React from 'react';
import { DragOverlay } from '@dnd-kit/core';
import 'components/DragAndDrop/styles/dragOverlay.css'; // ✅ Caminho corrigido

/**
 * Componente responsável por renderizar o item arrastado como um overlay.
 *
 * @param {Object} props
 * @param {Object} props.activeItem - Item ativo sendo arrastado.
 */
function DragOverlayComponent({ activeItem }) {
  return (
    <DragOverlay>
      {activeItem && <div className="drag-overlay">{activeItem.label}</div>}
    </DragOverlay>
  );
}

export default DragOverlayComponent;
