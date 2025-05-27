import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getProfiles, deleteProfile } from '../../services/profilesService';
import { getUsers, getUserById } from '../../services/usersService';
import { useSessionAwareRequest } from '../../hooks/useSessionAwareRequest';
import { CreateProfile } from './CreateProfile';
import { EditProfile } from './EditProfile';
import { ProfileDetails } from './ProfileDetails';

export const ListProfiles = () => {
  const navigate = useNavigate();
  const { 
    isAuthenticated, 
    currentUser, 
    isLoading: authLoading, 
    openLoginModal
  } = useAuth();
  
  const { safeRequest } = useSessionAwareRequest();
  
  // Estados principales
  const [profiles, setProfiles] = useState([]);
  const [profilesWithUsers, setProfilesWithUsers] = useState([]);
  const [users, setUsers] = useState([]);
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
  const [selectedProfileId, setSelectedProfileId] = useState(null);

  // Función para obtener el nombre del usuario por ID
  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.email : `Usuario ${userId}`;
  };

  // Función para cargar datos
  const loadData = async () => {
    if (!isAuthenticated) {
      setError("Debes iniciar sesión para ver los perfiles");
      setLoading(false);
      return;
    }

    try {
      setError(null);
      setDeleteError(null);
      setLoading(true);

      // Cargar perfiles usando safeRequest
      const profilesData = await safeRequest(
        () => getProfiles(pagination.skip, pagination.limit),
        setError,
        "Tu sesión ha expirado al cargar los perfiles. Por favor, inicia sesión nuevamente."
      );

      // Si hay error de sesión, safeRequest devuelve null
      if (profilesData === null) {
        setLoading(false);
        return;
      }

      // Cargar usuarios usando safeRequest
      const usersData = await safeRequest(
        () => getUsers(0, 1000),
        setError,
        "Tu sesión ha expirado al cargar los usuarios. Por favor, inicia sesión nuevamente."
      );

      // Si hay error de sesión, safeRequest devuelve null
      if (usersData === null) {
        setLoading(false);
        return;
      }

      // Asegurarse de que la respuesta sea un array
      let processedProfiles = [];
      if (Array.isArray(profilesData)) {
        processedProfiles = profilesData;
      } else if (profilesData && typeof profilesData === 'object' && Array.isArray(profilesData.profiles)) {
        processedProfiles = profilesData.profiles;
      }

      setProfiles(processedProfiles || []);
      setUsers(usersData || []);

      // Enriquecer perfiles con datos de usuario
      await enrichProfilesWithUserData(processedProfiles, usersData);

    } catch (error) {
      console.error('Error al cargar datos:', error);
      
      // Manejo específico de errores (excluyendo 401 que ya maneja safeRequest)
      if (error.response?.status === 403) {
        setError("No tienes permisos para ver los perfiles.");
      } else if (error.response?.status === 404) {
        setError("El recurso solicitado no fue encontrado.");
      } else if (error.response?.status >= 500) {
        setError("Error interno del servidor. Por favor, intenta más tarde.");
      } else if (error.message === 'Network Error') {
        setError("Error de conexión. Verifica tu conexión a internet.");
      } else {
        setError(
          error.response?.data?.detail || 
          error.response?.data?.message || 
          "Error al cargar los perfiles. Por favor, intenta nuevamente."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para enriquecer perfiles con datos de usuario
  const enrichProfilesWithUserData = async (profilesData, usersData) => {
    if (!profilesData || profilesData.length === 0) {
      setProfilesWithUsers([]);
      return;
    }

    try {
      const profilesWithUserData = [...profilesData];
      
      // Obtener los datos de usuario para cada perfil
      for (let i = 0; i < profilesWithUserData.length; i++) {
        const profile = profilesWithUserData[i];
        
        if (profile.user_id) {
          try {
            // Primero buscar en la lista de usuarios cargados
            const userFromList = usersData?.find(u => u.id === profile.user_id);
            
            if (userFromList) {
              profilesWithUserData[i] = {
                ...profile,
                user_email: userFromList.email || "N/A"
              };
            } else {
              // Si no está en la lista, hacer llamada individual usando safeRequest
              const userData = await safeRequest(
                () => getUserById(profile.user_id),
                setError,
                "Tu sesión ha expirado al cargar datos de usuario. Por favor, inicia sesión nuevamente."
              );

              if (userData !== null) {
                profilesWithUserData[i] = {
                  ...profile,
                  user_email: userData.email || "N/A"
                };
              } else {
                // Error de sesión manejado por safeRequest
                profilesWithUserData[i] = {
                  ...profile,
                  user_email: "Error al cargar"
                };
              }
            }
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

  // Función para eliminar perfil
  const handleDelete = async (profileId) => {
    if (!profileId) {
      console.error("ID de perfil inválido para eliminar:", profileId);
      alert("Error: El ID de perfil es inválido");
      return;
    }

    if (!window.confirm('¿Estás seguro de que deseas eliminar este perfil?')) {
      return;
    }

    try {
      setDeleteError(null);
      setDeleteLoading(profileId);
      
      // Usar safeRequest para la eliminación
      const result = await safeRequest(
        () => deleteProfile(profileId),
        setDeleteError,
        "Tu sesión ha expirado durante la eliminación. Por favor, inicia sesión nuevamente."
      );

      // Si hay error de sesión, safeRequest devuelve null
      if (result === null) {
        return;
      }
      
      // Actualizar la lista localmente
      setProfiles(prevProfiles => 
        prevProfiles.filter(profile => profile.id !== profileId)
      );
      setProfilesWithUsers(prevProfiles => 
        prevProfiles.filter(profile => profile.id !== profileId)
      );
      
    } catch (error) {
      console.error('Error al eliminar perfil:', error);
      
      // Manejo específico de errores de eliminación (excluyendo 401 que ya maneja safeRequest)
      if (error.response?.status === 403) {
        setDeleteError("No tienes permisos para eliminar este perfil.");
      } else if (error.response?.status === 404) {
        setDeleteError("El perfil que intentas eliminar no existe.");
        // Recargar datos para actualizar la lista
        loadData();
      } else if (error.response?.status >= 500) {
        setDeleteError("Error interno del servidor. Por favor, intenta más tarde.");
      } else {
        setDeleteError(
          error.response?.data?.detail || 
          error.response?.data?.message || 
          "Error al eliminar el perfil. Por favor, intenta nuevamente."
        );
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  // Manejadores para los modales
  const handleViewDetails = (profileId) => {
    if (!profileId) {
      console.error("ID de perfil inválido:", profileId);
      alert("Error: El ID de perfil es inválido");
      return;
    }
    
    setSelectedProfileId(profileId);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (profileId) => {
    if (!profileId) {
      console.error("ID de perfil inválido:", profileId);
      alert("Error: El ID de perfil es inválido");
      return;
    }
    
    setSelectedProfileId(profileId);
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
    setSelectedProfileId(null);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedProfileId(null);
  };

  // Manejadores para actualizaciones exitosas
  const handleProfileCreated = () => {
    loadData();
  };

  const handleProfileUpdated = () => {
    loadData();
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
            Debes iniciar sesión para acceder a la lista de perfiles.
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
            <h1 className="text-3xl font-bold text-gray-900">Perfiles</h1>
            <p className="text-gray-600 mt-1">
              Gestiona los perfiles de usuarios del sistema
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nuevo Perfil</span>
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
            <p className="text-gray-600">Cargando perfiles...</p>
          </div>
        </div>
      )}

      {/* Lista de perfiles */}
      {!loading && !error && (
        <>
          {profilesWithUsers.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay perfiles registrados
              </h3>
              <p className="text-gray-600 mb-4">
                Comienza creando el primer perfil del sistema.
              </p>
              <button
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Crear Primer Perfil
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
                          Usuario
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Apellido
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rol
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
                      {profilesWithUsers.map((profile) => (
                        <tr key={profile.id} className="hover:bg-gray-50">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {profile.id}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {profile.user_email || getUserName(profile.user_id)}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {profile.first_name || 'N/A'}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {profile.last_name || 'N/A'}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {profile.role || profile.profile_type || 'Usuario'}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {profile.description || 'Sin descripción'}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleViewDetails(profile.id)}
                                className="text-blue-600 hover:text-blue-900 font-medium px-2 py-1"
                                disabled={deleteLoading === profile.id}
                              >
                                Detalles
                              </button>
                              <button
                                onClick={() => handleEdit(profile.id)}
                                className="text-indigo-600 hover:text-indigo-900 font-medium px-2 py-1"
                                disabled={deleteLoading === profile.id}
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(profile.id)}
                                disabled={deleteLoading === profile.id}
                                className="text-red-600 hover:text-red-900 font-medium px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {deleteLoading === profile.id ? (
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
                  Mostrando {profilesWithUsers.length} perfil{profilesWithUsers.length !== 1 ? 'es' : ''}
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
                    disabled={profiles.length < pagination.limit}
                    className={`px-3 py-1 rounded text-sm ${
                      profiles.length < pagination.limit
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
// import { ProfileDetails } from "./ProfileDetails";

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
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [selectedProfileId, setSelectedProfileId] = useState(null);

//   // Verificar autenticación antes de cargar datos
//   useEffect(() => {
//     if (!authLoading && !isAuthenticated) {
//       navigate("/login");
//     } else if (!authLoading && isAuthenticated) {
//       loadProfiles();
//     }
//   }, [isAuthenticated, authLoading, pagination.skip, pagination.limit, navigate]);

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

//   const handleViewDetails = (profileId) => {
//     if (!profileId) {
//       console.error("ID de perfil inválido:", profileId);
//       alert("Error: El ID de perfil es inválido");
//       return;
//     }
    
//     // Abrir el modal de detalles
//     setSelectedProfileId(profileId);
//     setIsDetailsModalOpen(true);
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

//   const handleCloseDetailsModal = () => {
//     setIsDetailsModalOpen(false);
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

//   // Renderizado de la tarjeta de perfil para vista móvil
//   const renderProfileCard = (profile) => {
//     return (
//       <div key={profile.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
//         <div className="flex justify-between mb-2">
//           <div className="font-semibold text-gray-700">Correo:</div>
//           <div className="text-gray-900">{profile.user_email || "N/A"}</div>
//         </div>
//         <div className="flex justify-between mb-2">
//           <div className="font-semibold text-gray-700">Nombre:</div>
//           <div className="text-gray-900">{profile.first_name || "N/A"}</div>
//         </div>
//         <div className="flex justify-between mb-2">
//           <div className="font-semibold text-gray-700">Apellido:</div>
//           <div className="text-gray-900">{profile.last_name || "N/A"}</div>
//         </div>
//         <div className="flex justify-between mb-4">
//           <div className="font-semibold text-gray-700">Rol:</div>
//           <div className="text-gray-900">{profile.role || "Usuario"}</div>
//         </div>
//         <div className="flex justify-center space-x-3 pt-2 border-t">
//           <button
//             onClick={() => handleViewDetails(profile.id)}
//             className="text-blue-600 hover:text-blue-900 px-2 py-1"
//             disabled={isDeleting}
//           >
//             Detalles
//           </button>
//           <button
//             onClick={() => handleEdit(profile.id)}
//             className="text-indigo-600 hover:text-indigo-900 px-2 py-1"
//             disabled={isDeleting}
//           >
//             Editar
//           </button>
//           <button
//             onClick={() => handleDelete(profile.id)}
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
//         <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Lista de Perfiles</h1>
//         <button
//           className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//           onClick={handleOpenCreateModal}
//         >
//           Crear Perfil
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
//             {profilesWithUsers && profilesWithUsers.length > 0 ? (
//               profilesWithUsers.map(profile => renderProfileCard(profile))
//             ) : (
//               <div className="bg-white p-4 rounded-lg shadow text-center text-gray-500">
//                 No hay perfiles para mostrar
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
//                       Correo Usuario
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Nombre
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Apellido
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Rol
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Acciones
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {profilesWithUsers && profilesWithUsers.length > 0 ? (
//                     profilesWithUsers.map((profile) => (
//                       <tr key={profile.id}>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {profile.user_email || "N/A"}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {profile.first_name || "N/A"}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {profile.last_name || "N/A"}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {profile.role || "Usuario"}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => handleViewDetails(profile.id)}
//                               className="text-blue-600 hover:text-blue-900"
//                               disabled={isDeleting}
//                             >
//                               Detalles
//                             </button>
//                             <button
//                               onClick={() => handleEdit(profile.id)}
//                               className="text-indigo-600 hover:text-indigo-900"
//                               disabled={isDeleting}
//                             >
//                               Editar
//                             </button>
//                             <button
//                               onClick={() => handleDelete(profile.id)}
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
//                         No hay perfiles para mostrar
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
//               disabled={profiles.length < pagination.limit}
//               className={`px-3 sm:px-4 py-2 rounded text-sm sm:text-base ${
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

//       {/* Modal para ver detalles del perfil */}
//       <ProfileDetails
//         isOpen={isDetailsModalOpen}
//         onClose={handleCloseDetailsModal}
//         profileId={selectedProfileId}
//       />
//     </div>
//   );
// };
