import { apiClient } from './api.js';

const URL = "api/areas";

/**
 * Crear una nueva área
 * @param {Object} data - Datos del área a crear
 * @param {Function} setError - Función para mostrar errores (opcional)
 * @returns {Promise<Object>} Área creada con su ID
 */
export const createArea = async (data, setError = null) => {
  try {
    console.log('Creando área:', data);
    
    const response = await apiClient.post(`${URL}`, data);
    
    console.log('Área creada exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error al crear área:", error);
    
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
    if (setError) setError(`Error al crear el área: ${errorMessage}`);
    
    throw error;
  }
};

/**
 * Obtener todas las áreas
 * @param {Function} setError - Función para mostrar errores (opcional)
 * @returns {Promise<Array>} Lista de todas las áreas
 */
export const getAreas = async (setError = null) => {
  try {
    console.log('Obteniendo todas las áreas...');
    
    const response = await apiClient.get(`${URL}`);
    
    console.log(`Se obtuvieron ${response.data.length} áreas`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener áreas:", error);
    
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
    if (setError) setError(`Error al obtener las áreas: ${errorMessage}`);
    
    throw error;
  }
};

/**
 * Obtener un área específica por ID
 * @param {number} id - ID del área a obtener
 * @param {Function} setError - Función para mostrar errores (opcional)
 * @returns {Promise<Object>} Datos del área
 */
export const getAreaById = async (id, setError = null) => {
  try {
    console.log('Obteniendo área con ID:', id);
    
    const response = await apiClient.get(`${URL}/${id}`);
    
    console.log('Área obtenida:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error al obtener área:", error);
    
    // Manejo específico de errores de autenticación
    if (error.response?.status === 401) {
      const errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      if (setError) setError(errorMessage);
      
      window.dispatchEvent(new CustomEvent('auth:logout'));
      
      const authError = new Error(errorMessage);
      authError.requireAuth = true;
      throw authError;
    }
    
    // Manejo específico para área no encontrada
    if (error.response?.status === 404) {
      const errorMessage = 'Área no encontrada';
      if (setError) setError(errorMessage);
    } else {
      const errorMessage = error.response?.data?.detail || error.message;
      if (setError) setError(`Error al obtener el área: ${errorMessage}`);
    }
    
    throw error;
  }
};

/**
 * Actualizar un área existente
 * @param {number} id - ID del área a actualizar
 * @param {Object} data - Datos a actualizar (campos opcionales)
 * @param {Function} setError - Función para mostrar errores (opcional)
 * @returns {Promise<Object>} Área actualizada
 */
export const updateArea = async (id, data, setError = null) => {
  try {
    console.log('Actualizando área:', id, data);
    
    const response = await apiClient.patch(`${URL}/${id}`, data);
    
    console.log('Área actualizada exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar área:", error);
    
    // Manejo específico de errores de autenticación
    if (error.response?.status === 401) {
      const errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      if (setError) setError(errorMessage);
      
      window.dispatchEvent(new CustomEvent('auth:logout'));
      
      const authError = new Error(errorMessage);
      authError.requireAuth = true;
      throw authError;
    }
    
    // Manejo específico para área no encontrada
    if (error.response?.status === 404) {
      const errorMessage = 'Área no encontrada';
      if (setError) setError(errorMessage);
    } else {
      const errorMessage = error.response?.data?.detail || error.message;
      if (setError) setError(`Error al actualizar el área: ${errorMessage}`);
    }
    
    throw error;
  }
};

/**
 * Eliminar un área
 * @param {number} id - ID del área a eliminar
 * @param {Function} setError - Función para mostrar errores (opcional)
 * @returns {Promise<Object>} Resultado de la eliminación
 */
export const deleteArea = async (id, setError = null) => {
  try {
    console.log('Eliminando área con ID:', id);
    
    const response = await apiClient.delete(`${URL}/${id}`);
    
    console.log('Área eliminada exitosamente');
    return response.data;
  } catch (error) {
    console.error("Error al eliminar área:", error);
    
    // Manejo específico de errores de autenticación
    if (error.response?.status === 401) {
      const errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      if (setError) setError(errorMessage);
      
      window.dispatchEvent(new CustomEvent('auth:logout'));
      
      const authError = new Error(errorMessage);
      authError.requireAuth = true;
      throw authError;
    }
    
    // Manejo específico para área no encontrada
    if (error.response?.status === 404) {
      const errorMessage = 'Área no encontrada';
      if (setError) setError(errorMessage);
    } else {
      const errorMessage = error.response?.data?.detail || error.message;
      if (setError) setError(`Error al eliminar el área: ${errorMessage}`);
    }
    
    throw error;
  }
};

/**
 * Obtener áreas filtradas por ambiente
 * @param {number} environmentId - ID del ambiente
 * @param {Function} setError - Función para mostrar errores (opcional)
 * @returns {Promise<Array>} Lista de áreas del ambiente especificado
 */
export const getAreasByEnvironment = async (environmentId, setError = null) => {
  try {
    console.log('Obteniendo áreas del ambiente:', environmentId);
    
    const response = await apiClient.get(`${URL}`);
    
    // Filtrar áreas por environment_id en el frontend
    const filteredAreas = response.data.filter(area => area.environment_id === environmentId);
    
    console.log(`Se encontraron ${filteredAreas.length} áreas para el ambiente ${environmentId}`);
    return filteredAreas;
  } catch (error) {
    console.error("Error al obtener áreas por ambiente:", error);
    
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
    if (setError) setError(`Error al obtener las áreas del ambiente: ${errorMessage}`);
    
    throw error;
  }
};

/**
 * Obtener áreas filtradas por tipo
 * @param {string} areaType - Tipo de área según enum AreaType
 * @param {Function} setError - Función para mostrar errores (opcional)
 * @returns {Promise<Array>} Lista de áreas del tipo especificado
 */
export const getAreasByType = async (areaType, setError = null) => {
  try {
    console.log('Obteniendo áreas del tipo:', areaType);
    
    const response = await apiClient.get(`${URL}`);
    
    // Filtrar áreas por area_type en el frontend
    const filteredAreas = response.data.filter(area => area.area_type === areaType);
    
    console.log(`Se encontraron ${filteredAreas.length} áreas del tipo ${areaType}`);
    return filteredAreas;
  } catch (error) {
    console.error("Error al obtener áreas por tipo:", error);
    
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
    if (setError) setError(`Error al obtener las áreas por tipo: ${errorMessage}`);
    
    throw error;
  }
};

/**
 * Función auxiliar para validar datos del área antes del envío
 * @param {Object} areaData - Datos del área a validar
 * @returns {boolean} true si los datos son válidos
 * @throws {Error} Si los datos no son válidos
 */
export const validateAreaData = (areaData) => {
  const requiredFields = ['title', 'area_type', 'environment_id'];
  const missingFields = requiredFields.filter(field => !areaData[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
  }
  
  // Validar título
  if (typeof areaData.title !== 'string' || areaData.title.trim().length === 0) {
    throw new Error('El título debe ser una cadena no vacía');
  }
  
  // Validar tipo de área
  if (typeof areaData.area_type !== 'string') {
    throw new Error('El tipo de área debe ser una cadena válida');
  }
  
  // Validar ID del ambiente
  if (!Number.isInteger(areaData.environment_id) || areaData.environment_id <= 0) {
    throw new Error('El ID del ambiente debe ser un número entero positivo');
  }
  
  return true;
};

/**
 * Función auxiliar para formatear datos del área para el backend
 * @param {Object} areaData - Datos del área a formatear
 * @returns {Object} Datos formateados para el backend
 */
export const formatAreaForBackend = (areaData) => {
  const formattedData = { ...areaData };
  
  // Limpiar título (eliminar espacios en blanco al inicio y final)
  if (formattedData.title) {
    formattedData.title = formattedData.title.trim();
  }
  
  // Remover campos undefined o null innecesarios
  Object.keys(formattedData).forEach(key => {
    if (formattedData[key] === undefined || formattedData[key] === '') {
      delete formattedData[key];
    }
  });
  
  return formattedData;
};