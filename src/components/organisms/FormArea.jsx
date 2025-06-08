import React, { useState, useEffect } from "react";
import { InputText } from "../atoms/InputText";
import { SelectInput } from "../atoms/SelectInput";
import { TextArea } from "../atoms/TextArea";
import { getEnvironments } from "../../services/environmentsService";

export const FormArea = ({ form, handleChange, errors = {} }) => {
  const [environments, setEnvironments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEnvironments = async () => {
      try {
        const data = await getEnvironments();
        setEnvironments(data);
      } catch (error) {
        console.error("Error al cargar ambientes:", error);
      } finally {
        setLoading(false);
      }
    };
    loadEnvironments();
  }, []);

  // Transformar los ambientes en opciones para el select
  const environmentOptions = environments.map(env => ({
    value: env.id,
    label: env.title || `Ambiente ${env.id}`
  }));

  const areaTypes = [
    { value: "practical_life", label: "Vida práctica" },
    { value: "sensorial", label: "Sensorial" },
    { value: "language", label: "Lenguaje" },
    { value: "mathematics", label: "Matemáticas" },
    { value: "cultural", label: "Cultural" },
    { value: "science", label: "Ciencias" },
    { value: "geography", label: "Geografía" },
    { value: "history", label: "Historia" },
    { value: "cosmic_education", label: "Educación Cósmica" },
    { value: "art", label: "Artes" },
    { value: "music", label: "Música" },
    { value: "emotional_education", label: "Educación Emocional" },
    { value: "movement", label: "Movimiento" },
    { value: "reading_writing", label: "Lecto-escritura" },
    { value: "social_studies", label: "Estudios Sociales" },
    { value: "ecology", label: "Ecología" },
    { value: "technology", label: "Tecnología" },
    { value: "second_language", label: "Segunda Lengua" },
    { value: "peace_education", label: "Educación para la Paz" }
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
          />          <SelectInput
            label="Area"
            name="area_type"
            value={form.area_type}
            options={areaTypes}
            onChange={handleChange}
            required
            error={errors.area_type}
          />
          <SelectInput
            label="Ambiente"
            name="environment_id"
            value={form.environment_id}
            options={environmentOptions}
            onChange={handleChange}
            isLoading={loading}
            required
            error={errors.environment_id}
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
        </div>
      </div>
    </div>
  );
};
