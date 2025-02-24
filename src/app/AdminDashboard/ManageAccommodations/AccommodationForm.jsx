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

const initialFormState = {
  name: "",
  description: "",
  baseOccupancy: "",
  maxOccupancy: "",
  unitsAvailable: "",
  files: [],
  amenities: [],
};

function AccommodationForm() {
  const { isEditing, saveAccommodation, setHasUnsavedChanges, selectAccommodation } = useAccommodations();
  const [formData, setFormData] = useState(initialFormState);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [formError, setFormError] = useState("");
  const mediaUploaderRef = useRef();

  useEffect(() => {
    if (isEditing) {
      setFormData({ ...isEditing });
      setMediaFiles(isEditing.files || []);
    } else {
      clearForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Função que limpa completamente o formulário e a seleção,
  // garantindo que o flag de alterações não salvas seja zerado antes de deselecionar.
  const clearForm = () => {
    setHasUnsavedChanges(false);
    setFormData(initialFormState);
    setMediaFiles([]);
    selectAccommodation(null);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validação dos campos obrigatórios
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      formData.baseOccupancy === "" ||
      formData.maxOccupancy === "" ||
      formData.unitsAvailable === ""
    ) {
      setFormError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    setFormError("");
    try {
      const finalFiles = await mediaUploaderRef.current.saveMedia();
      // Removemos o campo "id" para novos documentos; se for edição, o id vem do isEditing
      const { id, ...dataWithoutId } = formData;
      const updatedData = { ...dataWithoutId, files: finalFiles };
      await saveAccommodation(updatedData);
      clearForm();
    } catch (error) {
      console.error("Erro ao salvar acomodação:", error);
      setFormError("Erro ao salvar acomodação. Verifique os dados e tente novamente.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded">
      <h2>{isEditing ? "Editar Acomodação" : "Nova Acomodação"}</h2>

      {formError && <div className="error-message">{formError}</div>}

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
        <ReactQuill
          value={formData.description}
          onChange={(value) => setFormData({ ...formData, description: value })}
        />
      </Form.Group>

      {/* Área de upload de mídia utilizando o MediaUploader */}
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
        <Button variant="secondary" className="ms-2" onClick={clearForm}>
          {isEditing ? "Cancelar Alterações" : "Limpar Campos"}
        </Button>
      </div>
    </form>
  );
}

export default AccommodationForm;
