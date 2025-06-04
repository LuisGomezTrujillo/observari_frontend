import React, { useState } from "react";
import { Modal } from "../../components/molecules/Modal";
import { FormEnvironment } from "../../components/organisms/FormEnvironment";
import { useSessionAwareRequest } from "../../hooks/useSessionAwareRequest";
import { createEnvironment } from "../../services/environmentsService";

export const CreateEnvironment = ({ isOpen, onClose, onSuccess }) => {
  const { safeRequest } = useSessionAwareRequest();
  
  const [form, setForm] = useState({
    title: "",
    environment_type: "",
    environment_status: "active",
    location: "",
    capacity: "",
    availability: "",
    description: "",
    photo_url: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar errores al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    setSubmitError("");
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.title?.trim()) {
      newErrors.title = "El nombre del ambiente es requerido";
    }
    
    if (!form.environment_type) {
      newErrors.environment_type = "El tipo de ambiente es requerido";
    }
    
    if (!form.location?.trim()) {
      newErrors.location = "La ubicación es requerida";
    }
    
    if (!form.capacity) {
      newErrors.capacity = "La capacidad es requerida";
    }

    if (!form.availability?.trim()) {
      newErrors.availability = "La disponibilidad es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const result = await safeRequest(
        () => createEnvironment({
          ...form,
          title: form.title.trim(),
          location: form.location.trim(),
          description: form.description?.trim(),
          capacity: Number(form.capacity)
        }),
        setSubmitError,
        "Tu sesión ha expirado mientras se creaba el ambiente. Por favor, inicia sesión nuevamente."
      );

      if (result) {
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      }
    } catch (error) {
      console.error('Error al crear ambiente:', error);
      setSubmitError(
        error.response?.data?.detail || 
        "Error al crear el ambiente. Por favor, intenta de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Nuevo Ambiente"
    >
      <div className="p-6">
        {submitError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormEnvironment
            form={form}
            handleChange={handleChange}
            errors={errors}
          />

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                isSubmitting 
                  ? "bg-blue-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Creando..." : "Crear Ambiente"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};