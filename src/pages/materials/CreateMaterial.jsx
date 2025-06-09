import React from "react";
import { Modal } from "../../components/molecules/Modal";
import { FormMaterial } from "../../components/organisms/FormMaterial";
import { createMaterial } from "../../services/materialsService";

export const CreateMaterial = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = React.useState({
    title: "",
    reference: "",
    description: "",
    status: "",
    area_id: null
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
    
    // Validar referencia
    if (!form.reference?.trim()) {
      newErrors.reference = "La referencia es requerida";
    }
    
    // Validar estado
    if (!form.status?.trim()) {
      newErrors.status = "El estado es requerido";
    }
    
    // Validar ID del área
    if (!form.area_id) {
      newErrors.area_id = "El área es requerida";
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
  
    try {      
      const formData = {
        ...form,
        title: form.title.trim(),
        reference: form.reference.trim(),
        description: form.description?.trim() || null,
        status: form.status.trim(),
        area_id: parseInt(form.area_id, 10)
      };
  
      console.log('Creando material:', formData);
      await createMaterial(formData, setError);
      
      alert("Material creado exitosamente");
      
      // Resetear el formulario
      setForm({
        title: "",
        reference: "",
        description: "",
        status: "",
        area_id: null
      });
      
      // Cerrar modal y notificar éxito
      if (onSuccess) onSuccess();
      onClose();
      
    } catch (err) {
      console.error("Error creating material:", err.response?.data);
      
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
        setError("Error al crear el material. Por favor intente nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Material">
      <form onSubmit={handleSubmit} noValidate>
        <FormMaterial form={form} handleChange={handleChange} errors={errors} />
        
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
            {loading ? "Cargando..." : "Crear Material"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
