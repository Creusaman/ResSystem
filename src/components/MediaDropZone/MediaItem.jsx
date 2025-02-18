import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaTrash } from 'react-icons/fa';
import "./MediaStyles.css";

export default function MediaItem({ item, onRemove, isDragging }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ 
    id: item.id,
    transition: {
      duration: 200,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    touchAction: 'none',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative aspect-4-3 bg-gray-100 rounded-lg overflow-hidden group cursor-grab active:cursor-grabbing"
    >
      {/* Thumbnail da Imagem ou Vídeo */}
      <div className="aspect-[4/3] w-full h-auto">
        {item.type === 'image' ? (
          <img
            src={item.id}
            alt="Media preview"
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <video
            src={item.id}
            className="w-full h-full object-cover"
            controls
            draggable={false}
          />
        )}
      </div>

      {/* Botão de Excluir - Agora aparece apenas quando o mouse está sobre a thumbnail */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Evita que o clique no botão inicie o drag
          onRemove();
        }}
        onPointerDownCapture={(e) => e.stopPropagation()} // Impede que o clique seja detectado como um evento de drag
        className="media-delete-btn"
      >
        <FaTrash className="w-4 h-4 text-red-500 hover:text-white" />
      </button>
    </div>
  );
}
