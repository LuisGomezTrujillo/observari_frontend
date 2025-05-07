import React, { useEffect, useState } from "react";
import { getUserById, updateUser } from "../../services/usersService";
import { InputText } from "../../components/atoms/InputText";
import { Modal } from "../../components/molecules/Modal";

export const EditUser = ({ isOpen, onClose, userId, onSuccess }) => {
  // Solo incluiremos el email, ya que el backend parece no aceptar el campo "role"
  const [form, setForm] = useState({ email: "" });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Si el modal está cerrado, limpiamos el estado
    if (!isOpen) {
      setForm({ email: "" });
      setError(null);
      setErrors({});
      setLoading(false);
      setSubmitting(false);
      return;
    }

    // Si el modal está abierto pero no hay userId, mostramos error
    if (isOpen && !userId) {
      setError("No se proporcionó un ID de usuario para editar");
      setLoading(false);
      return;
    }

    // Si el modal está abierto y hay userId, cargamos los datos
    if (isOpen && userId) {
      const loadUserData = async () => {
        try {
          setLoading(true);
          setError(null);
          
          console.log("Cargando datos del usuario ID:", userId);
          const data = await getUserById(userId);
          
          console.log("Datos del usuario recibidos:", data);
          if (data && typeof data === 'object') {
            // Solo mantenemos el email, ya que es lo que sabemos que acepta el backend
            setForm({
              email: data.email || ""
            });
          } else {
            throw new Error("Formato de respuesta inválido");
          }
        } catch (err) {
          console.error("Error al obtener el usuario:", err);
          
          if (err.response) {
            if (err.response.status === 404) {
              setError(`Usuario con ID ${userId} no encontrado. Por favor, actualice la lista de usuarios.`);
            } else if (err.response.status === 401) {
              setError("Sesión expirada. Por favor inicie sesión nuevamente.");
            } else {
              const errorMsg = err.response.data?.detail || "Error desconocido";
              setError(`Error al cargar el usuario: ${errorMsg}`);
            }
          } else if (err.request) {
            setError("No se pudo conectar con el servidor. Verifique su conexión a internet.");
          } else {
            setError(`Error de aplicación: ${err.message}`);
          }
        } finally {
          setLoading(false);
        }
      };

      loadUserData();
    }
  }, [isOpen, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpiar error específico del campo
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Validación del email
    if (!form.email?.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Formato de correo electrónico inválido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar el formulario antes de enviar
    if (!validate()) return;

    try {
      setSubmitting(true);
      setError(null);
      
      console.log("Actualizando usuario:", userId, form);
      // Enviamos solo el email al backend
      await updateUser(userId, { email: form.email });
      
      // Mostrar mensaje de éxito
      alert("Usuario actualizado correctamente");
      
      // Llamar a la función de éxito para refrescar la lista
      if (onSuccess) onSuccess();
      
      // Cerrar el modal
      onClose();
    } catch (err) {
      console.error("Error al actualizar el usuario:", err);
      
      if (err.response) {
        if (err.response.status === 404) {
          setError("El usuario ya no existe o fue eliminado previamente.");
        } else if (err.response.status === 401) {
          setError("Sesión expirada. Por favor inicie sesión nuevamente.");
        } else {
          const errorMsg = err.response.data?.detail || "Error desconocido";
          setError(`Error al actualizar: ${errorMsg}`);
        }
      } else if (err.request) {
        setError("No se pudo conectar con el servidor. Verifique su conexión a internet.");
      } else {
        setError(`Error de aplicación: ${err.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Usuario">
      {loading && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Cargando datos...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!loading && !error && (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <InputText
            label="Correo Electrónico"
            name="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            disabled={submitting}
          />

          {/* Eliminamos el selector de rol ya que el backend no lo acepta */}

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
