import React, { useState, useEffect } from "react";
import { createRelationship, getRelationshipTypeOptions } from "../../services/relationshipsService";
import { getProfiles } from "../../services/profilesService";
import { Modal } from "../../components/molecules/Modal";

export const CreateRelationship = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    user_id: "",
    related_user_id: "",
    relationship_type: "",
    description: ""
  });
  
  const [profiles, setProfiles] = useState([]);
  const [relationshipTypes, setRelationshipTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  // Cargar perfiles para los selectores
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const profilesData = await getProfiles(0, 1000); // Cargar todos los perfiles disponibles
        if (Array.isArray(profilesData)) {
          setProfiles(profilesData);
        } else if (profilesData && Array.isArray(profilesData.profiles)) {
          setProfiles(profilesData.profiles);
        }
      } catch (err) {
        console.error("Error al cargar perfiles:", err);
        setError("No se pudieron cargar los perfiles de usuarios");
      }
    };

    if (isOpen) {
      loadProfiles();
      setRelationshipTypes(getRelationshipTypeOptions());
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      user_id: "",
      related_user_id: "",
      relationship_type: "",
      description: ""
    });
    setError(null);
    setSuccessMsg("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg("");

    try {
      // Validar que no sean el mismo usuario
      if (formData.user_id === formData.related_user_id) {
        setError("No se puede crear una relación con el mismo usuario");
        setLoading(false);
        return;
      }

      // Validar campos obligatorios
      if (!formData.user_id || !formData.related_user_id || !formData.relationship_type) {
        setError("Los campos de usuarios y tipo de relación son obligatorios");
        setLoading(false);
        return;
      }

      // Convertir los IDs a números para la API
      const dataToSend = {
        ...formData,
        user_id: parseInt(formData.user_id, 10),
        related_user_id: parseInt(formData.related_user_id, 10)
      };

      await createRelationship(dataToSend);
      setSuccessMsg("Relación creada correctamente");
      
      // Esperar un momento antes de cerrar el modal
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error al crear relación:", err);
      if (err.response) {
        setError(err.response.data?.message || "Error al crear la relación");
      } else {
        setError("No se pudo conectar con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nueva Relación">
      <form onSubmit={handleSubmit}>
        {/* Mensaje de error */}
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {/* Mensaje de éxito */}
        {successMsg && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMsg}
          </div>
        )}
        
        {/* Usuario origen */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Usuario Origen *
          </label>
          <select
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Seleccione un usuario</option>
            {profiles.map(profile => (
              <option key={`origin-${profile.id}`} value={profile.user_id}>
                {profile.first_name} {profile.last_name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Usuario destino */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Usuario Destino *
          </label>
          <select
            name="related_user_id"
            value={formData.related_user_id}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Seleccione un usuario</option>
            {profiles
              .filter(profile => profile.user_id !== formData.user_id) // Excluir el usuario origen
              .map(profile => (
                <option key={`dest-${profile.id}`} value={profile.user_id}>
                  {profile.first_name} {profile.last_name}
                </option>
              ))}
          </select>
        </div>
        
        {/* Tipo de relación */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tipo de Relación *
          </label>
          <select
            name="relationship_type"
            value={formData.relationship_type}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Seleccione un tipo</option>
            {relationshipTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Descripción */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="3"
            placeholder="Descripción opcional de la relación"
          />
        </div>
        
        {/* Botones */}
        <div className="flex items-center justify-end pt-2 border-t">
          <button
            type="button"
            onClick={onClose}
            className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// import React, { useState, useEffect } from "react";
// import { createRelationship, getRelationshipTypeOptions } from "../../services/relationshipsService";
// import { getProfiles } from "../../services/profilesService";

// export const CreateRelationship = ({ isOpen, onClose, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     user_id: "",
//     related_user_id: "",
//     relationship_type: "",
//     description: ""
//   });
  
//   const [profiles, setProfiles] = useState([]);
//   const [relationshipTypes, setRelationshipTypes] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMsg, setSuccessMsg] = useState("");

//   // Cargar perfiles para los selectores
//   useEffect(() => {
//     const loadProfiles = async () => {
//       try {
//         const profilesData = await getProfiles(0, 1000); // Cargar todos los perfiles disponibles
//         if (Array.isArray(profilesData)) {
//           setProfiles(profilesData);
//         } else if (profilesData && Array.isArray(profilesData.profiles)) {
//           setProfiles(profilesData.profiles);
//         }
//       } catch (err) {
//         console.error("Error al cargar perfiles:", err);
//         setError("No se pudieron cargar los perfiles de usuarios");
//       }
//     };

//     if (isOpen) {
//       loadProfiles();
//       setRelationshipTypes(getRelationshipTypeOptions());
//       resetForm();
//     }
//   }, [isOpen]);

//   const resetForm = () => {
//     setFormData({
//       user_id: "",
//       related_user_id: "",
//       relationship_type: "",
//       description: ""
//     });
//     setError(null);
//     setSuccessMsg("");
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccessMsg("");

//     try {
//       // Validar que no sean el mismo usuario
//       if (formData.user_id === formData.related_user_id) {
//         setError("No se puede crear una relación con el mismo usuario");
//         setLoading(false);
//         return;
//       }

//       // Validar campos obligatorios
//       if (!formData.user_id || !formData.related_user_id || !formData.relationship_type) {
//         setError("Los campos de usuarios y tipo de relación son obligatorios");
//         setLoading(false);
//         return;
//       }

//       // Convertir los IDs a números para la API
//       const dataToSend = {
//         ...formData,
//         user_id: parseInt(formData.user_id, 10),
//         related_user_id: parseInt(formData.related_user_id, 10)
//       };

//       await createRelationship(dataToSend);
//       setSuccessMsg("Relación creada correctamente");
      
//       // Esperar un momento antes de cerrar el modal
//       setTimeout(() => {
//         onSuccess();
//         onClose();
//       }, 1500);
//     } catch (err) {
//       console.error("Error al crear relación:", err);
//       if (err.response) {
//         setError(err.response.data?.message || "Error al crear la relación");
//       } else {
//         setError("No se pudo conectar con el servidor");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
//         <div className="px-6 py-4 border-b">
//           <h3 className="text-lg font-semibold text-gray-900">Crear Nueva Relación</h3>
//         </div>
        
//         <form onSubmit={handleSubmit} className="px-6 py-4">
//           {/* Mensaje de error */}
//           {error && (
//             <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//               {error}
//             </div>
//           )}
          
//           {/* Mensaje de éxito */}
//           {successMsg && (
//             <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
//               {successMsg}
//             </div>
//           )}
          
//           {/* Usuario origen */}
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">
//               Usuario Origen *
//             </label>
//             <select
//               name="user_id"
//               value={formData.user_id}
//               onChange={handleChange}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               required
//             >
//               <option value="">Seleccione un usuario</option>
//               {profiles.map(profile => (
//                 <option key={`origin-${profile.id}`} value={profile.user_id}>
//                   {profile.first_name} {profile.last_name}
//                 </option>
//               ))}
//             </select>
//           </div>
          
//           {/* Usuario destino */}
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">
//               Usuario Destino *
//             </label>
//             <select
//               name="related_user_id"
//               value={formData.related_user_id}
//               onChange={handleChange}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               required
//             >
//               <option value="">Seleccione un usuario</option>
//               {profiles
//                 .filter(profile => profile.user_id !== formData.user_id) // Excluir el usuario origen
//                 .map(profile => (
//                   <option key={`dest-${profile.id}`} value={profile.user_id}>
//                     {profile.first_name} {profile.last_name}
//                   </option>
//                 ))}
//             </select>
//           </div>
          
//           {/* Tipo de relación */}
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">
//               Tipo de Relación *
//             </label>
//             <select
//               name="relationship_type"
//               value={formData.relationship_type}
//               onChange={handleChange}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               required
//             >
//               <option value="">Seleccione un tipo</option>
//               {relationshipTypes.map(type => (
//                 <option key={type.value} value={type.value}>
//                   {type.label}
//                 </option>
//               ))}
//             </select>
//           </div>
          
//           {/* Descripción */}
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">
//               Descripción
//             </label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               rows="3"
//               placeholder="Descripción opcional de la relación"
//             />
//           </div>
          
//           {/* Botones */}
//           <div className="flex items-center justify-end pt-2 border-t">
//             <button
//               type="button"
//               onClick={onClose}
//               className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
//               disabled={loading}
//             >
//               Cancelar
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               disabled={loading}
//             >
//               {loading ? "Guardando..." : "Guardar"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };