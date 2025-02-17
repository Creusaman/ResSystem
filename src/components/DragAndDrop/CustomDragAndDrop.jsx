// src/components/DragAndDrop/CustomDragAndDrop.jsx
import React, { useState, useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import DraggableItem from './DraggableItem';
import DragOverlayComponent from './DragOverlay';
import useDragAndDrop from './hooks/useDragAndDrop';
import { FaPlus, FaTrash, FaThLarge, FaTh, FaThList } from 'react-icons/fa';
import './styles/dragAndDrop.css';

function CustomDragAndDrop({ initialItems, onItemsUpdate }) {
  const { items, setItems, activeId, setActiveId, handleDragEnd } = useDragAndDrop(initialItems);
  const [files, setFiles] = useState(initialItems || []);
  const [thumbnailSize, setThumbnailSize] = useState('medium');

  useEffect(() => {
    setFiles(initialItems || []);
  }, [initialItems]);

  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files).map((file) => ({
      id: URL.createObjectURL(file),
      file,
      type: file.type.startsWith('image') ? 'image' : 'video',
    }));

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    setItems((prevItems) => [...prevItems, ...newFiles]);

    if (onItemsUpdate) {
      onItemsUpdate([...files, ...newFiles]);
    }
  };

  const handleRemove = (id) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));

    if (onItemsUpdate) {
      onItemsUpdate(files.filter((file) => file.id !== id));
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={items}>
        <div className="thumbnail-size-controls">
          <button onClick={() => setThumbnailSize('small')}><FaTh /></button>
          <button onClick={() => setThumbnailSize('medium')}><FaThLarge /></button>
          <button onClick={() => setThumbnailSize('large')}><FaThList /></button>
        </div>
        <div className="drag-container-horizontal">
          {items.map((item) => (
            <DraggableItem key={item.id} id={item.id}>
              <div className={`thumbnail-container-horizontal ${thumbnailSize}`}>
                {item.type === 'image' ? (
                  <img src={item.id} alt="Preview" className="thumbnail-horizontal" />
                ) : (
                  <video src={item.id} className="thumbnail-horizontal" controls />
                )}
                <button className="remove-button" onClick={() => handleRemove(item.id)}>
                  <FaTrash />
                </button>
              </div>
            </DraggableItem>
          ))}
          <label htmlFor="file-upload" className="btn-upload">
            + Fotos e Vídeos
          </label>
          <input type="file" id="file-upload" multiple accept="image/*,video/*" onChange={handleFileUpload} style={{ display: 'none' }} />
        </div>
      </SortableContext>
      <DragOverlayComponent activeItem={items.find((item) => item.id === activeId)} />
    </DndContext>
  );
}

export default CustomDragAndDrop;