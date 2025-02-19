// src/components/AccommodationForm.jsx
import React, { useState, useEffect } from 'react';
import { uploadFile, deleteFile } from 'services/firebaseStorageService';
import ReactQuill from 'react-quill';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FaWifi, FaHotTub, FaTv, FaUtensils, FaSwimmingPool, FaBed, FaShower, FaKey, FaSpa, FaFan, FaBath  } from 'react-icons/fa';
import { LuAirVent } from "react-icons/lu";
import { GiCctvCamera, GiBarbecue  } from "react-icons/gi";
import { PiBathtub, PiFan } from "react-icons/pi";
import { SlEnergy } from "react-icons/sl";
import { TbCoffee } from "react-icons/tb";
import { FaKitchenSet } from "react-icons/fa6";
import 'react-quill/dist/quill.snow.css';
import './AccommodationForm.css';
import MediaDropZone from 'components/MediaDropZone/MediaDropZone';

const amenitiesList = [
  { id: 'Wi-Fi', label: 'Wi-Fi', icon: <FaWifi /> },
  { id: 'TV', label: 'TV', icon: <FaTv /> },
  { id: 'Café da Manhã', label: 'Café da Manhã', icon: <TbCoffee /> },
  { id: 'Piscina com Cascata', label: 'Piscina com Cascata', icon: <FaSwimmingPool /> },
  { id: 'Cama King Size', label: 'Cama King Size', icon: <FaBed /> },
  { id: 'Chuveiro Quente', label: 'Chuveiro Quente', icon: <FaShower /> },
  { id: 'Tomadas', label: 'Tomadas', icon: <SlEnergy /> },
  { id: 'Segurança', label: 'Segurança', icon: <GiCctvCamera /> },
  { id: 'Ventilador de Teto', label: 'Ventilador de Teto', icon: <PiFan /> },
  { id: 'Ar Condicionado', label: 'Ar Condicionado', icon: <LuAirVent  /> },
  { id: 'Hidromassagem', label: 'Hidromassagem', icon: <PiBathtub  /> },
  { id: 'Cozinha Comunitária', label: 'Cozinha Comunitária', icon: <FaUtensils /> },
  { id: 'Churrasqueira', label: 'Churrasqueira', icon: <GiBarbecue  /> },
  { id: 'Spa', label: 'Spa', icon: <FaHotTub /> },
];


function AccommodationForm({ initialData, onSave, onCancel, setHasUnsavedChanges }) {
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

      for (const file of files) {
        if (!file.url) {
          const uploadedFile = await uploadFile(file, 'accommodations');
          uploadedFiles.push(uploadedFile);
        } else {
          uploadedFiles.push(file);
        }
      }

      for (const file of removedFiles) {
        await deleteFile(file.path);
      }

      onSave({
        name,
        description,
        baseOccupancy,
        maxOccupancy,
        unitsAvailable,
        files: uploadedFiles,
      });

      setName('');
      setDescription('');
      setBaseOccupancy(1);
      setMaxOccupancy(1);
      setUnitsAvailable(0);
      setFiles([]);
      setRemovedFiles([]);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Erro ao salvar acomodação:', error);
    }
  };

  const handleUtilityToggle = (utility) => {
    setUtilities((prev) =>
      prev.includes(utility) ? prev.filter((u) => u !== utility) : [...prev, utility]
    );
  };

  const [items, setItems] = useState([]);


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

      {/* Descrição com Floating Label */}
      <Form.Group className="form-floating mb-3">
        <ReactQuill value={description} onChange={setDescription} />
      </Form.Group>

      <div className="bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Media Upload</h1>
        <MediaDropZone 
          items={items} 
          onItemsChange={setItems}
        />
      </div>
      {/* Botões de Alternância para Comodidades */}
    </div>
    <label>Comodidades:</label>
      <div className="utilities-container">
        {amenitiesList.map((amenity) => (
          <div key={amenity.id} className="utility-toggle">
            <input
              type="checkbox"
              className="btn-check"
              id={amenity.id}
              autoComplete="off"
              checked={utilities.includes(amenity.id)}
              onChange={() => handleUtilityToggle(amenity.id)}
            />
            <label className="utility-btn" htmlFor={amenity.id}>
              <span className="fs-2">{amenity.icon}</span>
              <span className="mt-2">{amenity.label}</span>
            </label>
          </div>
        ))}
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