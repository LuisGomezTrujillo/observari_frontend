import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getAreasLabel, deleteArea, getAreas } from '../../services/areasService';
import { useSessionAwareRequest } from '../../hooks/useSessionAwareRequest';
import { CreateArea } from './CreateArea';
import { EditArea } from './EditArea';
import { AreaDetails } from './AreaDetails';
import { getEnvironmentTypeLabel } from '../../services/environmentsService';

export const ListAreas = () => {
  const navigate = useNavigate();
  const { 
    isAuthenticated, 
    currentUser, 
    isLoading: authLoading, 
    openLoginModal
  } = useAuth();
  
  const { safeRequest } = useSessionAwareRequest();
  
  // Estados principales
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAreas, setFilteredAreas] = useState([]);
  
  // Estados para paginación
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 10
  });
  
  // Estados para controlar los modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState(null);

  // Función para cargar datos
  const loadData = async () => {
    if (!isAuthenticated) {
      setError("Debes iniciar sesión para ver las áreas");
      setLoading(false);
      return;
    }

    try {
      setError(null);
      setDeleteError(null);
      setLoading(true);

      const areasData = await safeRequest(
        () => getAreas(setError),
        setError,
        "Tu sesión ha expirado al cargar las áreas. Por favor, inicia sesión nuevamente."
      );

      // Si hay error de sesión, safeRequest devuelve null
      if (areasData === null) {
        setLoading(false);
        return;
      }

      setAreas(areasData);
      setFilteredAreas(areasData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      
      if (error.response?.status === 403) {
        setError("No tienes permisos para ver las áreas.");
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
          "Error al cargar las áreas. Por favor, intenta nuevamente."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar área
  const handleDelete = async (areaId) => {
    if (!areaId) {
      console.error("ID de área inválido para eliminar:", areaId);
      alert("Error: El ID de área es inválido");
      return;
    }

    if (!window.confirm('¿Estás seguro de que deseas eliminar esta área?')) {
      return;
    }

    try {
      setDeleteError(null);
      setDeleteLoading(areaId);
      
      const result = await safeRequest(
        () => deleteArea(areaId, setDeleteError),
        setDeleteError,
        "Tu sesión ha expirado durante la eliminación. Por favor, inicia sesión nuevamente."
      );

      // Si hay error de sesión, safeRequest devuelve null
      if (result === null) {
        return;
      }
      
      // Actualizar la lista localmente
      setAreas(prevAreas => prevAreas.filter(area => area.id !== areaId));
      setFilteredAreas(prevAreas => prevAreas.filter(area => area.id !== areaId));
      
    } catch (error) {
      console.error('Error al eliminar área:', error);
      
      if (error.response?.status === 403) {
        setDeleteError("No tienes permisos para eliminar esta área.");
      } else if (error.response?.status === 404) {
        setDeleteError("El área que intentas eliminar no existe.");
        // Recargar datos para actualizar la lista
        loadData();
      } else if (error.response?.status >= 500) {
        setDeleteError("Error interno del servidor. Por favor, intenta más tarde.");
      } else {
        setDeleteError(
          error.response?.data?.detail || 
          error.response?.data?.message || 
          "Error al eliminar el área. Por favor, intenta nuevamente."
        );
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  // Manejadores para los modales
  const handleViewDetails = (areaId) => {
    if (!areaId) {
      console.error("ID de área inválido:", areaId);
      alert("Error: El ID de área es inválido");
      return;
    }
    
    setSelectedAreaId(areaId);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (areaId) => {
    if (!areaId) {
      console.error("ID de área inválido:", areaId);
      alert("Error: El ID de área es inválido");
      return;
    }
    
    setSelectedAreaId(areaId);
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
    setSelectedAreaId(null);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedAreaId(null);
  };

  // Manejadores para actualizaciones exitosas
  const handleAreaCreated = () => {
    loadData();
  };

  const handleAreaUpdated = () => {
    loadData();
  };

  // Manejadores para la paginación
  const handleNextPage = () => {
    if (areas.length >= pagination.limit) {
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

  // Función para manejar el cambio en el filtro de búsqueda
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Filtrar áreas según el término de búsqueda
    if (value.trim() === '') {
      setFilteredAreas(areas);
    } else {
      const lowercasedFilter = value.toLowerCase();
      const filtered = areas.filter(area => {
        return (
          area.title?.toLowerCase().includes(lowercasedFilter) ||
          area.description?.toLowerCase().includes(lowercasedFilter) ||
          area.area_type?.toLowerCase().includes(lowercasedFilter)
        );
      });
      setFilteredAreas(filtered);
    }
  };

  // Update filteredAreas when areas changes
  useEffect(() => {
    setFilteredAreas(areas);
  }, [areas]);

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
            Debes iniciar sesión para acceder a la lista de áreas.
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
            <h1 className="text-3xl font-bold text-gray-900">Áreas</h1>
            <p className="text-gray-600 mt-1">
              Gestiona las áreas del sistema
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nueva Área</span>
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
            <p className="text-gray-600">Cargando áreas...</p>
          </div>
        </div>
      )}

      {/* Lista de áreas */}
      {!loading && !error && (
        <>
          {/* Filtro de búsqueda */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Áreas
            </label>
            <div className="flex">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Buscar por título, tipo..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 bg-gray-200 rounded-r-lg text-gray-600 hover:bg-gray-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {areas.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay áreas registradas
              </h3>
              <p className="text-gray-600 mb-4">
                Comienza creando la primera área del sistema.
              </p>
              <button
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Crear Primera Área
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
                          Título
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ambiente
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
                      {(searchTerm ? filteredAreas : areas).map((area) => (
                        <tr key={area.id} className="hover:bg-gray-50">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {area.id}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {area.title || 'N/A'}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {getAreasLabel
                                ? getAreasLabel(area.area_type || area.type) || 'N/A'
                                : area.area_type || area.type || 'N/A'}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {area.environment_id || 'N/A'}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {area.description || 'Sin descripción'}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleViewDetails(area.id)}
                                className="text-blue-600 hover:text-blue-900 font-medium px-2 py-1"
                                disabled={deleteLoading === area.id}
                              >
                                Detalles
                              </button>
                              <button
                                onClick={() => handleEdit(area.id)}
                                className="text-indigo-600 hover:text-indigo-900 font-medium px-2 py-1"
                                disabled={deleteLoading === area.id}
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(area.id)}
                                disabled={deleteLoading === area.id}
                                className="text-red-600 hover:text-red-900 font-medium px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {deleteLoading === area.id ? (
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
                  Mostrando {areas.length} área{areas.length !== 1 ? 's' : ''}
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
                    disabled={areas.length < pagination.limit}
                    className={`px-3 py-1 rounded text-sm ${
                      areas.length < pagination.limit
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

      {/* Modal para crear área */}
      <CreateArea 
        isOpen={isCreateModalOpen} 
        onClose={handleCloseCreateModal} 
        onSuccess={handleAreaCreated} 
      />

      {/* Modal para editar área */}
      <EditArea 
        isOpen={isEditModalOpen} 
        onClose={handleCloseEditModal} 
        areaId={selectedAreaId} 
        onSuccess={handleAreaUpdated}
      />

      {/* Modal para ver detalles del área */}
      <AreaDetails
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        areaId={selectedAreaId}
      />
    </div>
  );
};
