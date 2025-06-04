import React, { useState, useEffect } from "react";
import { Modal } from "../../components/molecules/Modal";
import { FormEnvironment } from "../../components/organisms/FormEnvironment";
import { useSessionAwareRequest } from "../../hooks/useSessionAwareRequest";
import { getEnvironmentById, updateEnvironment } from "../../services/environmentsService";

export const EditEnvironment = ({ isOpen, onClose, environmentId, onSuccess }) => {
  const { safeRequest } = useSessionAwareRequest();
  
  const [form, setForm] = useState({
    title: "",
    environment_type: "",
    environment_status: "active",
    location: "",
    capacity: "",
    availability: "",
    description: "",
    photo_url: "",
    id: "",
    created_at: "",
    updated_at: ""
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (isOpen && environmentId) {
      loadEnvironment();
    }
  }, [isOpen, environmentId]);

  const loadEnvironment = async () => {
    setIsLoading(true);
    setSubmitError("");

    try {
      const data = await safeRequest(
        () => getEnvironmentById(environmentId),
        setSubmitError,
        "Tu sesión ha expirado mientras se cargaba el ambiente. Por favor, inicia sesión nuevamente."
      );

      if (data) {
        setForm({
          title: data.title || "",
          environment_type: data.environment_type || "",
          environment_status: data.environment_status || "active",
          location: data.location || "",
          capacity: data.capacity || "",
          availability: data.availability || "",
          description: data.description || "",
          photo_url: data.photo_url || "",
          id: data.id || "",
          created_at: data.created_at || "",
          updated_at: data.updated_at || ""
        });
      }
    } catch (error) {
      console.error('Error al cargar ambiente:', error);
      setSubmitError(
        error.response?.data?.detail || 
        "Error al cargar el ambiente. Por favor, intenta de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

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
        () => updateEnvironment(environmentId, {
          ...form,
          title: form.title.trim(),
          location: form.location.trim(),
          description: form.description?.trim(),
          capacity: Number(form.capacity),
          environment_type: form.environment_type,
          environment_status: form.environment_status,
          availability: form.availability.trim()
        }),
        setSubmitError,
        "Tu sesión ha expirado mientras se actualizaba el ambiente. Por favor, inicia sesión nuevamente."
      );

      if (result) {
        if (onSuccess) {
          // Asegurarse de que el callback de éxito reciba los datos actualizados
          onSuccess(result);
        }
        onClose();
      }
    } catch (error) {
      console.error('Error al actualizar ambiente:', error);
      setSubmitError(
        error.response?.data?.detail || 
        "Error al actualizar el ambiente. Por favor, intenta de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Ambiente"
    >
      <div className="p-6">
        {submitError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {submitError}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormEnvironment
              form={form}
              handleChange={handleChange}
              errors={errors}
              isEditing={true}
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
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};