import React, { useState, useEffect } from "react";
import { Modal } from "../../components/molecules/Modal";
import { FormProfile } from "../../components/organisms/FormProfile";
import { getProfileById, updateProfile } from "../../services/profilesService";

export const EditProfile = ({ isOpen, onClose, profileId, onSuccess }) => {
  const [form, setForm] = useState({
    first_name: "",
    second_name: "",
    last_name: "",
    second_last_name: "",
    birth_date: "",
    mobile_phone: "",
    home_address: "",
    role: "",
    user_id: null
  });  
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  // Cargar datos del perfil cuando se abre el modal y tenemos un ID
  useEffect(() => {
    if (isOpen && profileId) {
      loadProfileData();
    }
  }, [isOpen, profileId]);

  const loadProfileData = async () => {
    try {
      setLoadingProfile(true);
      setError("");
      
      const profileData = await getProfileById(profileId);
      
      // Formatear la fecha para el input date
      let formattedDate = profileData.birth_date;
      if (formattedDate && !formattedDate.includes("T")) {
        formattedDate = new Date(formattedDate).toISOString().split("T")[0];
      }
      
      setForm({
        ...profileData,
        birth_date: formattedDate || "",
        mobile_phone: profileData.mobile_phone?.toString() || "",
        second_name: profileData.second_name || "",
        second_last_name: profileData.second_last_name || "",
      });
    } catch (err) {
      console.error("Error loading profile:", err);
      setError("No se pudo cargar la información del perfil");
    } finally {
      setLoadingProfile(false);
    }
  };

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
  
    // Required fields validation with better error messages
    const requiredFields = {
      first_name: "Primer nombre es requerido",
      last_name: "Apellido paterno es requerido",
      birth_date: "Fecha de nacimiento es requerida",
      mobile_phone: "Teléfono móvil es requerido",
      home_address: "Dirección es requerida",
      role: "Rol es requerido"
    };
  
    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!form[field]?.toString().trim()) {
        newErrors[field] = message;
      }
    });
  
    if (form.birth_date) {
      const date = new Date(form.birth_date);
      const today = new Date();
      if (isNaN(date.getTime())) {
        newErrors.birth_date = "Fecha inválida";
      } else if (date > today) {
        newErrors.birth_date = "La fecha no puede ser futura";
      }
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
        mobile_phone: form.mobile_phone.toString().trim(),
        birth_date: form.birth_date,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        second_name: form.second_name?.trim() || null,
        second_last_name: form.second_last_name?.trim() || null,
        home_address: form.home_address.trim(),
        role: form.role.trim(),
        user_id: form.user_id || null
      };
  
      console.log('Sending update data:', formData);
      const response = await updateProfile(profileId, formData);
      console.log('Response:', response);
      
      alert("Perfil actualizado exitosamente");
      
      // Notificar al componente padre y cerrar el modal
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Error updating profile:", err.response?.data);
      
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
        setError("Error al actualizar el perfil. Por favor intente nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Perfil">
      {loadingProfile ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <FormProfile form={form} handleChange={handleChange} errors={errors} />
          
                   
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
