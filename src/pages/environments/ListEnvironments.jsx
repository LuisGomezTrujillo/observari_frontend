import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getEnvironments, 
  deleteEnvironment, 
  getEnvironmentTypeLabel,
  formatEnvironmentForDisplay
} from "../../services/environmentsService";
import { useAuth } from "../../contexts/AuthContext";
import { useSessionAwareRequest } from "../../hooks/useSessionAwareRequest";
import { CreateEnvironment } from "./CreateEnvironment";
import { EditEnvironment } from "./EditEnvironment";
import { EnvironmentDetails } from "./EnvironmentDetails";

export const ListEnvironments = () => {
  const navigate = useNavigate();
  const { 
    isAuthenticated, 
    currentUser, 
    isLoading: authLoading, 
    openLoginModal
  } = useAuth();
  
  const { safeRequest } = useSessionAwareRequest();
  
  // Estados principales
  const [environments, setEnvironments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  
  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [filteredEnvironments, setFilteredEnvironments] = useState([]);
  
  // Estados para paginación
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 10
  });
  
  // Estados para controlar los modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEnvironmentId, setSelectedEnvironmentId] = useState(null);

  // Función para cargar datos usando environmentsService
  const loadData = async () => {
    if (!isAuthenticated) {
      setError("Debes iniciar sesión para ver los ambientes");
      setLoading(false);
      return;
    }

    try {
      setError(null);
      setDeleteError(null);
      setLoading(true);

      const environmentsData = await safeRequest(
        () => getEnvironments(),
        setError,
        "Tu sesión ha expirado al cargar los ambientes. Por favor, inicia sesión nuevamente."
      );

      // Si safeRequest retorna null significa que hubo error 401
      if (environmentsData === null) {
        setLoading(false);
        return;
      }

      // Asegurarse de que la respuesta sea un array y formatear para display
      let processedEnvironments = [];
      if (Array.isArray(environmentsData)) {
        processedEnvironments = environmentsData.map(env => formatEnvironmentForDisplay(env));
      } else if (environmentsData && typeof environmentsData === 'object' && Array.isArray(environmentsData.environments)) {
        processedEnvironments = environmentsData.environments.map(env => formatEnvironmentForDisplay(env));
      }

      setEnvironments(processedEnvironments || []);

    } catch (error) {
      console.error('Error al cargar datos:', error);
      
      // Manejo específico de errores (excluyendo 401 que ya maneja safeRequest)
      if (error.response?.status === 403) {
        setError("No tienes permisos para ver los ambientes.");
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
          "Error al cargar los ambientes. Por favor, intenta nuevamente."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para filtrar ambientes
  const applyFilters = () => {
    let filtered = [...environments];

    // Filtro por término de búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(env => 
        (env.name || env.title || '').toLowerCase().includes(term) ||
        (env.description || '').toLowerCase().includes(term) ||
        (env.location || '').toLowerCase().includes(term)
      );
    }

    // Filtro por tipo
    if (selectedType) {
      filtered = filtered.filter(env => 
        (env.type || env.environment_type) === selectedType
      );
    }

    // Aplicar paginación
    const startIndex = pagination.skip;
    const endIndex = startIndex + pagination.limit;
    const paginatedEnvironments = filtered.slice(startIndex, endIndex);

    setFilteredEnvironments(paginatedEnvironments);
  };

  // Función para eliminar ambiente usando environmentsService
  const handleDelete = async (environmentId) => {
    if (!environmentId) {
      console.error("ID de ambiente inválido para eliminar:", environmentId);
      alert("Error: El ID de ambiente es inválido");
      return;
    }

    if (!window.confirm('¿Estás seguro de que deseas eliminar este ambiente?')) {
      return;
    }

    try {
      setDeleteError(null);
      setDeleteLoading(environmentId);
      
      const result = await safeRequest(
        () => deleteEnvironment(environmentId),
        setDeleteError,
        "Tu sesión ha expirado durante la eliminación. Por favor, inicia sesión nuevamente."
      );

      // Si safeRequest retorna null significa que hubo error 401
      if (result === null) {
        return;
      }
      
      // Actualizar la lista localmente
      setEnvironments(prevEnvironments => 
        prevEnvironments.filter(environment => environment.id !== environmentId)
      );
      
    } catch (error) {
      console.error('Error al eliminar ambiente:', error);
      
      // Manejo específico de errores de eliminación (excluyendo 401 que ya maneja safeRequest)
      if (error.response?.status === 403) {
        setDeleteError("No tienes permisos para eliminar este ambiente.");
      } else if (error.response?.status === 404) {
        setDeleteError("El ambiente que intentas eliminar no existe.");
        // Recargar datos para actualizar la lista
        loadData();
      } else if (error.response?.status >= 500) {
        setDeleteError("Error interno del servidor. Por favor, intenta más tarde.");
      } else {
        setDeleteError(
          error.response?.data?.detail || 
          error.response?.data?.message || 
          "Error al eliminar el ambiente. Por favor, intenta nuevamente."
        );
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  // Manejadores para los modales
  const handleViewDetails = (environmentId) => {
    if (!environmentId) {
      console.error("ID de ambiente inválido:", environmentId);
      alert("Error: El ID de ambiente es inválido");
      return;
    }
    
    setSelectedEnvironmentId(environmentId);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (environmentId) => {
    if (!environmentId) {
      console.error("ID de ambiente inválido:", environmentId);
      alert("Error: El ID de ambiente es inválido");
      return;
    }
    
    setSelectedEnvironmentId(environmentId);
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
    setSelectedEnvironmentId(null);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedEnvironmentId(null);
  };

  // Manejadores para actualizaciones exitosas
  const handleEnvironmentCreated = () => {
    loadData();
  };

  const handleEnvironmentUpdated = () => {
    loadData();
  };

  // Manejadores para filtros
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Resetear paginación al filtrar
    setPagination(prev => ({ ...prev, skip: 0 }));
  };

  const handleTypeFilterChange = (e) => {
    setSelectedType(e.target.value);
    // Resetear paginación al filtrar
    setPagination(prev => ({ ...prev, skip: 0 }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setPagination(prev => ({ ...prev, skip: 0 }));
  };

  // Manejadores para la paginación
  const handleNextPage = () => {
    if (filteredEnvironments.length >= pagination.limit) {
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

  // Aplicar filtros cuando cambien los datos, filtros o paginación
  useEffect(() => {
    applyFilters();
  }, [environments, searchTerm, selectedType, pagination.skip, pagination.limit]);

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
            Debes iniciar sesión para acceder a la lista de ambientes.
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
            <h1 className="text-3xl font-bold text-gray-900">Ambientes</h1>
            <p className="text-gray-600 mt-1">
              Gestiona los ambientes del sistema educativo
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nuevo Ambiente</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 bg-white shadow-sm rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Buscar por nombre, descripción o ubicación..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Ambiente
            </label>
            <select
              value={selectedType}
              onChange={handleTypeFilterChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Todos los tipos</option>
              <option value="nest">Nido</option>
              <option value="community">Comunidad de Niños</option>
              <option value="house">Casa de Niños</option>
              <option value="lower">Taller 1</option>
              <option value="upper">Taller 2</option>
              <option value="adolescence">Comunidad Adolescentes del Planeta (ErdKinder)</option>
              <option value="high">Comunidad Adultos del Planeta</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
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
            <p className="text-gray-600">Cargando ambientes...</p>
          </div>
        </div>
      )}

      {/* Lista de ambientes */}
      {!loading && !error && (
        <>
          {filteredEnvironments.length === 0 && environments.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay ambientes registrados
              </h3>
              <p className="text-gray-600 mb-4">
                Comienza creando el primer ambiente del sistema.
              </p>
              <button
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Crear Primer Ambiente
              </button>
            </div>
          ) : filteredEnvironments.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron ambientes
              </h3>
              <p className="text-gray-600 mb-4">
                Intenta ajustar los filtros de búsqueda.
              </p>
              <button
                onClick={clearFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Limpiar Filtros
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
                          Nombre
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ubicación
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
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
                      {filteredEnvironments.map((environment) => (
                        <tr key={environment.id} className="hover:bg-gray-50">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {environment.id}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {environment.name || environment.title || "N/A"}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {environment.typeLabel || getEnvironmentTypeLabel(environment.type || environment.environment_type) || "N/A"}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {environment.location || "N/A"}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              environment.is_active !== false
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {environment.is_active !== false ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {environment.description || 'Sin descripción'}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleViewDetails(environment.id)}
                                className="text-blue-600 hover:text-blue-900 font-medium px-2 py-1"
                                disabled={deleteLoading === environment.id}
                              >
                                Detalles
                              </button>
                              <button
                                onClick={() => handleEdit(environment.id)}
                                className="text-indigo-600 hover:text-indigo-900 font-medium px-2 py-1"
                                disabled={deleteLoading === environment.id}
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(environment.id)}
                                disabled={deleteLoading === environment.id}
                                className="text-red-600 hover:text-red-900 font-medium px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {deleteLoading === environment.id ? (
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
                  Mostrando {filteredEnvironments.length} ambiente{filteredEnvironments.length !== 1 ? 's' : ''}
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
                    disabled={filteredEnvironments.length < pagination.limit}
                    className={`px-3 py-1 rounded text-sm ${
                      filteredEnvironments.length < pagination.limit
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

      {/* Modal para crear ambiente */}
      <CreateEnvironment 
        isOpen={isCreateModalOpen} 
        onClose={handleCloseCreateModal} 
        onSuccess={handleEnvironmentCreated} 
      />

      {/* Modal para editar ambiente */}
      <EditEnvironment 
        isOpen={isEditModalOpen} 
        onClose={handleCloseEditModal} 
        environmentId={selectedEnvironmentId} 
        onSuccess={handleEnvironmentUpdated}
      />

      {/* Modal para ver detalles del ambiente */}
      <EnvironmentDetails
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        environmentId={selectedEnvironmentId}
      />
    </div>
  );
};