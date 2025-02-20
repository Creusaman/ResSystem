// MediaEditor.jsx
import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { uploadFiles, deleteFiles } from 'services/firebaseStorageService';
import { useAuth } from 'Context/AuthProvider';

// Importações do dnd kit
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaTrash } from 'react-icons/fa';

const DropzoneContainer = styled.div`
  border: 2px dashed #888;
  padding: 20px;
  text-align: center;
  border-radius: 8px;
  transition: border-color 0.3s ease;
  cursor: pointer;
  margin-bottom: 20px;
  
  &:hover {
    border-color: #555;
  }
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  @media (min-width: 768px) {
    /* Em telas grandes, exibimos os cards em coluna (quadrados) */
    flex-direction: column;
  }
`;

const MediaCard = styled.div`
  position: relative;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s ease;
  width: 100%;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    
    & .delete-button {
      opacity: 1;
    }
  }
  
  /* Em telas pequenas, o layout será horizontal */
  @media (max-width: 767px) {
    flex-direction: row;
    align-items: center;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  
  @media (max-width: 767px) {
    width: 120px;
    height: 100%;
  }
`;

const PreviewVideo = styled.video`
  width: 100%;
  height: 150px;
  object-fit: cover;
  
  @media (max-width: 767px) {
    width: 120px;
    height: 100%;
  }
`;

const FileInfo = styled.div`
  padding: 8px;
  text-align: center;
  
  @media (max-width: 767px) {
    text-align: left;
    padding: 8px 12px;
  }
`;

const InputField = styled.input`
  width: 100%;
  padding: 5px;
  margin-top: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: transparent;
  border: none;
  opacity: 0;
  transition: opacity 0.3s ease, color 0.3s ease;
  color: #888;
  cursor: pointer;
  font-size: 1.2em;
  
  &:hover {
    color: #dc3545;
  }
`;

const SortableItem = ({ id, file, onCaptionChange, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 300ms ease',
  };

  return (
    <MediaCard ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {file?.type?.startsWith('video') ? (
        <PreviewVideo controls src={file.url} />
      ) : (
        <PreviewImage src={file.url} alt={file.caption || file.name} />
      )}
      <DeleteButton className="delete-button" onClick={() => onDelete(file.id)}>
        <FaTrash />
      </DeleteButton>
      <FileInfo>
        <div><strong>{file.name}</strong></div>
        <InputField
          type="text"
          placeholder="Legenda (opcional)"
          value={file.caption || ''}
          onChange={(e) => onCaptionChange(file.id, e.target.value)}
        />
      </FileInfo>
    </MediaCard>
  );
};

const MediaEditor = forwardRef(({ initialFiles = [], accommodationName, accommodationId }, ref) => {
  const [files, setFiles] = useState([]);
  const { verifyAdmin } = useAuth();

  // Ao carregar arquivos existentes, não precisamos "processá-los" novamente; apenas garantir que os dados necessários existam.
  useEffect(() => {
    const processed = initialFiles.map(file => ({
      ...file,
      status: 'existing',
      type: file.type || "image/jpeg", // valor padrão se não existir
    }));
    setFiles(processed);
  }, [initialFiles]);

  const onDrop = acceptedFiles => {
    const newFiles = acceptedFiles.map(file => ({
      id: `new-${file.name}-${Date.now()}`,
      file,
      url: URL.createObjectURL(file),
      type: file.type,
      name: file.name,
      caption: '',
      status: 'new'
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png, image/webp, video/mp4'
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 0, tolerance: 0 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleCaptionChange = (id, caption) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, caption } : f));
  };

  const handleDelete = id => {
    setFiles(prev =>
      prev.map(f => (f.id === id ? (f.status === 'new' ? null : { ...f, status: 'deleted' }) : f))
          .filter(Boolean)
    );
  };

  const saveMedia = async () => {
    // Para mídias marcadas como deletadas (e que já existiam), chamamos o serviço de deleção
    const deletionPromises = files
      .filter(f => f.status === 'deleted' && f.path)
      .map(async f => {
        await deleteFiles(f.path, verifyAdmin);
      });
    await Promise.all(deletionPromises);

    // Para os novos arquivos, fazemos o upload
    const uploadPromises = files
      .filter(f => f.status === 'new')
      .map(async (f, index) => {
        const uploadedFile = await uploadFiles(f.file, accommodationName, accommodationId, verifyAdmin);
        return {
          id: uploadedFile.id,
          url: uploadedFile.url,
          path: uploadedFile.path,
          caption: f.caption || f.name,
          order: index
        };
      });
    const uploadedFiles = await Promise.all(uploadPromises);

    // Mantemos os arquivos existentes (que não foram deletados)
    const existingFiles = files
      .filter(f => f.status === 'existing')
      .map((f, index) => ({
        ...f,
        order: index,
        caption: f.caption || f.name
      }));

    return [...existingFiles, ...uploadedFiles];
  };

  useImperativeHandle(ref, () => ({
    saveMedia
  }));

  // Filtra os arquivos que não foram marcados como deletados
  const filteredFiles = files.filter(f => f.status !== 'deleted');

  return (
    <div>
      <DropzoneContainer {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Solte os arquivos aqui...</p>
        ) : (
          <p>Arraste e solte imagens ou vídeos, ou clique para selecionar arquivos</p>
        )}
      </DropzoneContainer>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filteredFiles.map(f => f.id)} strategy={verticalListSortingStrategy}>
          <CardsContainer>
            {filteredFiles.length > 0 ? (
              filteredFiles.map((f) => (
                <SortableItem 
                  key={f.id} 
                  id={f.id} 
                  file={f} 
                  onCaptionChange={handleCaptionChange}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666', minHeight: '100px' }}>
                Nenhum arquivo
              </div>
            )}
          </CardsContainer>
        </SortableContext>
      </DndContext>
    </div>
  );
});

export default MediaEditor;
