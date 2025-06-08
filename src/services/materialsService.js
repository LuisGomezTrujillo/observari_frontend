import { apiClient } from './api.js';

const URL = "api/materials";

/**
 * Crear un nuevo material
 * @param {Object} data - Datos del material a crear
 * @param {string} data.title - Título del material
 * @param {string} data.reference - Referencia del material
 * @param {string} [data.description] - Descripción del material (opcional)
 * @param {string} data.status - Estado del material (enum MaterialStatus)
 * @param {number} data.area_id - ID del área asociada
 * @param {Function} setError - Función para mostrar errores (opcional)
 * @returns {Promise<Object>} Material creado con su ID
 */
export const createMaterial = async (data, setError = null) => {
  try {
    console.log('Creando material:', data);
    
    const response = await apiClient.post(`${URL}`, data);
    
    console.log('Material creado exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error al crear material:", error);
    
    // Manejo específico de errores de autenticación
    if (error.response?.status === 401) {
      const errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      if (setError) setError(errorMessage);
      
      // Disparar evento para que AuthContext maneje el logout automático
      window.dispatchEvent(new CustomEvent('auth:logout'));
      
      const authError = new Error(errorMessage);
      authError.requireAuth = true;
      throw authError;
    }
    
    // Manejo de otros errores
    const errorMessage = error.response?.data?.detail || error.message;
    if (setError) setError(`Error al crear el material: ${errorMessage}`);
    
    throw error;
  }
};

/**
 * Obtener todos los materiales
 * @param {Function} setError - Función para mostrar errores (opcional)
 * @returns {Promise<Array>} Lista de todos los materiales
 */
export const getMaterials = async (setError = null) => {
  try {
    console.log('Obteniendo todos los materiales...');
    
    const response = await apiClient.get(`${URL}`);
    
    console.log(`Se obtuvieron ${response.data.length} materiales`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener materiales:", error);
    
    // Manejo específico de errores de autenticación
    if (error.response?.status === 401) {
      const errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      if (setError) setError(errorMessage);
      
      window.dispatchEvent(new CustomEvent('auth:logout'));
      
      const authError = new Error(errorMessage);
      authError.requireAuth = true;
      throw authError;
    }
    
    const errorMessage = error.response?.data?.detail || error.message;
    if (setError) setError(`Error al obtener los materiales: ${errorMessage}`);
    
    throw error;
  }
};

/**
 * Obtener un material específico por ID
 * @param {number} id - ID del material a obtener
 * @param {Function} setError - Función para mostrar errores (opcional)
 * @returns {Promise<Object>} Datos del material
 */
export const getMaterialById = async (id, setError = null) => {
  try {
    console.log('Obteniendo material con ID:', id);
    
    const response = await apiClient.get(`${URL}/${id}`);
    
    console.log('Material obtenido:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error al obtener material:", error);
    
    // Manejo específico de errores de autenticación
    if (error.response?.status === 401) {
      const errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      if (setError) setError(errorMessage);
      
      window.dispatchEvent(new CustomEvent('auth:logout'));
      
      const authError = new Error(errorMessage);
      authError.requireAuth = true;
      throw authError;
    }
    
    // Manejo específico para material no encontrado
    if (error.response?.status === 404) {
      const errorMessage = 'Material no encontrado';
      if (setError) setError(errorMessage);
    } else {
      const errorMessage = error.response?.data?.detail || error.message;
      if (setError) setError(`Error al obtener el material: ${errorMessage}`);
    }
    
    throw error;
  }
};

/**
 * Actualizar un material existente
 * @param {number} id - ID del material a actualizar
 * @param {Object} data - Datos a actualizar (campos opcionales)
 * @param {string} [data.title] - Título del material (opcional)
 * @param {string} [data.reference] - Referencia del material (opcional)
 * @param {string} [data.description] - Descripción del material (opcional)
 * @param {string} [data.status] - Estado del material (opcional)
 * @param {number} [data.area_id] - ID del área asociada (opcional)
 * @param {Function} setError - Función para mostrar errores (opcional)
 * @returns {Promise<Object>} Material actualizado
 */
export const updateMaterial = async (id, data, setError = null) => {
  try {
    console.log('Actualizando material:', id, data);
    
    const response = await apiClient.patch(`${URL}/${id}`, data);
    
    console.log('Material actualizado exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar material:", error);
    
    // Manejo específico de errores de autenticación
    if (error.response?.status === 401) {
      const errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      if (setError) setError(errorMessage);
      
      window.dispatchEvent(new CustomEvent('auth:logout'));
      
      const authError = new Error(errorMessage);
      authError.requireAuth = true;
      throw authError;
    }
    
    // Manejo específico para material no encontrado
    if (error.response?.status === 404) {
      const errorMessage = 'Material no encontrado';
      if (setError) setError(errorMessage);
    } else {
      const errorMessage = error.response?.data?.detail || error.message;
      if (setError) setError(`Error al actualizar el material: ${errorMessage}`);
    }
    
    throw error;
  }
};

/**
 * Eliminar un material
 * @param {number} id - ID del material a eliminar
 * @param {Function} setError - Función para mostrar errores (opcional)
 * @returns {Promise<Object>} Resultado de la eliminación
 */
export const deleteMaterial = async (id, setError = null) => {
  try {
    console.log('Eliminando material con ID:', id);
    
    const response = await apiClient.delete(`${URL}/${id}`);
    
    console.log('Material eliminado exitosamente');
    return response.data;
  } catch (error) {
    console.error("Error al eliminar material:", error);
    
    // Manejo específico de errores de autenticación
    if (error.response?.status === 401) {
      const errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      if (setError) setError(errorMessage);
      
      window.dispatchEvent(new CustomEvent('auth:logout'));
      
      const authError = new Error(errorMessage);
      authError.requireAuth = true;
      throw authError;
    }
    
    // Manejo específico para material no encontrado
    if (error.response?.status === 404) {
      const errorMessage = 'Material no encontrado';
      if (setError) setError(errorMessage);
    } else {
      const errorMessage = error.response?.data?.detail || error.message;
      if (setError) setError(`Error al eliminar el material: ${errorMessage}`);
    }
    
    throw error;
  }
};

/**
 * Obtener materiales filtrados por área
 * @param {number} areaId - ID del área
 * @param {Function} setError - Función para mostrar errores (opcional)
 * @returns {Promise<Array>} Lista de materiales del área especificada
 */
export const getMaterialsByArea = async (areaId, setError = null) => {
  try {
    console.log('Obteniendo materiales del área:', areaId);
    
    const response = await apiClient.get(`${URL}`);
    
    // Filtrar materiales por area_id en el frontend
    const filteredMaterials = response.data.filter(material => material.area_id === areaId);
    
    console.log(`Se encontraron ${filteredMaterials.length} materiales para el área ${areaId}`);
    return filteredMaterials;
  } catch (error) {
    console.error("Error al obtener materiales por área:", error);
    
    // Manejo específico de errores de autenticación
    if (error.response?.status === 401) {
      const errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      if (setError) setError(errorMessage);
      
      window.dispatchEvent(new CustomEvent('auth:logout'));
      
      const authError = new Error(errorMessage);
      authError.requireAuth = true;
      throw authError;
    }
    
    const errorMessage = error.response?.data?.detail || error.message;
    if (setError) setError(`Error al obtener los materiales del área: ${errorMessage}`);
    
    throw error;
  }
};

/**
 * Obtener materiales filtrados por estado
 * @param {string} status - Estado del material según enum MaterialStatus
 * @param {Function} setError - Función para mostrar errores (opcional)
 * @returns {Promise<Array>} Lista de materiales del estado especificado
 */
export const getMaterialsByStatus = async (status, setError = null) => {
  try {
    console.log('Obteniendo materiales del estado:', status);
    
    const response = await apiClient.get(`${URL}`);
    
    // Filtrar materiales por status en el frontend
    const filteredMaterials = response.data.filter(material => material.status === status);
    
    console.log(`Se encontraron ${filteredMaterials.length} materiales del estado ${status}`);
    return filteredMaterials;
  } catch (error) {
    console.error("Error al obtener materiales por estado:", error);
    
    // Manejo específico de errores de autenticación
    if (error.response?.status === 401) {
      const errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      if (setError) setError(errorMessage);
      
      window.dispatchEvent(new CustomEvent('auth:logout'));
      
      const authError = new Error(errorMessage);
      authError.requireAuth = true;
      throw authError;
    }
    
    const errorMessage = error.response?.data?.detail || error.message;
    if (setError) setError(`Error al obtener los materiales por estado: ${errorMessage}`);
    
    throw error;
  }
};

/**
 * Buscar materiales por título, referencia o descripción
 * @param {string} searchTerm - Término de búsqueda
 * @param {Function} setError - Función para mostrar errores (opcional)
 * @returns {Promise<Array>} Lista de materiales que coinciden con la búsqueda
 */
export const searchMaterials = async (searchTerm, setError = null) => {
  try {
    console.log('Buscando materiales con término:', searchTerm);
    
    const response = await apiClient.get(`${URL}`);
    
    // Buscar en título, referencia y descripción
    const term = searchTerm.toLowerCase();
    const filteredMaterials = response.data.filter(material => 
      material.title.toLowerCase().includes(term) ||
      material.reference.toLowerCase().includes(term) ||
      (material.description && material.description.toLowerCase().includes(term))
    );
    
    console.log(`Se encontraron ${filteredMaterials.length} materiales que coinciden con "${searchTerm}"`);
    return filteredMaterials;
  } catch (error) {
    console.error("Error al buscar materiales:", error);
    
    // Manejo específico de errores de autenticación
    if (error.response?.status === 401) {
      const errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      if (setError) setError(errorMessage);
      
      window.dispatchEvent(new CustomEvent('auth:logout'));
      
      const authError = new Error(errorMessage);
      authError.requireAuth = true;
      throw authError;
    }
    
    const errorMessage = error.response?.data?.detail || error.message;
    if (setError) setError(`Error al buscar materiales: ${errorMessage}`);
    
    throw error;
  }
};

/**
 * Validar si existe un material con la misma referencia
 * @param {string} reference - Referencia a validar
 * @param {number} [excludeId] - ID del material a excluir de la validación (para actualizaciones)
 * @param {Function} setError - Función para mostrar errores (opcional)
 * @returns {Promise<boolean>} true si la referencia ya existe
 */
export const validateMaterialReference = async (reference, excludeId = null, setError = null) => {
  try {
    console.log('Validando referencia de material:', reference, excludeId ? `(excluyendo ID: ${excludeId})` : '');
    
    const response = await apiClient.get(`${URL}`);
    
    const exists = response.data.some(material => 
      material.reference === reference && 
      (excludeId === null || material.id !== excludeId)
    );
    
    console.log(`Referencia "${reference}" ${exists ? 'ya existe' : 'está disponible'}`);
    return exists;
  } catch (error) {
    console.error("Error al validar referencia de material:", error);
    
    // Manejo específico de errores de autenticación
    if (error.response?.status === 401) {
      const errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      if (setError) setError(errorMessage);
      
      window.dispatchEvent(new CustomEvent('auth:logout'));
      
      const authError = new Error(errorMessage);
      authError.requireAuth = true;
      throw authError;
    }
    
    const errorMessage = error.response?.data?.detail || error.message;
    if (setError) setError(`Error al validar la referencia: ${errorMessage}`);
    
    return false;
  }
};

/**
 * Obtener estadísticas de materiales por estado
 * @param {Function} setError - Función para mostrar errores (opcional)
 * @returns {Promise<Object>} Objeto con conteo de materiales por estado
 */
export const getMaterialsStats = async (setError = null) => {
  try {
    console.log('Obteniendo estadísticas de materiales...');
    
    const response = await apiClient.get(`${URL}`);
    
    const stats = response.data.reduce((acc, material) => {
      acc[material.status] = (acc[material.status] || 0) + 1;
      return acc;
    }, {});
    
    const result = {
      total: response.data.length,
      byStatus: stats
    };
    
    console.log('Estadísticas de materiales:', result);
    return result;
  } catch (error) {
    console.error("Error al obtener estadísticas de materiales:", error);
    
    // Manejo específico de errores de autenticación
    if (error.response?.status === 401) {
      const errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      if (setError) setError(errorMessage);
      
      window.dispatchEvent(new CustomEvent('auth:logout'));
      
      const authError = new Error(errorMessage);
      authError.requireAuth = true;
      throw authError;
    }
    
    const errorMessage = error.response?.data?.detail || error.message;
    if (setError) setError(`Error al obtener las estadísticas: ${errorMessage}`);
    
    return { total: 0, byStatus: {} };
  }
};

/**
 * Función auxiliar para validar datos del material antes del envío
 * @param {Object} materialData - Datos del material a validar
 * @returns {boolean} true si los datos son válidos
 * @throws {Error} Si los datos no son válidos
 */
export const validateMaterialData = (materialData) => {
  const requiredFields = ['title', 'reference', 'status', 'area_id'];
  const missingFields = requiredFields.filter(field => !materialData[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
  }
  
  // Validar título
  if (typeof materialData.title !== 'string' || materialData.title.trim().length === 0) {
    throw new Error('El título debe ser una cadena no vacía');
  }
  
  // Validar referencia
  if (typeof materialData.reference !== 'string' || materialData.reference.trim().length === 0) {
    throw new Error('La referencia debe ser una cadena no vacía');
  }
  
  // Validar estado
  if (typeof materialData.status !== 'string') {
    throw new Error('El estado debe ser una cadena válida');
  }
  
  // Validar ID del área
  if (!Number.isInteger(materialData.area_id) || materialData.area_id <= 0) {
    throw new Error('El ID del área debe ser un número entero positivo');
  }
  
  return true;
};

/**
 * Función auxiliar para formatear datos del material para el backend
 * @param {Object} materialData - Datos del material a formatear
 * @returns {Object} Datos formateados para el backend
 */
export const formatMaterialForBackend = (materialData) => {
  const formattedData = { ...materialData };
  
  // Limpiar campos de texto (eliminar espacios en blanco al inicio y final)
  if (formattedData.title) {
    formattedData.title = formattedData.title.trim();
  }
  
  if (formattedData.reference) {
    formattedData.reference = formattedData.reference.trim();
  }
  
  if (formattedData.description) {
    formattedData.description = formattedData.description.trim();
  }
  
  // Remover campos undefined o null innecesarios
  Object.keys(formattedData).forEach(key => {
    if (formattedData[key] === undefined || formattedData[key] === '') {
      delete formattedData[key];
    }
  });
  
  return formattedData;
};