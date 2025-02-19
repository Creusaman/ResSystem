import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import MediaItem from './MediaItem';
import "./MediaStyles.css";
import { v4 as uuidv4 } from 'uuid';
import { useAccommodations } from 'app/AdminDashboard/ManageAccommodations/AccommodationContext';

export default function MediaDropZone({ items, onItemsChange }) {
  const { isEditing } = useAccommodations();
  const [localItems, setLocalItems] = useState([]);

  // ✅ Sincroniza `localItems` com `isEditing.files` ao mudar a acomodação em edição
  useEffect(() => {
    if (isEditing) {
      setLocalItems(isEditing.files || []);
    } else {
      setLocalItems([]);
    }
  }, [isEditing]);

  // ✅ Atualiza o estado local quando `items` muda
  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  // ✅ Configuração de sensores para arrastar imagens
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 0, tolerance: 0 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  // ✅ Configuração do Dropzone para adicionar novos arquivos localmente
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [], 'video/*': [] },
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map(file => ({
        id: uuidv4(),
        file,
        type: file.type || "image/jpeg",
        url: URL.createObjectURL(file), // ✅ Cria um preview temporário
        isNew: true, // ✅ Marca como novo para ser enviado apenas ao salvar
      }));

      setLocalItems(prev => [...prev, ...newFiles]);
      onItemsChange([...localItems, ...newFiles]);
    },
  });

  // ✅ Manipula a reordenação das imagens sem ativar upload imediato
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localItems.findIndex((item) => item.id === active.id);
    const newIndex = localItems.findIndex((item) => item.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newItems = [...localItems];
      const [removed] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, removed);
      setLocalItems(newItems);
      onItemsChange(newItems);
    }
  };

  // ✅ Remove um arquivo da lista local sem deletar do Firebase ainda
  const handleRemove = (id) => {
    const updatedItems = localItems.filter(item => item.id !== id);
    setLocalItems(updatedItems);
    onItemsChange(updatedItems);
  };

  return (
    <div className="relative border-2 border-dashed border-gray-300 rounded-lg w-full min-h-[240px] transition-all duration-300 media-upload-container" {...getRootProps()}>
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
          <span>Adicionar Mídia</span>
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={localItems.map(item => item.id)} strategy={rectSortingStrategy}>
          <div className="grid gap-4 p-4 mt-16 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {localItems.map((item) => (
              <MediaItem key={item.id} item={item} onRemove={() => handleRemove(item.id)} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {localItems.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <p>Arraste e solte arquivos de mídia aqui ou clique para selecionar.</p>
        </div>
      )}
    </div>
  );
}
