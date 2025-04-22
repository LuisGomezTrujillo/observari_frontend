import React, { useState } from "react";
import { FormProfile } from "../../components/organisms/FormProfile";
import { createProfile } from "../../api/profilesService";

export const CreateProfile = () => {
  const [form, setForm] = useState({
    first_name: "",
    second_name: "",
    last_name: "",
    second_last_name: "",
    birth_date: "",
    mobile_phone: "",
    home_address: "",
    role: "",
    user_id: null // Add this if required by your API
  });  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");  // Changed from null to empty string
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value || "" // Ensure value is never undefined
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
  
    // Format validations
    if (form.mobile_phone && !/^\d{10}$/.test(form.mobile_phone)) {
      newErrors.mobile_phone = "El teléfono debe tener 10 dígitos";
    }
  
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
        birth_date: form.birth_date, // Send date as is, FastAPI will validate
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        second_name: form.second_name?.trim() || null, // Use null instead of empty string
        second_last_name: form.second_last_name?.trim() || null,
        home_address: form.home_address.trim(),
        role: form.role.trim(),
        user_id: form.user_id || null
      };
  
      console.log('Sending data:', formData); // Debug log
      const response = await createProfile(formData);
      console.log('Response:', response); // Debug log
      
      alert("Perfil creado exitosamente");
    } catch (err) {
      console.error("Error creating profile:", err.response?.data);
      
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
        setError("Error al crear el perfil. Por favor intente nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Update the error display in the return statement
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Registrar Perfil</h2>
      <form onSubmit={handleSubmit} noValidate>
        <FormProfile form={form} handleChange={handleChange} errors={errors} />
        
        {/* Display field-specific errors */}
        {Object.entries(errors).map(([field, msg]) => (
          <p key={field} className="text-red-600 text-sm">
            {`${field}: ${msg}`}
          </p>
        ))}
        
        {/* Display general error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded mt-4">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Crear Perfil"}
        </button>
      </form>
    </div>
    );
  };