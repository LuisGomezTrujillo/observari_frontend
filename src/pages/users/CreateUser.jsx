import React, { useState, useEffect } from "react";
import { Modal } from "../../components/molecules/Modal";
import { FormUser } from "../../components/organisms/FormUser";
import { InputText } from "../../components/atoms/InputText";
import { createUser, getUserById, updateUser } from "../../services/usersService";
import { useAuth } from "../../contexts/AuthContext";

// Componente para crear un usuario en un modal
export const CreateUser = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  // Reset form cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setForm({ email: "", password: "" });
      setError(null);
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setError(null);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Campo requerido";
    if (!form.password) newErrors.password = "Campo requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await createUser(form);
      console.log("Usuario creado:", response.data);
      onClose(); // Cerrar modal después de crear
      if (onSuccess) onSuccess(); // Callback para recargar la lista
    } catch (err) {
      setError("Hubo un error al crear el usuario");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Usuario">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormUser form={form} handleChange={handleChange} />
        
        {Object.values(errors).map((msg, i) => (
          <p key={i} className="text-red-600 text-sm">{msg}</p>
        ))}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear Usuario"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Componente para editar un usuario en un modal
export const EditUserModal = ({ isOpen, onClose, userId, onSuccess }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  // Cargar datos de usuario cuando se abre el modal
  useEffect(() => {
    const loadUserData = async () => {
      if (!userId || !isOpen) return;
      
      try {
        setFetchLoading(true);
        const data = await getUserById(userId);
        setForm({
          email: data.email || "",
          password: "" // No mostramos la contraseña actual por seguridad
        });
        setError(null);
      } catch (err) {
        console.error("Error al obtener el usuario:", err);
        setError("No se pudo cargar la información del usuario");
      } finally {
        setFetchLoading(false);
      }
    };

    loadUserData();
  }, [userId, isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setError(null);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email?.trim()) newErrors.email = "El correo electrónico es requerido";
    // No validamos contraseña en edición para permitir actualizaciones sin cambiar contraseña
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      // Crear objeto con solo los campos que queremos actualizar
      const updateData = {
        email: form.email
      };
      
      // Solo incluir password si se ha ingresado uno nuevo
      if (form.password) {
        updateData.password = form.password;
      }
      
      await updateUser(userId, updateData);
      onClose(); // Cerrar modal después de actualizar
      if (onSuccess) onSuccess(); // Recargar lista
    } catch (err) {
      console.error("Error al actualizar el usuario:", err);
      setError("Error al actualizar el usuario. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Usuario">
      {fetchLoading ? (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <InputText
            label="Correo Electrónico"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          
          <InputText
            label="Contraseña (dejar en blanco para mantener actual)"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
          
          {Object.entries(errors).map(([field, msg]) => (
            <p key={field} className="text-red-600 text-sm">{msg}</p>
          ))}
          
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

// // Usuarios.jsx
// import React, { useState } from "react";
// import { FormUser } from "../../components/organisms/FormUser";
// import { createUser } from "../../services/usersService";

// export const CreateUser = () => {
//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: "" });
//     setError(null);
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!form.email) newErrors.email = "Campo requerido";
//     if (!form.password) newErrors.password = "Campo requerido";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await createUser(form);
//       console.log("Usuario creado:", response.data);
//     } catch (err) {
//       setError("Hubo un error al crear el usuario");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Crear Usuario</h2>
//       <form onSubmit={handleSubmit} noValidate>
//         <FormUser form={form} handleChange={handleChange} />
//         {Object.values(errors).map((msg, i) => (
//           <p key={i} className="text-red-600 text-sm">{msg}</p>
//         ))}
//         {error && <p className="text-red-600 text-sm">{error}</p>}
//         <button
//           type="submit"
//           className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           disabled={loading}
//         >
//           {loading ? "Cargando..." : "Crear Usuario"}
//         </button>
//       </form>
//     </div>
//   );
// };
