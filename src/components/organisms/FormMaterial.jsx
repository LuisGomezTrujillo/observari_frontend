import React, { useState, useEffect } from "react";
import { InputText } from "../atoms/InputText";
import { SelectInput } from "../atoms/SelectInput";
import { TextArea } from "../atoms/TextArea";
import { getAreas } from "../../services/areasService";

export const FormMaterial = ({ form, handleChange, errors = {} }) => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadAreas = async () => {
      try {
        setLoading(true);
        const data = await getAreas(error => {
          console.error("Error al cargar áreas:", error);
        });
        if (data) {
          setAreas(data);
        }
      } catch (error) {
        console.error("Error al cargar áreas:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAreas();
  }, []);

  // Transformar las áreas en opciones para el select
  const areaOptions = areas.map(area => ({
    value: area.id,
    label: area.title || `Área ${area.id}`
  }));


  // Opciones para el estado del material
  const statusOptions = [
    { value: "in_use", label: "En uso" },
    { value: "under_repair", label: "En reparación" },
    { value: "damaged", label: "Dañado" },
    { value: "incomplete", label: "Incompleto" },
    { value: "lost", label: "Perdido" },
    { value: "stored", label: "Guardado" },
    { value: "being_cleaned", label: "En limpieza" },
    { value: "unavailable", label: "No disponible" }

  ];
    
  return (
    <div className="w-full max-h-[80vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
        <div className="space-y-3">
          <InputText
            label="Título"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            error={errors.title}
          />
          <InputText
            label="Referencia"
            name="reference"
            value={form.reference}
            onChange={handleChange}
            required
            error={errors.reference}
          />
          <SelectInput
            label="Estado"
            name="status"
            value={form.status}
            options={statusOptions}
            onChange={handleChange}
            required
            error={errors.status}
          />
          <SelectInput
            label="Área"
            name="area_id"
            value={form.area_id}
            options={areaOptions}
            onChange={handleChange}
            isLoading={loading}
            required
            error={errors.area_id}
          />
        </div>
        <div className="space-y-3">
          <TextArea
            label="Descripción"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            error={errors.description}
          />
          <InputText
            label="URL de Foto"
            name="photo_url"
            value={form.photo_url || ""}
            onChange={handleChange}
            error={errors.photo_url}
            placeholder="https://ejemplo.com/foto-ambiente.jpg"
            type="url"
          />
        </div>
      </div>
    </div>
  );
};
