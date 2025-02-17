// src/components/AccommodationForm.jsx
import React, { useState, useEffect } from 'react';
import CustomDragAndDrop from 'components/DragAndDrop/CustomDragAndDrop';
import { uploadFile, deleteFile } from 'services/firebaseStorageService';
import ReactQuill from 'react-quill';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FaWifi, FaTv, FaUtensils, FaSwimmingPool, FaBed, FaShower, FaFire, FaKey, FaSpa, FaFan, FaPlus } from 'react-icons/fa';
import 'react-quill/dist/quill.snow.css';
import './AccommodationForm.css';

const amenitiesList = [
  { id: 'Wi-Fi', label: 'Wi-Fi', icon: <FaWifi /> },
  { id: 'TV', label: 'TV', icon: <FaTv /> },
  { id: 'Café da Manhã', label: 'Café da Manhã', icon: <FaUtensils /> },
  { id: 'Piscina com Cascata', label: 'Piscina com Cascata', icon: <FaSwimmingPool /> },
  { id: 'Cama King Size', label: 'Cama King Size', icon: <FaBed /> },
  { id: 'Chuveiro Quente', label: 'Chuveiro Quente', icon: <FaShower /> },
  { id: 'Tomadas', label: 'Tomadas', icon: <FaKey /> },
  { id: 'Segurança', label: 'Segurança', icon: <FaFire /> },
  { id: 'Ventilador de Teto', label: 'Ventilador de Teto', icon: <FaFan /> },
  { id: 'Banheira de Hidromassagem', label: 'Banheira de Hidromassagem', icon: <FaSpa /> },
  { id: 'Cozinha Comunitária', label: 'Cozinha Comunitária', icon: <FaUtensils /> },
  { id: 'Churrasqueira', label: 'Churrasqueira', icon: <FaFire /> },
  { id: 'Spa', label: 'Spa', icon: <FaSpa /> },
];

function AccommodationForm({ initialData, onSave, onCancel }) {
  const isEditing = Boolean(initialData);

  // Estados dos campos do formulário
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [baseOccupancy, setBaseOccupancy] = useState(initialData?.baseOccupancy || 1);
  const [maxOccupancy, setMaxOccupancy] = useState(initialData?.maxOccupancy || 1);
  const [unitsAvailable, setUnitsAvailable] = useState(initialData?.unitsAvailable || 0);
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
        utilities,
        files: uploadedFiles,
      });

      setRemovedFiles([]);
    } catch (error) {
      console.error('Erro ao salvar acomodação:', error);
    }
  };

  const handleUtilityToggle = (utility) => {
    setUtilities((prev) =>
      prev.includes(utility) ? prev.filter((u) => u !== utility) : [...prev, utility]
    );
  };

  return (
    <div className="accommodation-form">
      <h2>{isEditing ? 'Editar Acomodação' : 'Nova Acomodação'}</h2>

      {/* Nome com Floating Label */}
      <Form.Group className="form-floating mb-3">
        <Form.Control
          type="text"
          id="accommodationName"
          placeholder="Nome da Acomodação"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Form.Label htmlFor="accommodationName">Nome da Acomodação</Form.Label>
      </Form.Group>

      {/* Descrição com Floating Label */}
      <Form.Group className="form-floating mb-3">
        <ReactQuill value={description} onChange={setDescription} />
      </Form.Group>

      {/* Campos na mesma linha */}
      <div className="form-row">
        <Form.Group className="form-floating flex-grow-1">
          <Form.Control
            type="number"
            id="baseOccupancy"
            placeholder="Ocupação Base"
            value={baseOccupancy}
            min="1"
            onChange={(e) => setBaseOccupancy(Number(e.target.value))}
          />
          <Form.Label htmlFor="baseOccupancy">Ocupação Base</Form.Label>
        </Form.Group>

        <Form.Group className="form-floating flex-grow-1">
          <Form.Control
            type="number"
            id="maxOccupancy"
            placeholder="Ocupação Máxima"
            value={maxOccupancy}
            min={baseOccupancy}
            onChange={(e) => setMaxOccupancy(Number(e.target.value))}
          />
          <Form.Label htmlFor="maxOccupancy">Ocupação Máxima</Form.Label>
        </Form.Group>

        <Form.Group className="form-floating flex-grow-1">
          <Form.Control
            type="number"
            id="unitsAvailable"
            placeholder="Unidades Disponíveis"
            value={unitsAvailable}
            min="0"
            onChange={(e) => setUnitsAvailable(Number(e.target.value))}
          />
          <Form.Label htmlFor="unitsAvailable">Unidades Disponíveis</Form.Label>
        </Form.Group>
      </div>

      {/* Upload de Imagens + Botão de Adicionar */}
      <div className="image-upload-section">
        <CustomDragAndDrop initialItems={files} onItemsUpdate={setFiles} />

      </div>

      <div className="button-group">
        <Button onClick={handleSave}>{isEditing ? 'Salvar Alterações' : 'Criar Acomodação'}</Button>
        <Button variant="secondary" onClick={onCancel}>
          {isEditing ? 'Cancelar Alterações' : 'Limpar Campos'}
        </Button>
      </div>
    </div>
  );
}

export default AccommodationForm;
