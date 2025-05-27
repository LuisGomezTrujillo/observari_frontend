import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getRelationships, 
  deleteRelationship, 
  getRelationshipTypeLabel
} from "../../services/relationshipsService";
import { getUserById } from "../../services/usersService";
import { useAuth } from "../../contexts/AuthContext";
import { useSessionAwareRequest } from "../../hooks/useSessionAwareRequest";
import { CreateRelationship } from "./CreateRelationship";
import { EditRelationship } from "./EditRelationship";
import { RelationshipDetails } from "./RelationshipDetails";

export const ListRelationships = () => {
  const navigate = useNavigate();
  const { 
    isAuthenticated, 
    currentUser, 
    isLoading: authLoading, 
    openLoginModal
  } = useAuth();
  
  const { safeRequest } = useSessionAwareRequest();
  
  // Estados principales
  const [relationships, setRelationships] = useState([]);
  const [relationshipsWithUsers, setRelationshipsWithUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  
  // Estados para paginación
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 10
  });
  
  // Estados para controlar los modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRelationshipId, setSelectedRelationshipId] = useState(null);

  // Función para manejar errores de manera consistente
  const handleError = (error, setErrorState, context = "") => {
    console.error(`Error ${context}:`, error);
    
    if (error.response?.status === 403) {
      setErrorState("No tienes permisos para realizar esta acción.");
    } else if (error.response?.status === 404) {
      setErrorState("El recurso solicitado no fue encontrado.");
    } else if (error.response?.status >= 500) {
      setErrorState("Error interno del servidor. Por favor, intenta más tarde.");
    } else if (error.message === 'Network Error') {
      setErrorState("Error de conexión. Verifica tu conexión a internet.");
    } else {
      setErrorState(
        error.response?.data?.detail || 
        error.response?.data?.message || 
        `Error ${context}. Por favor, intenta nuevamente.`
      );
    }
  };

  // Función para cargar datos
  const loadData = async () => {
    if (!isAuthenticated) {
      setError("Debes iniciar sesión para ver las relaciones");
      setLoading(false);
      return;
    }

    try {
      setError(null);
      setDeleteError(null);
      setLoading(true);

      const relationshipsData = await safeRequest(
        () => getRelationships(pagination.skip, pagination.limit),
        setError,
        "Tu sesión ha expirado al cargar las relaciones. Por favor, inicia sesión nuevamente."
      );

      // Si safeRequest retorna null significa que hubo error 401
      if (relationshipsData === null) {
        return;
      }

      // Asegurarse de que la respuesta sea un array
      let processedRelationships = [];
      if (Array.isArray(relationshipsData)) {
        processedRelationships = relationshipsData;
      } else if (relationshipsData && typeof relationshipsData === 'object' && Array.isArray(relationshipsData.relationships)) {
        processedRelationships = relationshipsData.relationships;
      }

      setRelationships(processedRelationships || []);
      
      // Enriquecer relaciones con datos de usuario
      await enrichRelationshipsWithUserData(processedRelationships);

    } catch (error) {
      handleError(error, setError, "al cargar las relaciones");
    } finally {
      setLoading(false);
    }
  };

  // Función para enriquecer relaciones con datos de usuario
  const enrichRelationshipsWithUserData = async (relationshipsData) => {
    if (!relationshipsData || relationshipsData.length === 0) {
      setRelationshipsWithUsers([]);
      return;
    }

    try {
      const relationshipsWithUserData = [...relationshipsData];
      
      // Obtener los datos de usuario para cada relación (origen y destino)
      for (let i = 0; i < relationshipsWithUserData.length; i++) {
        const relationship = relationshipsWithUserData[i];
        
        // Obtener datos del usuario origen
        if (relationship.user_id) {
          try {
            const userData = await safeRequest(
              () => getUserById(relationship.user_id),
              setError,
              "Tu sesión ha expirado al cargar datos de usuario. Por favor, inicia sesión nuevamente."
            );

            if (userData !== null) {
              relationshipsWithUserData[i] = {
                ...relationship,
                user_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.email || "N/A"
              };
            } else {
              return; // Error 401 manejado por safeRequest
            }
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
            const relatedUserData = await safeRequest(
              () => getUserById(relationship.related_user_id),
              setError,
              "Tu sesión ha expirado al cargar datos de usuario. Por favor, inicia sesión nuevamente."
            );

            if (relatedUserData !== null) {
              relationshipsWithUserData[i] = {
                ...relationshipsWithUserData[i],
                related_user_name: `${relatedUserData.first_name || ''} ${relatedUserData.last_name || ''}`.trim() || relatedUserData.email || "N/A"
              };
            } else {
              return; // Error 401 manejado por safeRequest
            }
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

  // Función para eliminar relación
  const handleDelete = async (relationshipId) => {
    if (!relationshipId) {
      console.error("ID de relación inválido para eliminar:", relationshipId);
      alert("Error: El ID de relación es inválido");
      return;
    }

    if (!window.confirm('¿Estás seguro de que deseas eliminar esta relación?')) {
      return;
    }

    try {
      setDeleteError(null);
      setDeleteLoading(relationshipId);
      
      const result = await safeRequest(
        () => deleteRelationship(relationshipId),
        setDeleteError,
        "Tu sesión ha expirado durante la eliminación. Por favor, inicia sesión nuevamente."
      );

      // Si safeRequest retorna null significa que hubo error 401
      if (result === null) {
        return;
      }
      
      // Actualizar la lista localmente
      setRelationships(prevRelationships => 
        prevRelationships.filter(relationship => relationship.id !== relationshipId)
      );
      setRelationshipsWithUsers(prevRelationships => 
        prevRelationships.filter(relationship => relationship.id !== relationshipId)
      );
      
    } catch (error) {
      if (error.response?.status === 404) {
        setDeleteError("La relación que intentas eliminar no existe.");
        // Recargar datos para actualizar la lista
        loadData();
      } else {
        handleError(error, setDeleteError, "al eliminar la relación");
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  // Manejadores para los modales
  const handleViewDetails = (relationshipId) => {
    if (!relationshipId) {
      console.error("ID de relación inválido:", relationshipId);
      alert("Error: El ID de relación es inválido");
      return;
    }
    
    setSelectedRelationshipId(relationshipId);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (relationshipId) => {
    if (!relationshipId) {
      console.error("ID de relación inválido:", relationshipId);
      alert("Error: El ID de relación es inválido");
      return;
    }
    
    setSelectedRelationshipId(relationshipId);
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  // Manejador para abrir modal de login manualmente
  const handleOpenLoginModal = () => {
    if (openLoginModal) {
      openLoginModal();
    } else {
      // Fallback si no está disponible
      navigate('/login');
    }
  };

  // Manejadores para cerrar modales
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

  // Manejadores para actualizaciones exitosas
  const handleRelationshipCreated = () => {
    loadData();
  };

  const handleRelationshipUpdated = () => {
    loadData();
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

  // Función para reintentar carga
  const handleRetry = () => {
    loadData();
  };

  // Cargar datos al montar el componente y cuando cambie la autenticación o paginación
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate("/login");
      } else {
        loadData();
      }
    }
  }, [isAuthenticated, authLoading, pagination.skip, pagination.limit, navigate]);

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Mostrar mensaje si no está autenticado
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <div className="text-yellow-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-yellow-800 mb-2">
            Autenticación Requerida
          </h3>
          <p className="text-yellow-700 mb-4">
            Debes iniciar sesión para acceder a la lista de relaciones.
          </p>
          <button
            onClick={handleOpenLoginModal}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">Relaciones</h1>
            <p className="text-gray-600 mt-1">
              Gestiona las relaciones entre usuarios del sistema
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nueva Relación</span>
          </button>
        </div>
      </div>

      {/* Error de eliminación */}
      {deleteError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800">{deleteError}</p>
            <button
              onClick={() => setDeleteError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Error general */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando relaciones...</p>
          </div>
        </div>
      )}

      {/* Lista de relaciones */}
      {!loading && !error && (
        <>
          {relationshipsWithUsers.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay relaciones registradas
              </h3>
              <p className="text-gray-600 mb-4">
                Comienza creando la primera relación del sistema.
              </p>
              <button
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Crear Primera Relación
              </button>
            </div>
          ) : (
            <>
              {/* Contenedor con scroll horizontal para todas las pantallas */}
              <div className="w-full overflow-x-auto bg-white shadow-md rounded-lg">
                <div className="min-w-[800px] sm:min-w-full">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          De (Origen)
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Para (Destino)
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo de Relación
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Descripción
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px]">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {relationshipsWithUsers.map((relationship) => (
                        <tr key={relationship.id} className="hover:bg-gray-50">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {relationship.id}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {relationship.user_name || "N/A"}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {relationship.related_user_name || "N/A"}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {getRelationshipTypeLabel(relationship.relationship_type) || "N/A"}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {relationship.description || 'Sin descripción'}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleViewDetails(relationship.id)}
                                className="text-blue-600 hover:text-blue-900 font-medium px-2 py-1"
                                disabled={deleteLoading === relationship.id}
                              >
                                Detalles
                              </button>
                              <button
                                onClick={() => handleEdit(relationship.id)}
                                className="text-indigo-600 hover:text-indigo-900 font-medium px-2 py-1"
                                disabled={deleteLoading === relationship.id}
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(relationship.id)}
                                disabled={deleteLoading === relationship.id}
                                className="text-red-600 hover:text-red-900 font-medium px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {deleteLoading === relationship.id ? (
                                  <div className="flex items-center space-x-1">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                    <span>Eliminando...</span>
                                  </div>
                                ) : (
                                  'Eliminar'
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Indicador de desplazamiento horizontal */}
              <div className="block sm:hidden text-xs text-gray-500 text-center mt-2 italic">
                ← Deslice horizontalmente para ver todas las columnas →
              </div>

              {/* Footer con información y paginación */}
              <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t border-gray-200 rounded-b-lg flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                <p className="text-sm text-gray-600">
                  Mostrando {relationshipsWithUsers.length} relación{relationshipsWithUsers.length !== 1 ? 'es' : ''}
                </p>
                
                {/* Paginación */}
                <div className="flex space-x-2">
                  <button
                    onClick={handlePreviousPage}
                    disabled={pagination.skip === 0}
                    className={`px-3 py-1 rounded text-sm ${
                      pagination.skip === 0
                        ? "bg-gray-300 cursor-not-allowed text-gray-500"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Anterior
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={relationships.length < pagination.limit}
                    className={`px-3 py-1 rounded text-sm ${
                      relationships.length < pagination.limit
                        ? "bg-gray-300 cursor-not-allowed text-gray-500"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </>
          )}
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
