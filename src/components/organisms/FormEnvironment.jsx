import React from "react";
import { InputText } from "../atoms/InputText";
import { SelectInput } from "../atoms/SelectiInput";

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputText
          label="Nombre del Ambiente"
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          error={errors.name}
          required
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

        <InputText
          label="Ubicación"
          name="location"
          value={form.location || ""}
          onChange={handleChange}
          error={errors.location}
          required
        />

        <div className="flex items-center space-x-3 h-full">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active !== false}
              onChange={(e) => handleChange({
                target: {
                  name: "is_active",
                  value: e.target.checked
                }
              })}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span>Ambiente Activo</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
          <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md shadow-sm
            ${errors.description ? 'border-red-500' : 'border-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          required
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* Campos adicionales como relaciones con otras entidades pueden ir aquí */}
    </div>
  );
};