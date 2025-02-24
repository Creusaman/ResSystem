// MediaUploader.jsx
import React, { useState, useImperativeHandle, forwardRef, useEffect, snapCenterToCursor } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { uploadFiles, deleteFiles } from 'services/firebaseStorageService';
import { useAuth } from 'Context/AuthProvider';

// Importações do dnd kit
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaTrash } from 'react-icons/fa';

// Container do Dropzone
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

// Container para os cards, responsivo: vertical em telas pequenas, horizontal com wrap em telas maiores
const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

// Card para cada arquivo (MediaCard)
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    
    & .delete-button {
      opacity: 1;
    }
  }
  
  @media (min-width: 768px) {
    width: calc(33.33% - 16px);
  }
`;

// Estilização da imagem e vídeo para ocupar toda a largura do card
const PreviewImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const PreviewVideo = styled.video`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

// Área de informação (nome e legenda) abaixo da imagem
const FileInfo = styled.div`
  padding: 8px;
  text-align: center;
`;

// Campo para editar a legenda
const InputField = styled.input`
  width: 100%;
  padding: 5px;
  margin-top: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

// Botão de exclusão (lixeira)
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

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 5px;
  background: green;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;



// Componente SortableItem para cada card
const SortableItem = ({ id, file, onCaptionChange, onDelete, progress }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition: transition || 'transform 0ms ease',
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
        {file.status === 'new' && <ProgressBar progress={progress || 0} />}
      </MediaCard>
    );
  };
  
  const MediaUploader = forwardRef(({ initialFiles = [], accommodationName, accommodationId }, ref) => {
    const [files, setFiles] = useState([]);
    const { verifyAdmin } = useAuth();
    const [uploadProgress, setUploadProgress] = useState({});
  
    useEffect(() => {
      const processed = initialFiles.map(file => ({
        ...file,
        status: 'existing',
        type: file.type || "image/jpeg",
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
        prev
          .map(f => (f.id === id ? (f.status === 'new' ? null : { ...f, status: 'deleted' }) : f))
          .filter(Boolean)
      );
    };
  
    const saveMedia = async () => {
        const deletionPromises = files
          .filter(f => f.status === 'deleted' && f.path)
          .map(async f => await deleteFiles(f.path, verifyAdmin));
        await Promise.all(deletionPromises);
    
        const uploadPromises = files
          .filter(f => f.status === 'new')
          .map(async (f, index) => {
            const uploadedFile = await uploadFiles(
              f.file,
              accommodationName,
              accommodationId,
              verifyAdmin,
              (progress) => {
                setUploadProgress(prev => ({ ...prev, [f.id]: progress }));
              }
            );
            return {
              id: uploadedFile.id,
              url: uploadedFile.url,
              path: uploadedFile.path,
              caption: f.caption || f.name,
              order: index
            };
          });
        const uploadedFiles = await Promise.all(uploadPromises);
    
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
        <SortableContext items={filteredFiles.map(f => f.id)} strategy={rectSortingStrategy} modifiers={[snapCenterToCursor]}>
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

export default MediaUploader;
