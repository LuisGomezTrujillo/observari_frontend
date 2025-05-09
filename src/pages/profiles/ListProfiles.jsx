import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfiles, deleteProfile } from "../../services/profilesService";
import { getUserById } from "../../services/usersService";
import { useAuth } from "../../contexts/AuthContext";
import { CreateProfile } from "./CreateProfile";
import { EditProfile } from "./EditProfile";
import { ProfileDetails } from "./ProfileDetails";

export const ListProfiles = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [profiles, setProfiles] = useState([]);
  const [profilesWithUsers, setProfilesWithUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 10
  });
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Estados para controlar los modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState(null);

  // Verificar autenticación antes de cargar datos
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    } else if (!authLoading && isAuthenticated) {
      loadProfiles();
    }
  }, [isAuthenticated, authLoading, pagination.skip, pagination.limit]);

  // Efecto para cargar los datos de los usuarios una vez que tenemos los perfiles
  useEffect(() => {
    const fetchUserData = async () => {
      if (!profiles || profiles.length === 0) return;

      try {
        const profilesWithUserData = [...profiles];
        
        // Obtener los datos de usuario para cada perfil
        for (let i = 0; i < profilesWithUserData.length; i++) {
          const profile = profilesWithUserData[i];
          
          if (profile.user_id) {
            try {
              const userData = await getUserById(profile.user_id);
              profilesWithUserData[i] = {
                ...profile,
                user_email: userData.email || "N/A"
              };
            } catch (err) {
              console.error(`Error al obtener datos del usuario ${profile.user_id}:`, err);
              profilesWithUserData[i] = {
                ...profile,
                user_email: "Error al cargar"
              };
            }
          } else {
            profilesWithUserData[i] = {
              ...profile,
              user_email: "No asignado"
            };
          }
        }
        
        setProfilesWithUsers(profilesWithUserData);
      } catch (err) {
        console.error("Error al procesar perfiles con usuarios:", err);
        setError("Error al cargar información de usuarios");
      }
    };

    fetchUserData();
  }, [profiles]);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      setError(null); // Limpiar errores anteriores
      
      const data = await getProfiles(pagination.skip, pagination.limit);
      
      // Asegurarse de que la respuesta sea un array
      if (Array.isArray(data)) {
        setProfiles(data);
      } else if (data && typeof data === 'object' && Array.isArray(data.profiles)) {
        // En caso de que la API devuelva un objeto con una propiedad 'profiles'
        setProfiles(data.profiles);
      } else {
        setProfiles([]);
        setError("Formato de respuesta inesperado al cargar perfiles");
      }
    } catch (err) {
      console.error("Error fetching profiles:", err);
      
      // Verificar si el error es de autenticación
      if (err.response && err.response.status === 401) {
        setError("Sesión expirada o no autorizada. Por favor inicie sesión nuevamente.");
        // Redirigir al login después de un breve retraso
        setTimeout(() => navigate("/login"), 2000);
      } else if (err.response) {
        setError(`Error al cargar los perfiles: ${err.response.data?.message || "Error en el servidor"}`);
      } else if (err.request) {
        setError("No se pudo conectar con el servidor. Verifique su conexión a internet.");
      } else {
        setError("Error al preparar la solicitud. Por favor intente nuevamente.");
      }
      
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (profileId) => {
    if (!profileId) {
      console.error("ID de perfil inválido:", profileId);
      alert("Error: El ID de perfil es inválido");
      return;
    }
    
    // Abrir el modal de detalles
    setSelectedProfileId(profileId);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (profileId) => {
    if (!profileId) {
      console.error("ID de perfil inválido:", profileId);
      alert("Error: El ID de perfil es inválido");
      return;
    }
    
    // Abrir el modal de edición
    setSelectedProfileId(profileId);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error("ID de perfil inválido para eliminar:", id);
      alert("Error: El ID de perfil es inválido");
      return;
    }
    
    if (window.confirm("¿Está seguro de eliminar este perfil?")) {
      try {
        setIsDeleting(true);
        setError(null);
        
        await deleteProfile(id);
        
        // Mostrar mensaje de éxito
        alert("Perfil eliminado correctamente");
        
        // Recargar perfiles después de eliminar
        loadProfiles();
      } catch (err) {
        console.error("Error deleting profile:", err);
        
        // Verificar si el error es de autenticación
        if (err.response && err.response.status === 401) {
          setError("Sesión expirada o no autorizada. Por favor inicie sesión nuevamente.");
          setTimeout(() => navigate("/login"), 2000);
        } else if (err.response && err.response.status === 404) {
          alert("El perfil ya no existe o fue eliminado previamente.");
          loadProfiles(); // Actualizar la lista de todos modos
        } else if (err.response) {
          setError(`Error al eliminar: ${err.response.data?.message || "Error en el servidor"}`);
        } else if (err.request) {
          setError("No se pudo conectar con el servidor. Verifique su conexión a internet.");
        } else {
          setError("Error al preparar la solicitud. Por favor intente nuevamente.");
        }
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Manejadores para la paginación
  const handleNextPage = () => {
    if (profiles.length >= pagination.limit) {
      setPagination(prev => ({
        ...prev,
        skip: prev.skip + prev.limit
      }));
    }
  };

  const handlePreviousPage = () => {
    setPagination(prev => ({
      ...prev,
      skip: Math.max(0, prev.skip - prev.limit)
    }));
  };

  // Manejadores para los modales
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProfileId(null);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedProfileId(null);
  };

  const handleProfileCreated = () => {
    // Recargar perfiles después de crear uno nuevo
    loadProfiles();
  };

  const handleProfileUpdated = () => {
    // Recargar perfiles después de actualizar uno existente
    loadProfiles();
  };

  // Si todavía está verificando la autenticación, muestra un indicador de carga
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lista de Perfiles</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={handleOpenCreateModal}
        >
          Crear Perfil
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correo Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Apellido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {profilesWithUsers && profilesWithUsers.length > 0 ? (
                  profilesWithUsers.map((profile) => (
                    <tr key={profile.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {profile.user_email || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {profile.first_name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {profile.last_name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {profile.role || "Usuario"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(profile.id)}
                          className="text-blue-600 hover:text-blue-900"
                          disabled={isDeleting}
                        >
                          Detalles
                        </button>
                        <button
                          onClick={() => handleEdit(profile.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                          disabled={isDeleting}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(profile.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Eliminando..." : "Eliminar"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No hay perfiles para mostrar
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={pagination.skip === 0}
              className={`px-4 py-2 rounded ${
                pagination.skip === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Anterior
            </button>
            <button
              onClick={handleNextPage}
              disabled={profiles.length < pagination.limit}
              className={`px-4 py-2 rounded ${
                profiles.length < pagination.limit
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {/* Modal para crear perfil */}
      <CreateProfile 
        isOpen={isCreateModalOpen} 
        onClose={handleCloseCreateModal} 
        onSuccess={handleProfileCreated} 
      />

      {/* Modal para editar perfil */}
      <EditProfile 
        isOpen={isEditModalOpen} 
        onClose={handleCloseEditModal} 
        profileId={selectedProfileId} 
        onSuccess={handleProfileUpdated}
      />

      {/* Modal para ver detalles del perfil */}
      <ProfileDetails
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        profileId={selectedProfileId}
      />
    </div>
  );
};

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getProfiles, deleteProfile } from "../../services/profilesService";
// import { getUserById } from "../../services/usersService";
// import { useAuth } from "../../contexts/AuthContext";
// import { CreateProfile } from "./CreateProfile";
// import { EditProfile } from "./EditProfile";

// export const ListProfiles = () => {
//   const navigate = useNavigate();
//   const { isAuthenticated, isLoading: authLoading } = useAuth();
  
//   const [profiles, setProfiles] = useState([]);
//   const [profilesWithUsers, setProfilesWithUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [pagination, setPagination] = useState({
//     skip: 0,
//     limit: 10
//   });
//   const [isDeleting, setIsDeleting] = useState(false);
  
//   // Estados para controlar los modales
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [selectedProfileId, setSelectedProfileId] = useState(null);

//   // Verificar autenticación antes de cargar datos
//   useEffect(() => {
//     if (!authLoading && !isAuthenticated) {
//       navigate("/login");
//     } else if (!authLoading && isAuthenticated) {
//       loadProfiles();
//     }
//   }, [isAuthenticated, authLoading, pagination.skip, pagination.limit]);

//   // Efecto para cargar los datos de los usuarios una vez que tenemos los perfiles
//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (!profiles || profiles.length === 0) return;

//       try {
//         const profilesWithUserData = [...profiles];
        
//         // Obtener los datos de usuario para cada perfil
//         for (let i = 0; i < profilesWithUserData.length; i++) {
//           const profile = profilesWithUserData[i];
          
//           if (profile.user_id) {
//             try {
//               const userData = await getUserById(profile.user_id);
//               profilesWithUserData[i] = {
//                 ...profile,
//                 user_email: userData.email || "N/A"
//               };
//             } catch (err) {
//               console.error(`Error al obtener datos del usuario ${profile.user_id}:`, err);
//               profilesWithUserData[i] = {
//                 ...profile,
//                 user_email: "Error al cargar"
//               };
//             }
//           } else {
//             profilesWithUserData[i] = {
//               ...profile,
//               user_email: "No asignado"
//             };
//           }
//         }
        
//         setProfilesWithUsers(profilesWithUserData);
//       } catch (err) {
//         console.error("Error al procesar perfiles con usuarios:", err);
//         setError("Error al cargar información de usuarios");
//       }
//     };

//     fetchUserData();
//   }, [profiles]);

//   const loadProfiles = async () => {
//     try {
//       setLoading(true);
//       setError(null); // Limpiar errores anteriores
      
//       const data = await getProfiles(pagination.skip, pagination.limit);
      
//       // Asegurarse de que la respuesta sea un array
//       if (Array.isArray(data)) {
//         setProfiles(data);
//       } else if (data && typeof data === 'object' && Array.isArray(data.profiles)) {
//         // En caso de que la API devuelva un objeto con una propiedad 'profiles'
//         setProfiles(data.profiles);
//       } else {
//         setProfiles([]);
//         setError("Formato de respuesta inesperado al cargar perfiles");
//       }
//     } catch (err) {
//       console.error("Error fetching profiles:", err);
      
//       // Verificar si el error es de autenticación
//       if (err.response && err.response.status === 401) {
//         setError("Sesión expirada o no autorizada. Por favor inicie sesión nuevamente.");
//         // Redirigir al login después de un breve retraso
//         setTimeout(() => navigate("/login"), 2000);
//       } else if (err.response) {
//         setError(`Error al cargar los perfiles: ${err.response.data?.message || "Error en el servidor"}`);
//       } else if (err.request) {
//         setError("No se pudo conectar con el servidor. Verifique su conexión a internet.");
//       } else {
//         setError("Error al preparar la solicitud. Por favor intente nuevamente.");
//       }
      
//       setProfiles([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (profileId) => {
//     if (!profileId) {
//       console.error("ID de perfil inválido:", profileId);
//       alert("Error: El ID de perfil es inválido");
//       return;
//     }
    
//     // Abrir el modal de edición
//     setSelectedProfileId(profileId);
//     setIsEditModalOpen(true);
//   };

//   const handleDelete = async (id) => {
//     if (!id) {
//       console.error("ID de perfil inválido para eliminar:", id);
//       alert("Error: El ID de perfil es inválido");
//       return;
//     }
    
//     if (window.confirm("¿Está seguro de eliminar este perfil?")) {
//       try {
//         setIsDeleting(true);
//         setError(null);
        
//         await deleteProfile(id);
        
//         // Mostrar mensaje de éxito
//         alert("Perfil eliminado correctamente");
        
//         // Recargar perfiles después de eliminar
//         loadProfiles();
//       } catch (err) {
//         console.error("Error deleting profile:", err);
        
//         // Verificar si el error es de autenticación
//         if (err.response && err.response.status === 401) {
//           setError("Sesión expirada o no autorizada. Por favor inicie sesión nuevamente.");
//           setTimeout(() => navigate("/login"), 2000);
//         } else if (err.response && err.response.status === 404) {
//           alert("El perfil ya no existe o fue eliminado previamente.");
//           loadProfiles(); // Actualizar la lista de todos modos
//         } else if (err.response) {
//           setError(`Error al eliminar: ${err.response.data?.message || "Error en el servidor"}`);
//         } else if (err.request) {
//           setError("No se pudo conectar con el servidor. Verifique su conexión a internet.");
//         } else {
//           setError("Error al preparar la solicitud. Por favor intente nuevamente.");
//         }
//       } finally {
//         setIsDeleting(false);
//       }
//     }
//   };

//   // Manejadores para la paginación
//   const handleNextPage = () => {
//     if (profiles.length >= pagination.limit) {
//       setPagination(prev => ({
//         ...prev,
//         skip: prev.skip + prev.limit
//       }));
//     }
//   };

//   const handlePreviousPage = () => {
//     setPagination(prev => ({
//       ...prev,
//       skip: Math.max(0, prev.skip - prev.limit)
//     }));
//   };

//   // Manejadores para los modales
//   const handleOpenCreateModal = () => {
//     setIsCreateModalOpen(true);
//   };

//   const handleCloseCreateModal = () => {
//     setIsCreateModalOpen(false);
//   };

//   const handleCloseEditModal = () => {
//     setIsEditModalOpen(false);
//     setSelectedProfileId(null);
//   };

//   const handleProfileCreated = () => {
//     // Recargar perfiles después de crear uno nuevo
//     loadProfiles();
//   };

//   const handleProfileUpdated = () => {
//     // Recargar perfiles después de actualizar uno existente
//     loadProfiles();
//   };

//   // Si todavía está verificando la autenticación, muestra un indicador de carga
//   if (authLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Lista de Perfiles</h1>
//         <button
//           className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//           onClick={handleOpenCreateModal}
//         >
//           Crear Perfil
//         </button>
//       </div>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {loading ? (
//         <div className="flex justify-center">
//           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
//         </div>
//       ) : (
//         <>
//           <div className="bg-white shadow-md rounded-lg overflow-hidden">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Correo Usuario
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Nombre
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Apellido
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Rol
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Acciones
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {profilesWithUsers && profilesWithUsers.length > 0 ? (
//                   profilesWithUsers.map((profile) => (
//                     <tr key={profile.id}>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {profile.user_email || "N/A"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {profile.first_name || "N/A"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {profile.last_name || "N/A"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {profile.role || "Usuario"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-4">
//                         <button
//                           onClick={() => handleEdit(profile.id)}
//                           className="text-indigo-600 hover:text-indigo-900"
//                           disabled={isDeleting}
//                         >
//                           Editar
//                         </button>
//                         <button
//                           onClick={() => handleDelete(profile.id)}
//                           className="text-red-600 hover:text-red-900"
//                           disabled={isDeleting}
//                         >
//                           {isDeleting ? "Eliminando..." : "Eliminar"}
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
//                       No hay perfiles para mostrar
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <div className="flex justify-between mt-4">
//             <button
//               onClick={handlePreviousPage}
//               disabled={pagination.skip === 0}
//               className={`px-4 py-2 rounded ${
//                 pagination.skip === 0
//                   ? "bg-gray-300 cursor-not-allowed"
//                   : "bg-blue-600 text-white hover:bg-blue-700"
//               }`}
//             >
//               Anterior
//             </button>
//             <button
//               onClick={handleNextPage}
//               disabled={profiles.length < pagination.limit}
//               className={`px-4 py-2 rounded ${
//                 profiles.length < pagination.limit
//                   ? "bg-gray-300 cursor-not-allowed"
//                   : "bg-blue-600 text-white hover:bg-blue-700"
//               }`}
//             >
//               Siguiente
//             </button>
//           </div>
//         </>
//       )}

//       {/* Modal para crear perfil */}
//       <CreateProfile 
//         isOpen={isCreateModalOpen} 
//         onClose={handleCloseCreateModal} 
//         onSuccess={handleProfileCreated} 
//       />

//       {/* Modal para editar perfil */}
//       <EditProfile 
//         isOpen={isEditModalOpen} 
//         onClose={handleCloseEditModal} 
//         profileId={selectedProfileId} 
//         onSuccess={handleProfileUpdated}
//       />
//     </div>
//   );
// };

