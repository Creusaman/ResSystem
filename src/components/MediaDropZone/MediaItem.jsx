import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X } from 'lucide-react';
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
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-md opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
      >
        <X className="w-3.5 h-3.5 text-red-500" />
      </button>
    </div>
  );
}
