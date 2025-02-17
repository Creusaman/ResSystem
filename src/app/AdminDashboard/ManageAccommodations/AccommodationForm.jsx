import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { uploadFile, deleteFile } from '../../../services/firebaseStorageService';
import { updateAccommodation } from '../../../services/firestoreService';
import { useAuth } from '../../../Context/AuthProvider';
import CustomDragAndDrop from '../../../components/CustomDragAndDrop';
import { Home } from 'lucide-react';
import './AccommodationForm.css';
import MediaManager from '../../../components/MediaManager';

function AccommodationForm({ accommodation, onSave, onClose, availableAccommodations = [] }) {
  const { verifyAdmin } = useAuth(); // Obtendo a função de verificação de admin

  const [formData, setFormData] = useState({
    name: '',
    maxPeople: 0,
    baseOccupancy: 0,
    unitsAvailable: 1,
    description: '',
    files: [],
  });

  useEffect(() => {
    if (accommodation) {
      console.log("Acomodação carregada:", accommodation);
      setFormData({
        name: accommodation.name || '',
        maxPeople: accommodation.maxPeople || 0,
        baseOccupancy: accommodation.baseOccupancy || 0,
        unitsAvailable: accommodation.unitsAvailable || 1,
        description: accommodation.description || '',
        files: accommodation.files?.map(file => ({ id: file, url: file })) || [],
      });
    }
  }, [accommodation]);

  const handleFileUpload = async (acceptedFiles) => {
    console.log("Arquivos recebidos no dropzone:", acceptedFiles);
    const newFiles = await Promise.all(
      acceptedFiles.map(async (file) => {
        console.log("Processando arquivo:", file.name);
        const compressedFile = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920 });
        return { id: `${file.name}-${Date.now()}`, url: URL.createObjectURL(compressedFile), file: compressedFile };
      })
    );

    setFormData((prev) => ({ ...prev, files: [...prev.files, ...newFiles] }));
  };

  const handleRemoveFile = (fileId) => {
    console.log("Removendo arquivo:", fileId);
    setFormData(prev => ({ ...prev, files: prev.files.filter(file => file.id !== fileId) }));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    
    const oldIndex = formData.files.findIndex((file) => file.id === active.id);
    const newIndex = formData.files.findIndex((file) => file.id === over.id);
    
    if (oldIndex !== -1 && newIndex !== -1) {
      console.log(`Reordenando arquivos: ${oldIndex} → ${newIndex}`);
      setFormData((prev) => ({ ...prev, files: arrayMove(prev.files, oldIndex, newIndex) }));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*,video/*',
    onDrop: handleFileUpload
  });

  return (
    <div className="accommodation-form">
      <h2>{accommodation ? 'Editar Acomodação' : 'Nova Acomodação'}</h2>
      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
        
        <label>Nome</label>
        <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        
        <label>Ocupação Base</label>
        <input type="number" name="baseOccupancy" value={formData.baseOccupancy} onChange={(e) => setFormData({ ...formData, baseOccupancy: e.target.value })} required />
        
        <label>Capacidade Máxima</label>
        <input type="number" name="maxPeople" value={formData.maxPeople} onChange={(e) => setFormData({ ...formData, maxPeople: e.target.value })} required />
        
        <label>Unidades Disponíveis</label>
        <input type="number" name="unitsAvailable" value={formData.unitsAvailable} onChange={(e) => setFormData({ ...formData, unitsAvailable: e.target.value })} required />

        <label>Acomodação Base</label>
        {availableAccommodations.length > 0 ? (
          <CustomDragAndDrop
            options={availableAccommodations.map(acc => ({ value: acc.id, label: acc.name }))}
            value={availableAccommodations.find(acc => acc.id === formData.baseOccupancy)}
            onChange={(selected) => setFormData({ ...formData, baseOccupancy: selected.value })}
            placeholder="Selecione uma acomodação base"
            icon={Home}
          />
        ) : (
          <p>🚫 Nenhuma acomodação disponível para seleção</p>
        )}

        <label>Descrição</label>
        <ReactQuill value={formData.description} onChange={(value) => setFormData({ ...formData, description: value })} />
        
        <label>Fotos e Vídeos</label>
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p className="dropzone-text">📂 Clique ou arraste arquivos aqui para adicionar</p>
        </div>
        
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={formData.files.map(file => file.id)} strategy={horizontalListSortingStrategy}>
            <div className="file-list">
              {formData.files.map((file) => (
                <div key={file.id} className="file-item">
                  <img src={file.url} alt={file.id} className="file-thumbnail" />
                  <button type="button" onClick={() => handleRemoveFile(file.id)}>🗑️ Remover</button>
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <button type="submit" className="btn btn-success">Salvar</button>
      </form>
      <div className="accommodation-form">
      <h2>{accommodation ? "Editar Acomodação" : "Nova Acomodação"}</h2>
      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
        
        <label>Nome</label>
        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        
        <label>Fotos e Vídeos</label>
        <MediaManager files={formData.files} setFiles={(files) => setFormData({ ...formData, files })} />
        
        <button type="submit" className="btn btn-success">Salvar</button>
      </form>
    </div>
    </div>
    
  );
}

export default AccommodationForm;
