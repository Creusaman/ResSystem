// AccommodationForm.jsx
import React, { useEffect, useState, useRef } from "react";
import { useAccommodations } from "./AccommodationContext";
import MediaUploader from "components/MediaUploader/MediaUploader";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  FaWifi, FaHotTub, FaTv, FaUtensils, FaSwimmingPool, FaBed, FaShower, FaKey, FaSpa, FaFan, FaBath
} from "react-icons/fa";
import { LuAirVent } from "react-icons/lu";
import { GiCctvCamera, GiBarbecue } from "react-icons/gi";
import { PiBathtub, PiFan } from "react-icons/pi";
import { SlEnergy } from "react-icons/sl";
import { TbCoffee } from "react-icons/tb";
import { FaKitchenSet } from "react-icons/fa6";
import "./AccommodationForm.css";
import { v4 as uuidv4 } from 'uuid';

const amenitiesList = [
  { id: "Wi-Fi", label: "Wi-Fi", icon: <FaWifi /> },
  { id: "TV", label: "TV", icon: <FaTv /> },
  { id: "Café da Manhã", label: "Café da Manhã", icon: <TbCoffee /> },
  { id: "Piscina com Cascata", label: "Piscina com Cascata", icon: <FaSwimmingPool /> },
  { id: "Cama King Size", label: "Cama King Size", icon: <FaBed /> },
  { id: "Chuveiro Quente", label: "Chuveiro Quente", icon: <FaShower /> },
  { id: "Tomadas", label: "Tomadas", icon: <SlEnergy /> },
  { id: "Segurança", label: "Segurança", icon: <GiCctvCamera /> },
  { id: "Ventilador de Teto", label: "Ventilador de Teto", icon: <PiFan /> },
  { id: "Ar Condicionado", label: "Ar Condicionado", icon: <LuAirVent /> },
  { id: "Hidromassagem", label: "Hidromassagem", icon: <PiBathtub /> },
  { id: "Cozinha Comunitária", label: "Cozinha Comunitária", icon: <FaUtensils /> },
  { id: "Churrasqueira", label: "Churrasqueira", icon: <GiBarbecue /> },
  { id: "Spa", label: "Spa", icon: <FaHotTub /> },
];

function AccommodationForm() {
  const { isEditing, saveAccommodation, setHasUnsavedChanges } = useAccommodations();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    baseOccupancy: 1,
    maxOccupancy: 1,
    unitsAvailable: 0,
    files: [],
    amenities: [],
  });

  // Estado para armazenar os arquivos de mídia
  const [mediaFiles, setMediaFiles] = useState([]);

  // Ref para acessar o método saveMedia do MediaUploader
  const mediaUploaderRef = useRef();

  useEffect(() => {
    if (isEditing) {
      setFormData({ ...isEditing });
      setMediaFiles(isEditing.files || []);
    } else {
      setFormData({
        name: "",
        description: "",
        baseOccupancy: 1,
        maxOccupancy: 1,
        unitsAvailable: 0,
        files: [],
        amenities: [],
      });
      setMediaFiles([]);
    }
  }, [isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setHasUnsavedChanges(true);
  };

  const handleAmenityToggle = (amenityId) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gera um ID para a acomodação se for nova
      const accommodationId = isEditing ? isEditing.id : uuidv4();
      // Processa os arquivos de mídia chamando saveMedia do MediaUploader
      const finalFiles = await mediaUploaderRef.current.saveMedia();
      // Atualiza os dados com a lista final de arquivos
      const updatedData = { ...formData, files: finalFiles, id: accommodationId };
      await saveAccommodation(updatedData);
    } catch (error) {
      console.error("Erro ao salvar acomodação:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded">
      <h2>{isEditing ? "Editar Acomodação" : "Nova Acomodação"}</h2>

      <Form.Group className="form-floating mb-3">
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nome da Acomodação"
        />
        <Form.Label>Nome da Acomodação</Form.Label>
      </Form.Group>

      <div className="form-row d-flex gap-2">
        <Form.Group className="form-floating flex-grow-1">
          <Form.Control
            type="number"
            name="baseOccupancy"
            placeholder="Ocupação Base"
            value={formData.baseOccupancy}
            min="1"
            onChange={handleChange}
          />
          <Form.Label>Ocupação Base</Form.Label>
        </Form.Group>

        <Form.Group className="form-floating flex-grow-1">
          <Form.Control
            type="number"
            name="maxOccupancy"
            placeholder="Ocupação Máxima"
            value={formData.maxOccupancy}
            min={formData.baseOccupancy}
            onChange={handleChange}
          />
          <Form.Label>Ocupação Máxima</Form.Label>
        </Form.Group>

        <Form.Group className="form-floating flex-grow-1">
          <Form.Control
            type="number"
            name="unitsAvailable"
            placeholder="Unidades Disponíveis"
            value={formData.unitsAvailable}
            min="0"
            onChange={handleChange}
          />
          <Form.Label>Unidades Disponíveis</Form.Label>
        </Form.Group>
      </div>

      <Form.Group className="form-floating mb-3">
        <ReactQuill value={formData.description} onChange={(value) => setFormData({ ...formData, description: value })} />
      </Form.Group>

      {/* Nova área de upload de mídia utilizando o MediaUploader */}
      <div className="bg-gray-100 p-4">
        <h3 className="text-2xl font-bold mb-4">Media Upload</h3>
        <MediaUploader
          ref={mediaUploaderRef}
          initialFiles={mediaFiles}
          accommodationName={formData.name}
          accommodationId={isEditing ? isEditing.id : formData.name}  
        />
      </div>

      <label className="mt-3 fw-bold">Comodidades:</label>
      <div className="utilities-container d-flex flex-wrap">
        {amenitiesList.map((amenity) => (
          <div key={amenity.id} className="utility-toggle m-2">
            <input
              type="checkbox"
              className="btn-check"
              id={amenity.id}
              autoComplete="off"
              checked={formData.amenities.includes(amenity.id)}
              onChange={() => handleAmenityToggle(amenity.id)}
            />
            <label className="utility-btn" htmlFor={amenity.id}>
              <span className="fs-2">{amenity.icon}</span>
              <span className="mt-2">{amenity.label}</span>
            </label>
          </div>
        ))}
      </div>

      <div className="button-group mt-4">
        <Button type="submit">{isEditing ? "Salvar Alterações" : "Criar Acomodação"}</Button>
        <Button variant="secondary" className="ms-2" onClick={() => {
          setFormData({ name: "", description: "", baseOccupancy: 1, maxOccupancy: 1, unitsAvailable: 0, files: [], amenities: [] });
          setMediaFiles([]);
        }}>
          {isEditing ? "Cancelar Alterações" : "Limpar Campos"}
        </Button>
      </div>
    </form>
  );
}

export default AccommodationForm;
