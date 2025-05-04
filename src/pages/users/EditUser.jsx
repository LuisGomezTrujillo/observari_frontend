import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../../services/usersService";
import { InputText } from "../../components/atoms/InputText";

export const EditUser = () => {
  const { id } = useParams(); // 👈 obtiene el user_id desde la URL
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await getUserById(id);
        setForm(data);
      } catch (err) {
        console.error("Error al obtener el usuario:", err);
        setError("No se pudo cargar el usuario.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadUserData();
    } else {
      setError("ID de usuario no proporcionado");
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email?.trim()) newErrors.email = "El correo electrónico es requerido";
   
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await updateUser(id, form);
      alert("Usuario actualizado correctamente");
      navigate("/users");
    } catch (err) {
      console.error("Error al actualizar el usuario:", err);
      setError("Error al actualizar el usuario. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-4">Cargando...</div>;
  if (error) return <div className="text-red-600 text-center p-4">{error}</div>;
  if (!form) return <div className="text-center p-4">No se encontró el usuario</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Editar Usuario</h2>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <InputText
          label="Correo Electrónico"
          name="email"
          value={form.email}
          onChange={handleChange}
        />

        {/* Errores de validación */}
        {Object.entries(errors).map(([field, msg]) => (
          <p key={field} className="text-red-600 text-sm">{msg}</p>
        ))}

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/users")}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};
