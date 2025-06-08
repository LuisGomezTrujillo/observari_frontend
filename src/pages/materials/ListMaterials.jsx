import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getMaterials, deleteMaterial, searchMaterials } from '../../services/materialsService';
import { useSessionAwareRequest } from '../../hooks/useSessionAwareRequest';
import { CreateMaterial } from './CreateMaterial';
import { EditMaterial } from './EditMaterial';
import { MaterialDetails } from './MaterialDetails';

export const ListMaterials = () => {
  const navigate = useNavigate();
  const { 
    isAuthenticated, 
    currentUser, 
    isLoading: authLoading 
  } = useAuth();
  
  const { safeRequest } = useSessionAwareRequest();
  
  // Estados principales
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  
  // Estados para paginación
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 10
  });
  
  // Estados para controlar los modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);

  // Función para cargar datos
  const loadData = async () => {
    if (!isAuthenticated) {
      setError("Debes iniciar sesión para ver los materiales");
      setLoading(false);
      return;
    }

    try {
      setError(null);
      setDeleteError(null);
      setLoading(true);

      const materialsData = await safeRequest(
        () => getMaterials(setError),
        setError,
        "Tu sesión ha expirado al cargar los materiales. Por favor, inicia sesión nuevamente."
      );

      // Si hay error de sesión, safeRequest devuelve null
      if (materialsData === null) {
        setLoading(false);
        return;
      }

      setMaterials(materialsData);
      setFilteredMaterials(materialsData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      
      if (error.response?.status === 403) {
        setError("No tienes permisos para ver los materiales.");
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
          "Error al cargar los materiales. Por favor, intenta nuevamente."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar material
  const handleDelete = async (materialId) => {
    if (!materialId) {
      console.error("ID de material inválido para eliminar:", materialId);
      alert("Error: El ID de material es inválido");
      return;
    }

    if (!window.confirm('¿Estás seguro de que deseas eliminar este material?')) {
      return;
    }

    try {
      setDeleteError(null);
      setDeleteLoading(materialId);
      
      const result = await safeRequest(
        () => deleteMaterial(materialId, setDeleteError),
        setDeleteError,
        "Tu sesión ha expirado durante la eliminación. Por favor, inicia sesión nuevamente."
      );

      // Si hay error de sesión, safeRequest devuelve null
      if (result === null) {
        return;
      }
      
      // Actualizar la lista localmente
      setMaterials(prevMaterials => prevMaterials.filter(material => material.id !== materialId));
      setFilteredMaterials(prevMaterials => prevMaterials.filter(material => material.id !== materialId));
      
    } catch (error) {
      console.error('Error al eliminar material:', error);
      
      if (error.response?.status === 403) {
        setDeleteError("No tienes permisos para eliminar este material.");
      } else if (error.response?.status === 404) {
        setDeleteError("El material que intentas eliminar no existe.");
        // Recargar datos para actualizar la lista
        loadData();
      } else if (error.response?.status >= 500) {
        setDeleteError("Error interno del servidor. Por favor, intenta más tarde.");
      } else {
        setDeleteError(
          error.response?.data?.detail || 
          error.response?.data?.message || 
          "Error al eliminar el material. Por favor, intenta nuevamente."
        );
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  // Manejadores para los modales
  const handleViewDetails = (materialId) => {
    if (!materialId) {
      console.error("ID de material inválido:", materialId);
      alert("Error: El ID de material es inválido");
      return;
    }
    setSelectedMaterialId(materialId);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (materialId) => {
    if (!materialId) {
      console.error("ID de material inválido:", materialId);
      alert("Error: El ID de material es inválido");
      return;
    }
    setSelectedMaterialId(materialId);
    setIsEditModalOpen(true);
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    loadData();
  }, [isAuthenticated]);

  // Efecto para el buscador
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMaterials(materials);
    } else {
      const doSearch = async () => {
        try {
          const results = await safeRequest(
            () => searchMaterials(searchTerm, setError),
            setError,
            "Tu sesión ha expirado durante la búsqueda. Por favor, inicia sesión nuevamente."
          );
          
          if (results === null) return;
          
          setFilteredMaterials(results);
        } catch (error) {
          console.error('Error en la búsqueda:', error);
          setError("Error al realizar la búsqueda. Por favor, intenta nuevamente.");
        }
      };

      const timeoutId = setTimeout(doSearch, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, materials]);

  // Cálculos para paginación
  const totalPages = Math.ceil(filteredMaterials.length / pagination.limit);
  const currentPage = Math.floor(pagination.skip / pagination.limit) + 1;
  
  const paginatedMaterials = filteredMaterials.slice(
    pagination.skip,
    pagination.skip + pagination.limit
  );

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    
    setPagination(prev => ({
      ...prev,
      skip: (newPage - 1) * prev.limit
    }));
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Encabezado y Controles */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Lista de Materiales
        </h1>
        
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
          {/* Buscador */}
          <input
            type="text"
            placeholder="Buscar materiales..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {/* Botón de Crear */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear Material
          </button>
        </div>
      </div>

      {/* Mensajes de Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {deleteError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error al eliminar: </strong>
          <span className="block sm:inline">{deleteError}</span>
        </div>
      )}

      {/* Tabla de Materiales */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : paginatedMaterials.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No se encontraron materiales
                  </td>
                </tr>
              ) : (
                paginatedMaterials.map((material) => (
                  <tr 
                    key={material.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {material.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {material.reference}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        material.status === 'in_use' ? 'bg-green-100 text-green-800' :
                        material.status === 'available' ? 'bg-blue-100 text-blue-800' :
                        material.status === 'repair' ? 'bg-yellow-100 text-yellow-800' :
                        material.status === 'discarded' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {material.status === 'in_use' ? 'En uso' :
                         material.status === 'available' ? 'Disponible' :
                         material.status === 'repair' ? 'En reparación' :
                         material.status === 'discarded' ? 'Descartado' :
                         material.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(material.id)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => handleEdit(material.id)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(material.id)}
                        disabled={deleteLoading === material.id}
                        className={`text-red-600 hover:text-red-900 ${
                          deleteLoading === material.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {deleteLoading === material.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {!loading && filteredMaterials.length > 0 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-lg ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            &#171;
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-lg ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            &#8249;
          </button>
          
          <span className="px-4 py-1">
            Página {currentPage} de {totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-lg ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            &#8250;
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-lg ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            &#187;
          </button>
        </div>
      )}

      {/* Modales */}
      {isCreateModalOpen && (
        <CreateMaterial
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            loadData();
          }}
        />
      )}
      
      {isEditModalOpen && selectedMaterialId && (
        <EditMaterial
          isOpen={isEditModalOpen}
          materialId={selectedMaterialId}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedMaterialId(null);
            loadData();
          }}
        />
      )}
      
      {isDetailsModalOpen && selectedMaterialId && (
        <MaterialDetails
          isOpen={isDetailsModalOpen}
          materialId={selectedMaterialId}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedMaterialId(null);
          }}
        />
      )}
    </div>
  );
};
