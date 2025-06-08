import React from "react";
import { InputText } from "../atoms/InputText";
import { SelectInput } from "../atoms/SelectInput";
import { InputNumber } from "../atoms/InputNumber";
import { TextArea } from "../atoms/TextArea"; // Asumiendo que existe este componente

export const FormEnvironment = ({ form, handleChange, errors, isEditing = false }) => {
  const environmentTypes = [
    { value: "nest", label: "Nido" },
    { value: "community", label: "Comunidad de Niños" },
    { value: "house", label: "Casa de Niños" },
    { value: "lower", label: "Taller 1" },
    { value: "upper", label: "Taller 2" },
    { value: "adolescence", label: "Comunidad Adolescentes del Planeta (ErdKinder)" },
    { value: "high", label: "Comunidad Adultos del Planeta" }
  ];

  const environmentStatus = [
    { value: "active", label: "Activo" },
    { value: "inactive", label: "Inactivo" },
    { value: "maintenance", label: "En Mantenimiento" },
    { value: "reserved", label: "Reservado" }
  ];

  return (
    <div className="space-y-6">
      {/* Campos principales requeridos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputText
          label="Nombre del Ambiente"
          name="title"
          value={form.title || ""}
          onChange={handleChange}
          error={errors.title}
          required
          placeholder="Ingrese el nombre del ambiente"
        />

        <SelectInput
          label="Tipo de Ambiente"
          name="environment_type"
          value={form.environment_type || ""}
          onChange={handleChange}
          options={environmentTypes}
          error={errors.environment_type}
          required
        />

        <SelectInput 
          label="Estado del Ambiente"
          name="environment_status"
          value={form.environment_status || "active"}
          onChange={handleChange}
          options={environmentStatus}
          error={errors.environment_status}
          required
        />

        <InputText
          label="Ubicación"
          name="location"
          value={form.location || ""}
          onChange={handleChange}
          error={errors.location}
          required
          placeholder="Ejemplo: Edificio A, Piso 2, Aula 201"
        />

        <InputNumber 
          label="Capacidad"
          name="capacity"
          value={form.capacity || ""}
          onChange={handleChange}
          error={errors.capacity}
          required
          min={0}
          placeholder="Número de estudiantes"
        />

        <InputText
          label="Disponibilidad"
          name="availability"
          value={form.availability || ""}
          onChange={handleChange}
          error={errors.availability}
          required
          placeholder="Ejemplo: Lunes a Viernes 8am-4pm"
        />
      </div>

      {/* Campos opcionales */}
      <div className="space-y-4">
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Información Adicional (Opcional)</h3>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={form.description || ""}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe las características y equipamiento del ambiente..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

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

      {/* Información adicional para edición */}
      {isEditing && form.id && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">ID:</span> {form.id}
            </div>
            {form.created_at && (
              <div>
                <span className="font-medium">Creado:</span> {new Date(form.created_at).toLocaleDateString('es-ES')}
              </div>
            )}
            {form.updated_at && (
              <div>
                <span className="font-medium">Actualizado:</span> {new Date(form.updated_at).toLocaleDateString('es-ES')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};