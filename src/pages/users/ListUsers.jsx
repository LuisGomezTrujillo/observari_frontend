import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, deleteUser } from "../../services/usersService";
import { CreateUser } from "./CreateUser";
import { EditUser } from "./EditUser";
import { UserDetails } from "./UserDetails";
import { useAuth } from "../../contexts/AuthContext";
import { useSessionAwareRequest } from "../../hooks/useSessionAwareRequest";

export const ListUsers = () => {
  const navigate = useNavigate();
  const { 
    isAuthenticated, 
    currentUser, 
    isLoading: authLoading, 
    openLoginModal 
  } = useAuth();
  
  const { safeRequest } = useSessionAwareRequest();
  
  // Estados principales
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
  
  // Estados para los modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Función para cargar usuarios usando safeRequest
  const loadUsers = async () => {
    if (!isAuthenticated) {
      setError("Debes iniciar sesión para ver los usuarios");
      setLoading(false);
      return;
    }

    try {
      setError(null);
      setDeleteError(null);
      setLoading(true);
      
      const data = await safeRequest(
        () => getUsers(pagination.skip, pagination.limit),
        setError,
        "Tu sesión ha expirado mientras cargabas los usuarios. Por favor, inicia sesión."
      );

      if (data === null) {
        // safeRequest manejó el error 401
        setUsers([]);
        return;
      }
      
      // Asegurarse de que la respuesta sea un array
      let processedUsers = [];
      if (Array.isArray(data)) {
        processedUsers = data;
      } else if (data && typeof data === 'object' && Array.isArray(data.users)) {
        processedUsers = data.users;
      }

      setUsers(processedUsers || []);
      
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      
      // Manejo específico de errores (sin 401 ya que lo maneja safeRequest)
      if (error.response?.status === 403) {
        setError("No tienes permisos para ver los usuarios.");
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
          "Error al cargar los usuarios. Por favor, intenta nuevamente."
        );
      }
      
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar usuario usando safeRequest
  const handleDelete = async (userId) => {
    if (!userId) {
      console.error("ID de usuario inválido para eliminar:", userId);
      alert("Error: El ID de usuario es inválido");
      return;
    }

    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      return;
    }

    try {
      setDeleteError(null);
      setDeleteLoading(userId);
      
      await safeRequest(
        () => deleteUser(userId),
        setDeleteError,
        "Tu sesión ha expirado durante la eliminación. Por favor, inicia sesión nuevamente."
      );
      
      // Actualizar la lista localmente solo si la eliminación fue exitosa
      setUsers(prevUsers => 
        prevUsers.filter(user => user.id !== userId)
      );
      
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      
      // Manejo específico de errores de eliminación (sin 401 ya que lo maneja safeRequest)
      if (error.response?.status === 403) {
        setDeleteError("No tienes permisos para eliminar este usuario.");
      } else if (error.response?.status === 404) {
        setDeleteError("El usuario que intentas eliminar no existe.");
        // Recargar datos para actualizar la lista
        loadUsers();
      } else if (error.response?.status >= 500) {
        setDeleteError("Error interno del servidor. Por favor, intenta más tarde.");
      } else {
        setDeleteError(
          error.response?.data?.detail || 
          error.response?.data?.message || 
          "Error al eliminar el usuario. Por favor, intenta nuevamente."
        );
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  // Manejadores para los modales
  const handleViewDetails = (userId) => {
    if (!userId) {
      console.error("ID de usuario inválido para ver detalles:", userId);
      alert("Error: El ID de usuario es inválido");
      return;
    }
    
    setSelectedUserId(userId);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (userId) => {
    if (!userId) {
      console.error("ID de usuario inválido:", userId);
      alert("Error: El ID de usuario es inválido");
      return;
    }
    
    setSelectedUserId(userId);
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
    setSelectedUserId(null);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedUserId(null);
  };

  // Manejadores para actualizaciones exitosas
  const handleUserCreated = () => {
    loadUsers();
  };

  const handleUserUpdated = () => {
    loadUsers();
  };

  // Manejadores para la paginación
  const handleNextPage = () => {
    if (users.length >= pagination.limit) {
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

  // Cargar datos al montar el componente y cuando cambie la autenticación o paginación
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate("/login");
      } else {
        loadUsers();
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
            Debes iniciar sesión para acceder a la lista de usuarios.
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
            <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
            <p className="text-gray-600 mt-1">
              Gestiona los usuarios del sistema
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nuevo Usuario</span>
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
            <p className="text-gray-600">Cargando usuarios...</p>
          </div>
        </div>
      )}

      {/* Lista de usuarios */}
      {!loading && !error && (
        <>
          {users.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay usuarios registrados
              </h3>
              <p className="text-gray-600 mb-4">
                Comienza creando el primer usuario del sistema.
              </p>
              <button
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Crear Primer Usuario
              </button>
            </div>
          ) : (
            <>
              {/* Contenedor con scroll horizontal para todas las pantallas */}
              <div className="w-full overflow-x-auto bg-white shadow-md rounded-lg">
                <div className="min-w-[600px] sm:min-w-full">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px]">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.id || "N/A"}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.email || "N/A"}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleViewDetails(user.id)}
                                className="text-blue-600 hover:text-blue-900 font-medium px-2 py-1"
                                disabled={deleteLoading === user.id}
                              >
                                Detalles
                              </button>
                              <button
                                onClick={() => handleEdit(user.id)}
                                className="text-indigo-600 hover:text-indigo-900 font-medium px-2 py-1"
                                disabled={deleteLoading === user.id}
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(user.id)}
                                disabled={deleteLoading === user.id}
                                className="text-red-600 hover:text-red-900 font-medium px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {deleteLoading === user.id ? (
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
                  Mostrando {users.length} usuario{users.length !== 1 ? 's' : ''}
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
                    disabled={users.length < pagination.limit}
                    className={`px-3 py-1 rounded text-sm ${
                      users.length < pagination.limit
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

      {/* Modal para crear usuario */}
      <CreateUser 
        isOpen={isCreateModalOpen} 
        onClose={handleCloseCreateModal} 
        onSuccess={handleUserCreated}
      />

      {/* Modal para editar usuario */}
      <EditUser 
        isOpen={isEditModalOpen} 
        onClose={handleCloseEditModal} 
        userId={selectedUserId}
        onSuccess={handleUserUpdated}
      />
      
      {/* Modal para ver detalles del usuario */}
      <UserDetails 
        isOpen={isDetailsModalOpen} 
        onClose={handleCloseDetailsModal} 
        userId={selectedUserId}
      />
    </div>
  );
};

