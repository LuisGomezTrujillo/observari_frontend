import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FormProfile } from "../../components/organisms/FormProfile";
import { getProfileById, updateProfile } from "../../api/profilesService";

export const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadProfile = async () => {
      if (!id) {
        setError("ID de perfil no proporcionado");
        setLoading(false);
        return;
      }

      try {
        const data = await getProfileById(id);
        setForm(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar el perfil:", err);
        setError("Error al cargar el perfil. Por favor intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ""
    }));
  };

  const validate = () => {
    const newErrors = {};
    const requiredFields = {
      first_name: "Primer nombre es requerido",
      last_name: "Apellido paterno es requerido",
      birth_date: "Fecha de nacimiento es requerida",
      mobile_phone: "Teléfono móvil es requerido",
      home_address: "Dirección es requerida",
      role: "Rol es requerido",
      user_id: "Usuario es requerido"
    };

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!form[field]?.toString().trim()) {
        newErrors[field] = message;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await updateProfile(id, form);
      alert("Perfil actualizado correctamente");
      navigate("/profiles");
    } catch (err) {
      console.error("Error al actualizar el perfil:", err);
      setError("Error al actualizar el perfil. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-4">Cargando...</div>;
  if (error) return <div className="text-red-600 text-center p-4">{error}</div>;
  if (!form) return <div className="text-center p-4">No se encontró el perfil</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Editar Perfil</h2>
      <form onSubmit={handleSubmit} noValidate>
        <FormProfile 
          form={form} 
          handleChange={handleChange}
        />
        
        {Object.entries(errors).map(([field, message]) => (
          <p key={field} className="text-red-600 text-sm mt-1">
            {message}
          </p>
        ))}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded mt-4">
            {error}
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate("/profiles")}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Actualizando..." : "Actualizar Perfil"}
          </button>
        </div>
      </form>
    </div>
  );
};
