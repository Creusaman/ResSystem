import React, { useState } from 'react';
import { DndContext, closestCenter, DragOverlay, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import MediaItem from './MediaItem';
import "./MediaStyles.css";

export default function MediaDropZone({ items, onItemsChange }) {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 0, tolerance: 0 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [], 'video/*': [] },
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) => ({
        id: URL.createObjectURL(file),
        file,
        type: file.type.startsWith('image') ? 'image' : 'video',
      }));
      onItemsChange([...items, ...newFiles]);
    },
  });

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    document.body.style.cursor = 'grabbing';
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    document.body.style.cursor = '';
    
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      
      const newItems = [...items];
      const [removed] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, removed);
      
      onItemsChange(newItems);
    }
    
    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    document.body.style.cursor = '';
  };

  const removeItem = (id) => {
    onItemsChange(items.filter(item => item.id !== id));
  };

  const dropZoneClasses = "relative border-2 border-dashed border-gray-300 rounded-lg w-full min-h-[240px] transition-all duration-300";
  const gridClasses = "grid gap-4 p-4 mt-16 grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  const activeItem = activeId ? items.find(item => item.id === activeId) : null;

  return (
    <div className={dropZoneClasses} {...getRootProps()}>
      <input {...getInputProps()} />
      
      <div className="absolute top-4 left-4 z-10">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            document.querySelector('input[type="file"]').click();
          }}
        >
          <Upload size={20} />
          <span>Add Media</span>
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
        <SortableContext items={items.map(item => item.id)} strategy={rectSortingStrategy}>
          <div className={gridClasses}>
            {items.map((item) => (
              <MediaItem key={item.id} item={item} onRemove={() => removeItem(item.id)} isDragging={item.id === activeId} />
            ))}
          </div>
        </SortableContext>
        <DragOverlay adjustScale={false} dropAnimation={null}>
  {activeItem && (
    <div className="w-[160px] h-[120px] bg-white shadow-xl rounded-lg overflow-hidden">
      {activeItem.type === 'image' ? (
        <img src={activeItem.id} alt="Dragging preview" className="w-full h-full object-cover" draggable={false} />
      ) : (
        <video src={activeItem.id} className="w-full h-full object-cover" draggable={false} />
      )}
    </div>
  )}
</DragOverlay>

      </DndContext>

      {items.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <p>Drag and drop media files here, or click to select files</p>
        </div>
      )}
    </div>
  );
}
