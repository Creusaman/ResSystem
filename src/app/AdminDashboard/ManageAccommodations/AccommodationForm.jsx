// src/components/AccommodationForm.jsx
import React, { useState, useEffect } from 'react';
import CustomDragAndDrop from 'components/DragAndDrop/CustomDragAndDrop';
import { uploadFile, deleteFile } from 'services/firebaseStorageService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Importação do CSS do editor de texto
import './AccommodationForm.css';

function AccommodationForm({ initialData, onSave, onCancel }) {
  const isEditing = Boolean(initialData);

  // Estados dos campos
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [baseOccupancy, setBaseOccupancy] = useState(initialData?.baseOccupancy || 1);
  const [maxOccupancy, setMaxOccupancy] = useState(initialData?.maxOccupancy || 1);
  const [unitsAvailable, setUnitsAvailable] = useState(initialData?.unitsAvailable || 0);
  const [price, setPrice] = useState(initialData?.price || 0);
  const [utilities, setUtilities] = useState(initialData?.utilities || []);
  const [files, setFiles] = useState(initialData?.files || []);
  const [removedFiles, setRemovedFiles] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFiles(initialData.files || []);
    }
  }, [initialData]);

  const handleSave = async () => {
    try {
      const uploadedFiles = [];

      // Enviar novos arquivos ao Firebase
      for (const file of files) {
        if (!file.url) {
          const uploadedFile = await uploadFile(file, 'accommodations');
          uploadedFiles.push(uploadedFile);
        } else {
          uploadedFiles.push(file);
        }
      }

      // Remover arquivos deletados do Firebase
      for (const file of removedFiles) {
        await deleteFile(file.path);
      }

      onSave({
        name,
        description,
        baseOccupancy,
        maxOccupancy,
        unitsAvailable,
        price,
        utilities,
        files: uploadedFiles,
      });

      setRemovedFiles([]);
    } catch (error) {
      console.error('Erro ao salvar acomodação:', error);
    }
  };

  const handleUtilityChange = (utility) => {
    setUtilities((prev) =>
      prev.includes(utility) ? prev.filter((u) => u !== utility) : [...prev, utility]
    );
  };

  return (
    <div className="accommodation-form">
      <h2>{isEditing ? 'Editar Acomodação' : 'Nova Acomodação'}</h2>

      <label>Nome:</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

      <label>Descrição:</label>
      <ReactQuill value={description} onChange={setDescription} />

      <label>Ocupação Base:</label>
      <input
        type="number"
        min="1"
        value={baseOccupancy}
        onChange={(e) => setBaseOccupancy(Number(e.target.value))}
      />

      <label>Ocupação Máxima:</label>
      <input
        type="number"
        min={baseOccupancy}
        value={maxOccupancy}
        onChange={(e) => setMaxOccupancy(Number(e.target.value))}
      />

      <label>Unidades Disponíveis:</label>
      <input
        type="number"
        min="0"
        value={unitsAvailable}
        onChange={(e) => setUnitsAvailable(Number(e.target.value))}
      />

      <label>Preço por Noite:</label>
      <input
        type="number"
        min="0"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      />

     

      <label>Fotos e Vídeos:</label>
      <CustomDragAndDrop initialItems={files} onItemsUpdate={setFiles} />

      <div className="button-group">
        <button onClick={handleSave}>
          {isEditing ? 'Salvar Alterações' : 'Criar Acomodação'}
        </button>
        <button onClick={onCancel}>
          {isEditing ? 'Cancelar Alterações' : 'Limpar Campos'}
        </button>
      </div>
      <label>Utilitários:</label>
      <div className="utilities-container">
        {[
          'Wi-Fi',
          'TV',
          'Frigobar',
          'Piscina com Cascata',
          'Cozinha Comunitária',
          'Banheira de Hidromassagem',
          'Ventilador de Teto',
          'Chuveiro Quente',
          'Tomadas',
          'Segurança',
          'Café da Manhã',
          'Churrasqueira',
          'Spa',
        ].map((utility) => (
          <label key={utility} className="utility-checkbox">
            <input
              type="checkbox"
              checked={utilities.includes(utility)}
              onChange={() => handleUtilityChange(utility)}
            />
            {utility}
          </label>
        ))}
      </div>
    </div>
  );
}

export default AccommodationForm;
