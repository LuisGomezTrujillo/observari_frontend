import React, { useState, useEffect } from "react";
import { Modal } from "../../components/molecules/Modal";
import { FormMaterial } from "../../components/organisms/FormMaterial";
import { getMaterialById, updateMaterial } from "../../services/materialsService";

export const EditMaterial = ({ isOpen, onClose, materialId, onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    reference: "",
    description: "",
    status: "",
    area_id: null
  });
  
  const [loading, setLoading] = useState(false);
  const [loadingMaterial, setLoadingMaterial] = useState(true);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadMaterial = async () => {
      if (!isOpen || !materialId) return;
      
      try {
        setLoadingMaterial(true);
        setError("");
        
        const materialData = await getMaterialById(materialId, setError);
        
        setForm({
          title: materialData.title || "",
          reference: materialData.reference || "",
          description: materialData.description || "",
          status: materialData.status || "",
          area_id: materialData.area_id || null
        });
      } catch (err) {
        console.error("Error loading material:", err);
        setError("No se pudo cargar la información del material");
      } finally {
        setLoadingMaterial(false);
      }
    };

    loadMaterial();
  }, [isOpen, materialId]);

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
        title: form.title.trim(),
        reference: form.reference.trim(),
        description: form.description?.trim() || null,
        status: form.status.trim(),
        area_id: parseInt(form.area_id, 10)
      };
  
      console.log('Updating material:', materialId, formData);
      await updateMaterial(materialId, formData, setError);
      
      alert("Material actualizado exitosamente");
      
      // Cerrar modal y notificar éxito
      if (onSuccess) onSuccess();
      onClose();
      
    } catch (err) {
      console.error("Error updating material:", err.response?.data);
      
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
        setError("Error al actualizar el material. Por favor intente nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Material">
      {loadingMaterial ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
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
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
