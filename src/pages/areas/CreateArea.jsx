import React from "react";
import { Modal } from "../../components/molecules/Modal";
import { FormArea } from "../../components/organisms/FormArea";
import { createArea } from "../../services/areasService";

export const CreateArea = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    area_type: "",
    environment_id: null
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [errors, setErrors] = React.useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value || ""
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ""
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    // Validar título
    if (!form.title?.trim()) {
      newErrors.title = "El título es requerido";
    }
    
    // Validar tipo de área
    if (!form.area_type?.trim()) {
      newErrors.area_type = "El tipo de área es requerido";
    }
    
    // Validar ID de ambiente
    if (!form.environment_id) {
      newErrors.environment_id = "El ambiente es requerido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setError("");
    setErrors({});
  
    try {      const formData = {
        ...form,
        title: form.title.trim(),
        description: form.description?.trim() || null,
        area_type: form.area_type.trim(),
        environment_id: parseInt(form.environment_id, 10)
      };
  
      console.log('Sending data:', formData);
      await createArea(formData, setError);
      
      alert("Área creada exitosamente");
      
      // Resetear el formulario
      setForm({
        title: "",
        description: "",
        area_type: "",
        environment_id: null
      });
      
      // Cerrar modal y notificar éxito
      if (onSuccess) onSuccess();
      onClose();
      
    } catch (err) {
      console.error("Error creating area:", err.response?.data);
      
      const errorData = err.response?.data;
      
      if (errorData?.detail) {
        if (Array.isArray(errorData.detail)) {
          // Handle FastAPI validation errors array
          const validationErrors = {};
          errorData.detail.forEach(error => {
            const field = error.loc[error.loc.length - 1];
            validationErrors[field] = error.msg;
          });
          setErrors(validationErrors);
        } else {
          // Handle single error message
          setError(errorData.detail);
        }
      } else if (typeof errorData === 'object') {
        // Handle field-specific errors
        setErrors(errorData);
      } else {
        setError("Error al crear el área. Por favor intente nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Área">
      <form onSubmit={handleSubmit} noValidate>
        <FormArea form={form} handleChange={handleChange} errors={errors} />
        
        {/* Display general error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded mt-4">
            {error}
          </div>
        )}
        
        <div className="flex justify-end mt-6 space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded shadow-sm text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Crear Área"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
