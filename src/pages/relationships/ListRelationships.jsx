import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getRelationships, 
  deleteRelationship, 
  getRelationshipTypeLabel
} from "../../services/relationshipsService";
import { getUserById } from "../../services/usersService";
import { useAuth } from "../../contexts/AuthContext";
import { CreateRelationship } from "./CreateRelationship";
import { EditRelationship } from "./EditRelationship";
import { RelationshipDetails } from "./RelationshipDetails";

export const ListRelationships = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [relationships, setRelationships] = useState([]);
  const [relationshipsWithUsers, setRelationshipsWithUsers] = useState([]);
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
  const [selectedRelationshipId, setSelectedRelationshipId] = useState(null);

  // Verificar autenticación antes de cargar datos
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    } else if (!authLoading && isAuthenticated) {
      loadRelationships();
    }
  }, [isAuthenticated, authLoading, pagination.skip, pagination.limit, navigate]);

  // Efecto para cargar los datos de los usuarios una vez que tenemos las relaciones
  useEffect(() => {
    const fetchUserData = async () => {
      if (!relationships || relationships.length === 0) return;

      try {
        const relationshipsWithUserData = [...relationships];
        
        // Obtener los datos de usuario para cada relación (origen y destino)
        for (let i = 0; i < relationshipsWithUserData.length; i++) {
          const relationship = relationshipsWithUserData[i];
          
          // Obtener datos del usuario origen
          if (relationship.user_id) {
            try {
              const userData = await getUserById(relationship.user_id);
              relationshipsWithUserData[i] = {
                ...relationship,
                user_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.email || "N/A"
              };
            } catch (err) {
              console.error(`Error al obtener datos del usuario origen ${relationship.user_id}:`, err);
              relationshipsWithUserData[i] = {
                ...relationship,
                user_name: "Error al cargar"
              };
            }
          } else {
            relationshipsWithUserData[i] = {
              ...relationship,
              user_name: "No asignado"
            };
          }
          
          // Obtener datos del usuario destino
          if (relationship.related_user_id) {
            try {
              const relatedUserData = await getUserById(relationship.related_user_id);
              relationshipsWithUserData[i] = {
                ...relationshipsWithUserData[i],
                related_user_name: `${relatedUserData.first_name || ''} ${relatedUserData.last_name || ''}`.trim() || relatedUserData.email || "N/A"
              };
            } catch (err) {
              console.error(`Error al obtener datos del usuario destino ${relationship.related_user_id}:`, err);
              relationshipsWithUserData[i] = {
                ...relationshipsWithUserData[i],
                related_user_name: "Error al cargar"
              };
            }
          } else {
            relationshipsWithUserData[i] = {
              ...relationshipsWithUserData[i],
              related_user_name: "No asignado"
            };
          }
        }
        
        setRelationshipsWithUsers(relationshipsWithUserData);
      } catch (err) {
        console.error("Error al procesar relaciones con usuarios:", err);
        setError("Error al cargar información de usuarios");
      }
    };

    fetchUserData();
  }, [relationships]);

  const loadRelationships = async () => {
    try {
      setLoading(true);
      setError(null); // Limpiar errores anteriores
      
      const data = await getRelationships(pagination.skip, pagination.limit);
      
      // Asegurarse de que la respuesta sea un array
      if (Array.isArray(data)) {
        setRelationships(data);
      } else if (data && typeof data === 'object' && Array.isArray(data.relationships)) {
        // En caso de que la API devuelva un objeto con una propiedad 'relationships'
        setRelationships(data.relationships);
      } else {
        setRelationships([]);
        setError("Formato de respuesta inesperado al cargar relaciones");
      }
    } catch (err) {
      console.error("Error fetching relationships:", err);
      
      // Verificar si el error es de autenticación
      if (err.response && err.response.status === 401) {
        setError("Sesión expirada o no autorizada. Por favor inicie sesión nuevamente.");
        // Redirigir al login después de un breve retraso
        setTimeout(() => navigate("/login"), 2000);
      } else if (err.response) {
        setError(`Error al cargar las relaciones: ${err.response.data?.message || "Error en el servidor"}`);
      } else if (err.request) {
        setError("No se pudo conectar con el servidor. Verifique su conexión a internet.");
      } else {
        setError("Error al preparar la solicitud. Por favor intente nuevamente.");
      }
      
      setRelationships([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (relationshipId) => {
    if (!relationshipId) {
      console.error("ID de relación inválido:", relationshipId);
      alert("Error: El ID de relación es inválido");
      return;
    }
    
    // Abrir el modal de detalles
    setSelectedRelationshipId(relationshipId);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (relationshipId) => {
    if (!relationshipId) {
      console.error("ID de relación inválido:", relationshipId);
      alert("Error: El ID de relación es inválido");
      return;
    }
    
    // Abrir el modal de edición
    setSelectedRelationshipId(relationshipId);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error("ID de relación inválido para eliminar:", id);
      alert("Error: El ID de relación es inválido");
      return;
    }
    
    if (window.confirm("¿Está seguro de eliminar esta relación?")) {
      try {
        setIsDeleting(true);
        setError(null);
        
        await deleteRelationship(id);
        
        // Mostrar mensaje de éxito
        alert("Relación eliminada correctamente");
        
        // Recargar relaciones después de eliminar
        loadRelationships();
      } catch (err) {
        console.error("Error deleting relationship:", err);
        
        // Verificar si el error es de autenticación
        if (err.response && err.response.status === 401) {
          setError("Sesión expirada o no autorizada. Por favor inicie sesión nuevamente.");
          setTimeout(() => navigate("/login"), 2000);
        } else if (err.response && err.response.status === 404) {
          alert("La relación ya no existe o fue eliminada previamente.");
          loadRelationships(); // Actualizar la lista de todos modos
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
    if (relationships.length >= pagination.limit) {
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
    setSelectedRelationshipId(null);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedRelationshipId(null);
  };

  const handleRelationshipCreated = () => {
    // Recargar relaciones después de crear una nueva
    loadRelationships();
  };

  const handleRelationshipUpdated = () => {
    // Recargar relaciones después de actualizar una existente
    loadRelationships();
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
      {/* Encabezado responsivo */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Lista de Relaciones</h1>
        <button
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={handleOpenCreateModal}
        >
          Crear Relación
        </button>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Indicador de carga */}
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Indicador visual para scroll horizontal en móviles */}
          <div className="block md:hidden mb-4">
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded text-sm">
              💡 Desliza horizontalmente para ver todas las columnas
            </div>
          </div>

          {/* Vista de tabla con scroll horizontal para todos los tamaños de pantalla */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            {/* Contenedor con ancho mínimo fijo para forzar scroll horizontal en móviles */}
            <div className="min-w-[800px]">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                      De (Origen)
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                      Para (Destino)
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                      Tipo de Relación
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px]">
                      Descripción
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[160px]">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {relationshipsWithUsers && relationshipsWithUsers.length > 0 ? (
                    relationshipsWithUsers.map((relationship) => (
                      <tr key={relationship.id}>
                        <td className="px-4 py-4 text-sm text-gray-900 min-w-[140px]">
                          <div className="max-w-[130px] truncate" title={relationship.user_name || "N/A"}>
                            {relationship.user_name || "N/A"}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 min-w-[140px]">
                          <div className="max-w-[130px] truncate" title={relationship.related_user_name || "N/A"}>
                            {relationship.related_user_name || "N/A"}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 min-w-[120px]">
                          <div className="max-w-[110px] truncate" title={getRelationshipTypeLabel(relationship.relationship_type) || "N/A"}>
                            {getRelationshipTypeLabel(relationship.relationship_type) || "N/A"}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 min-w-[180px]">
                          <div className="max-w-[170px] truncate" title={relationship.description || "Sin descripción"}>
                            {relationship.description || "Sin descripción"}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm min-w-[160px]">
                          <div className="flex flex-wrap gap-1">
                            <button
                              onClick={() => handleViewDetails(relationship.id)}
                              className="text-blue-600 hover:text-blue-900 px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 rounded"
                              disabled={isDeleting}
                            >
                              Detalles
                            </button>
                            <button
                              onClick={() => handleEdit(relationship.id)}
                              className="text-indigo-600 hover:text-indigo-900 px-2 py-1 text-xs bg-indigo-50 hover:bg-indigo-100 rounded"
                              disabled={isDeleting}
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(relationship.id)}
                              className="text-red-600 hover:text-red-900 px-2 py-1 text-xs bg-red-50 hover:bg-red-100 rounded"
                              disabled={isDeleting}
                            >
                              {isDeleting ? "..." : "Eliminar"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                        No hay relaciones para mostrar
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginación responsiva */}
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={pagination.skip === 0}
              className={`px-3 sm:px-4 py-2 rounded text-sm sm:text-base ${
                pagination.skip === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Anterior
            </button>
            <button
              onClick={handleNextPage}
              disabled={relationships.length < pagination.limit}
              className={`px-3 sm:px-4 py-2 rounded text-sm sm:text-base ${
                relationships.length < pagination.limit
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {/* Modal para crear relación */}
      <CreateRelationship 
        isOpen={isCreateModalOpen} 
        onClose={handleCloseCreateModal} 
        onSuccess={handleRelationshipCreated} 
      />

      {/* Modal para editar relación */}
      <EditRelationship 
        isOpen={isEditModalOpen} 
        onClose={handleCloseEditModal} 
        relationshipId={selectedRelationshipId} 
        onSuccess={handleRelationshipUpdated}
      />

      {/* Modal para ver detalles de la relación */}
      <RelationshipDetails
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        relationshipId={selectedRelationshipId}
      />
    </div>
  );
};
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { 
//   getRelationships, 
//   deleteRelationship, 
//   getRelationshipTypeLabel
// } from "../../services/relationshipsService";
// import { getUserById } from "../../services/usersService";
// import { useAuth } from "../../contexts/AuthContext";
// import { CreateRelationship } from "./CreateRelationship";
// import { EditRelationship } from "./EditRelationship";
// import { RelationshipDetails } from "./RelationshipDetails";

// export const ListRelationships = () => {
//   const navigate = useNavigate();
//   const { isAuthenticated, isLoading: authLoading } = useAuth();
  
//   const [relationships, setRelationships] = useState([]);
//   const [relationshipsWithUsers, setRelationshipsWithUsers] = useState([]);
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
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [selectedRelationshipId, setSelectedRelationshipId] = useState(null);

//   // Verificar autenticación antes de cargar datos
//   useEffect(() => {
//     if (!authLoading && !isAuthenticated) {
//       navigate("/login");
//     } else if (!authLoading && isAuthenticated) {
//       loadRelationships();
//     }
//   }, [isAuthenticated, authLoading, pagination.skip, pagination.limit, navigate]);

//   // Efecto para cargar los datos de los usuarios una vez que tenemos las relaciones
//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (!relationships || relationships.length === 0) return;

//       try {
//         const relationshipsWithUserData = [...relationships];
        
//         // Obtener los datos de usuario para cada relación (origen y destino)
//         for (let i = 0; i < relationshipsWithUserData.length; i++) {
//           const relationship = relationshipsWithUserData[i];
          
//           // Obtener datos del usuario origen
//           if (relationship.user_id) {
//             try {
//               const userData = await getUserById(relationship.user_id);
//               relationshipsWithUserData[i] = {
//                 ...relationship,
//                 user_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.email || "N/A"
//               };
//             } catch (err) {
//               console.error(`Error al obtener datos del usuario origen ${relationship.user_id}:`, err);
//               relationshipsWithUserData[i] = {
//                 ...relationship,
//                 user_name: "Error al cargar"
//               };
//             }
//           } else {
//             relationshipsWithUserData[i] = {
//               ...relationship,
//               user_name: "No asignado"
//             };
//           }
          
//           // Obtener datos del usuario destino
//           if (relationship.related_user_id) {
//             try {
//               const relatedUserData = await getUserById(relationship.related_user_id);
//               relationshipsWithUserData[i] = {
//                 ...relationshipsWithUserData[i],
//                 related_user_name: `${relatedUserData.first_name || ''} ${relatedUserData.last_name || ''}`.trim() || relatedUserData.email || "N/A"
//               };
//             } catch (err) {
//               console.error(`Error al obtener datos del usuario destino ${relationship.related_user_id}:`, err);
//               relationshipsWithUserData[i] = {
//                 ...relationshipsWithUserData[i],
//                 related_user_name: "Error al cargar"
//               };
//             }
//           } else {
//             relationshipsWithUserData[i] = {
//               ...relationshipsWithUserData[i],
//               related_user_name: "No asignado"
//             };
//           }
//         }
        
//         setRelationshipsWithUsers(relationshipsWithUserData);
//       } catch (err) {
//         console.error("Error al procesar relaciones con usuarios:", err);
//         setError("Error al cargar información de usuarios");
//       }
//     };

//     fetchUserData();
//   }, [relationships]);

//   const loadRelationships = async () => {
//     try {
//       setLoading(true);
//       setError(null); // Limpiar errores anteriores
      
//       const data = await getRelationships(pagination.skip, pagination.limit);
      
//       // Asegurarse de que la respuesta sea un array
//       if (Array.isArray(data)) {
//         setRelationships(data);
//       } else if (data && typeof data === 'object' && Array.isArray(data.relationships)) {
//         // En caso de que la API devuelva un objeto con una propiedad 'relationships'
//         setRelationships(data.relationships);
//       } else {
//         setRelationships([]);
//         setError("Formato de respuesta inesperado al cargar relaciones");
//       }
//     } catch (err) {
//       console.error("Error fetching relationships:", err);
      
//       // Verificar si el error es de autenticación
//       if (err.response && err.response.status === 401) {
//         setError("Sesión expirada o no autorizada. Por favor inicie sesión nuevamente.");
//         // Redirigir al login después de un breve retraso
//         setTimeout(() => navigate("/login"), 2000);
//       } else if (err.response) {
//         setError(`Error al cargar las relaciones: ${err.response.data?.message || "Error en el servidor"}`);
//       } else if (err.request) {
//         setError("No se pudo conectar con el servidor. Verifique su conexión a internet.");
//       } else {
//         setError("Error al preparar la solicitud. Por favor intente nuevamente.");
//       }
      
//       setRelationships([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewDetails = (relationshipId) => {
//     if (!relationshipId) {
//       console.error("ID de relación inválido:", relationshipId);
//       alert("Error: El ID de relación es inválido");
//       return;
//     }
    
//     // Abrir el modal de detalles
//     setSelectedRelationshipId(relationshipId);
//     setIsDetailsModalOpen(true);
//   };

//   const handleEdit = (relationshipId) => {
//     if (!relationshipId) {
//       console.error("ID de relación inválido:", relationshipId);
//       alert("Error: El ID de relación es inválido");
//       return;
//     }
    
//     // Abrir el modal de edición
//     setSelectedRelationshipId(relationshipId);
//     setIsEditModalOpen(true);
//   };

//   const handleDelete = async (id) => {
//     if (!id) {
//       console.error("ID de relación inválido para eliminar:", id);
//       alert("Error: El ID de relación es inválido");
//       return;
//     }
    
//     if (window.confirm("¿Está seguro de eliminar esta relación?")) {
//       try {
//         setIsDeleting(true);
//         setError(null);
        
//         await deleteRelationship(id);
        
//         // Mostrar mensaje de éxito
//         alert("Relación eliminada correctamente");
        
//         // Recargar relaciones después de eliminar
//         loadRelationships();
//       } catch (err) {
//         console.error("Error deleting relationship:", err);
        
//         // Verificar si el error es de autenticación
//         if (err.response && err.response.status === 401) {
//           setError("Sesión expirada o no autorizada. Por favor inicie sesión nuevamente.");
//           setTimeout(() => navigate("/login"), 2000);
//         } else if (err.response && err.response.status === 404) {
//           alert("La relación ya no existe o fue eliminada previamente.");
//           loadRelationships(); // Actualizar la lista de todos modos
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
//     if (relationships.length >= pagination.limit) {
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
//     setSelectedRelationshipId(null);
//   };

//   const handleCloseDetailsModal = () => {
//     setIsDetailsModalOpen(false);
//     setSelectedRelationshipId(null);
//   };

//   const handleRelationshipCreated = () => {
//     // Recargar relaciones después de crear una nueva
//     loadRelationships();
//   };

//   const handleRelationshipUpdated = () => {
//     // Recargar relaciones después de actualizar una existente
//     loadRelationships();
//   };

//   // Si todavía está verificando la autenticación, muestra un indicador de carga
//   if (authLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   // Renderizado de la tarjeta de relación para vista móvil
//   const renderRelationshipCard = (relationship) => {
//     return (
//       <div key={relationship.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
//         <div className="flex justify-between mb-2">
//           <div className="font-semibold text-gray-700">De:</div>
//           <div className="text-gray-900">{relationship.user_name || "N/A"}</div>
//         </div>
//         <div className="flex justify-between mb-2">
//           <div className="font-semibold text-gray-700">Para:</div>
//           <div className="text-gray-900">{relationship.related_user_name || "N/A"}</div>
//         </div>
//         <div className="flex justify-between mb-2">
//           <div className="font-semibold text-gray-700">Tipo:</div>
//           <div className="text-gray-900">{getRelationshipTypeLabel(relationship.relationship_type) || "N/A"}</div>
//         </div>
//         <div className="flex justify-between mb-4">
//           <div className="font-semibold text-gray-700">Descripción:</div>
//           <div className="text-gray-900 truncate">{relationship.description || "Sin descripción"}</div>
//         </div>
//         <div className="flex justify-center space-x-3 pt-2 border-t">
//           <button
//             onClick={() => handleViewDetails(relationship.id)}
//             className="text-blue-600 hover:text-blue-900 px-2 py-1"
//             disabled={isDeleting}
//           >
//             Detalles
//           </button>
//           <button
//             onClick={() => handleEdit(relationship.id)}
//             className="text-indigo-600 hover:text-indigo-900 px-2 py-1"
//             disabled={isDeleting}
//           >
//             Editar
//           </button>
//           <button
//             onClick={() => handleDelete(relationship.id)}
//             className="text-red-600 hover:text-red-900 px-2 py-1"
//             disabled={isDeleting}
//           >
//             {isDeleting ? "Eliminando..." : "Eliminar"}
//           </button>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Encabezado responsivo */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Lista de Relaciones</h1>
//         <button
//           className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//           onClick={handleOpenCreateModal}
//         >
//           Crear Relación
//         </button>
//       </div>

//       {/* Mensaje de error */}
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {/* Indicador de carga */}
//       {loading ? (
//         <div className="flex justify-center">
//           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
//         </div>
//       ) : (
//         <>
//           {/* Vista móvil (tarjetas) para pantallas pequeñas */}
//           <div className="md:hidden">
//             {relationshipsWithUsers && relationshipsWithUsers.length > 0 ? (
//               relationshipsWithUsers.map(relationship => renderRelationshipCard(relationship))
//             ) : (
//               <div className="bg-white p-4 rounded-lg shadow text-center text-gray-500">
//                 No hay relaciones para mostrar
//               </div>
//             )}
//           </div>

//           {/* Vista de tabla para pantallas medianas y grandes con scroll horizontal */}
//           <div className="hidden md:block overflow-x-auto">
//             <div className="min-w-full bg-white shadow-md rounded-lg">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       De (Origen)
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Para (Destino)
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Tipo de Relación
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Descripción
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Acciones
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {relationshipsWithUsers && relationshipsWithUsers.length > 0 ? (
//                     relationshipsWithUsers.map((relationship) => (
//                       <tr key={relationship.id}>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {relationship.user_name || "N/A"}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {relationship.related_user_name || "N/A"}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {getRelationshipTypeLabel(relationship.relationship_type) || "N/A"}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-xs">
//                           {relationship.description || "Sin descripción"}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => handleViewDetails(relationship.id)}
//                               className="text-blue-600 hover:text-blue-900"
//                               disabled={isDeleting}
//                             >
//                               Detalles
//                             </button>
//                             <button
//                               onClick={() => handleEdit(relationship.id)}
//                               className="text-indigo-600 hover:text-indigo-900"
//                               disabled={isDeleting}
//                             >
//                               Editar
//                             </button>
//                             <button
//                               onClick={() => handleDelete(relationship.id)}
//                               className="text-red-600 hover:text-red-900"
//                               disabled={isDeleting}
//                             >
//                               {isDeleting ? "Eliminando..." : "Eliminar"}
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
//                         No hay relaciones para mostrar
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Paginación responsiva */}
//           <div className="flex justify-between mt-4">
//             <button
//               onClick={handlePreviousPage}
//               disabled={pagination.skip === 0}
//               className={`px-3 sm:px-4 py-2 rounded text-sm sm:text-base ${
//                 pagination.skip === 0
//                   ? "bg-gray-300 cursor-not-allowed"
//                   : "bg-blue-600 text-white hover:bg-blue-700"
//               }`}
//             >
//               Anterior
//             </button>
//             <button
//               onClick={handleNextPage}
//               disabled={relationships.length < pagination.limit}
//               className={`px-3 sm:px-4 py-2 rounded text-sm sm:text-base ${
//                 relationships.length < pagination.limit
//                   ? "bg-gray-300 cursor-not-allowed"
//                   : "bg-blue-600 text-white hover:bg-blue-700"
//               }`}
//             >
//               Siguiente
//             </button>
//           </div>
//         </>
//       )}

//       {/* Modal para crear relación */}
//       <CreateRelationship 
//         isOpen={isCreateModalOpen} 
//         onClose={handleCloseCreateModal} 
//         onSuccess={handleRelationshipCreated} 
//       />

//       {/* Modal para editar relación */}
//       <EditRelationship 
//         isOpen={isEditModalOpen} 
//         onClose={handleCloseEditModal} 
//         relationshipId={selectedRelationshipId} 
//         onSuccess={handleRelationshipUpdated}
//       />

//       {/* Modal para ver detalles de la relación */}
//       <RelationshipDetails
//         isOpen={isDetailsModalOpen}
//         onClose={handleCloseDetailsModal}
//         relationshipId={selectedRelationshipId}
//       />
//     </div>
//   );
// };