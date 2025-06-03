import { apiClient } from "./api";

const BASE_URL = "/api/environments";

/**
 * Crea un nuevo ambiente
 * @param {Object} data - Datos del ambiente
 * @param {string} data.title - Título del ambiente
 * @param {string} data.environment_type - Tipo de ambiente
 * @returns {Promise<Object>} - El ambiente creado
 */
export const createEnvironment = async (data) => {
  // Mapear los datos del frontend al formato esperado por el backend
  const backendData = {
    title: data.name || data.title,
    environment_type: data.type || data.environment_type
  };
  
  const response = await apiClient.post(BASE_URL, backendData);
  return response.data;
};

/**
 * Obtiene todos los ambientes
 * @returns {Promise<Array>} - Lista de ambientes
 */
export const getEnvironments = async () => {
  const response = await apiClient.get(BASE_URL);
  return response.data;
};

/**
 * Obtiene un ambiente específico por su ID
 * @param {number} environmentId - ID del ambiente
 * @returns {Promise<Object>} - El ambiente encontrado
 */
export const getEnvironmentById = async (environmentId) => {
  const response = await apiClient.get(`${BASE_URL}/${environmentId}`);
  return response.data;
};

/**
 * Actualiza un ambiente existente
 * @param {number} environmentId - ID del ambiente a actualizar
 * @param {Object} data - Datos a actualizar
 * @param {string} [data.title] - Título del ambiente (opcional)
 * @param {string} [data.environment_type] - Tipo de ambiente (opcional)
 * @returns {Promise<Object>} - El ambiente actualizado
 */
export const updateEnvironment = async (environmentId, data) => {
  // Mapear los datos del frontend al formato esperado por el backend
  const backendData = {};
  
  if (data.name || data.title) {
    backendData.title = data.name || data.title;
  }
  
  if (data.type || data.environment_type) {
    backendData.environment_type = data.type || data.environment_type;
  }
  
  const response = await apiClient.patch(`${BASE_URL}/${environmentId}`, backendData);
  return response.data;
};

/**
 * Elimina un ambiente existente
 * @param {number} environmentId - ID del ambiente a eliminar
 * @returns {Promise<void>}
 */
export const deleteEnvironment = async (environmentId) => {
  await apiClient.delete(`${BASE_URL}/${environmentId}`);
  return true;
};

/**
 * Obtiene los ambientes activos (funcionalidad mantenida para compatibilidad)
 * @returns {Promise<Array>} - Lista de ambientes
 */
export const getActiveEnvironments = async () => {
  // Como el backend no maneja is_active, retornamos todos los ambientes
  return await getEnvironments();
};

/**
 * Obtiene los ambientes por tipo
 * @param {string} type - Tipo de ambiente a filtrar
 * @returns {Promise<Array>} - Lista de ambientes del tipo especificado
 */
export const getEnvironmentsByType = async (type) => {
  const environments = await getEnvironments();
  return environments.filter(env => env.environment_type === type);
};

/**
 * Busca ambientes por título
 * @param {string} query - Término de búsqueda
 * @returns {Promise<Array>} - Lista de ambientes que coinciden con la búsqueda
 */
export const searchEnvironments = async (query) => {
  const environments = await getEnvironments();
  const searchTerm = query.toLowerCase();
  
  return environments.filter(env => 
    env.title.toLowerCase().includes(searchTerm)
  );
};

/**
 * Convierte un tipo de ambiente a un formato legible
 * @param {string} type - Tipo de ambiente
 * @returns {string} - Etiqueta legible en español
 */
export const getEnvironmentTypeLabel = (type) => {
  const labels = {
    nest: 'Nido',
    community: 'Comunidad de Niños',
    house: 'Casa de Niños',
    lower: 'Taller 1',
    upper: 'Taller 2',
    adolescence: 'Comunidad Adolescentes del Planeta (ErdKinder)',
    high: 'Comunidad Adultos del Planeta'
  };
  
  return labels[type] || 'Desconocido';
};

/**
 * Obtiene todas las opciones de tipos de ambiente disponibles
 * @returns {Array} - Lista de opciones para formularios
 */
export const getEnvironmentTypeOptions = () => {
  return [
    { value: 'nest', label: 'Nido' },
    { value: 'community', label: 'Comunidad de Niños' },
    { value: 'house', label: 'Casa de Niños' },
    { value: 'lower', label: 'Taller 1' },
    { value: 'upper', label: 'Taller 2' },
    { value: 'adolescence', label: 'Comunidad Adolescentes del Planeta (ErdKinder)' },
    { value: 'high', label: 'Comunidad Adultos del Planeta' }
  ];
};

/**
 * Valida los datos de un ambiente antes de enviarlos
 * @param {Object} data - Datos del ambiente a validar
 * @returns {Object} - Objeto con isValid (boolean) y errors (array)
 */
export const validateEnvironmentData = (data) => {
  const errors = [];
  
  const title = data.name || data.title;
  const environmentType = data.type || data.environment_type;
  
  if (!title || title.trim().length === 0) {
    errors.push('El título del ambiente es requerido');
  }
  
  if (title && title.length > 100) {
    errors.push('El título del ambiente no puede exceder 100 caracteres');
  }
  
  if (!environmentType) {
    errors.push('El tipo de ambiente es requerido');
  }
  
  const validTypes = ['nest', 'community', 'house', 'lower', 'upper', 'adolescence', 'high'];
  if (environmentType && !validTypes.includes(environmentType)) {
    errors.push('El tipo de ambiente no es válido');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

/**
 * Formatea los datos del ambiente para mostrar en la interfaz
 * @param {Object} environment - Objeto ambiente
 * @returns {Object} - Ambiente formateado
 */
export const formatEnvironmentForDisplay = (environment) => {
  return {
    ...environment,
    name: environment.title, // Mapear title a name para compatibilidad con el frontend
    type: environment.environment_type, // Mapear environment_type a type para compatibilidad
    typeLabel: getEnvironmentTypeLabel(environment.environment_type),
    createdAtFormatted: environment.created_at ? 
      new Date(environment.created_at).toLocaleDateString('es-ES') : '',
    updatedAtFormatted: environment.updated_at ? 
      new Date(environment.updated_at).toLocaleDateString('es-ES') : ''
  };
};

/**
 * Transforma los datos del frontend al formato del backend
 * @param {Object} frontendData - Datos del formulario del frontend
 * @returns {Object} - Datos formateados para el backend
 */
export const transformToBackendFormat = (frontendData) => {
  return {
    title: frontendData.name || frontendData.title,
    environment_type: frontendData.type || frontendData.environment_type
  };
};

/**
 * Transforma los datos del backend al formato del frontend
 * @param {Object} backendData - Datos del backend
 * @returns {Object} - Datos formateados para el frontend
 */
export const transformToFrontendFormat = (backendData) => {
  return {
    ...backendData,
    name: backendData.title,
    type: backendData.environment_type
  };
};
