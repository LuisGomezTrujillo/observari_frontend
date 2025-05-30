import { apiClient } from "./api";

const BASE_URL = "/api/environments/";

/**
 * Crea un nuevo ambiente
 * @param {Object} data - Datos del ambiente
 * @param {string} data.title - Título del ambiente
 * @param {string} data.environment_type - Tipo de ambiente
 * @returns {Promise<Object>} - El ambiente creado
 */
export const createEnvironment = async (data) => {
  try {
    // Mapear los datos del frontend al formato esperado por el backend
    const backendData = {
      title: data.name || data.title,
      environment_type: data.type || data.environment_type,
      description: data.description,
      location: data.location,
      is_active: data.is_active !== false
    };
    
    const response = await apiClient.post(BASE_URL, backendData);
    return response.data;
  } catch (error) {
    console.error("Error al crear ambiente:", error);
    throw error;
  }
};

/**
 * Obtiene todos los ambientes
 * @returns {Promise<Array>} - Lista de ambientes
 */
export const getEnvironments = async () => {
  try {
    const response = await apiClient.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener ambientes:", error);
    throw error;
  }
};

/**
 * Obtiene un ambiente específico por su ID
 * @param {number} environmentId - ID del ambiente
 * @returns {Promise<Object>} - El ambiente encontrado
 */
export const getEnvironmentById = async (environmentId) => {
  try {
    const response = await apiClient.get(`${BASE_URL}/${environmentId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener ambiente:", error);
    throw error;
  }
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
  try {
    // Mapear los datos del frontend al formato esperado por el backend
    const backendData = {
      title: data.name || data.title,
      environment_type: data.type || data.environment_type,
      description: data.description,
      location: data.location,
      is_active: data.is_active !== false
    };
    
    // Eliminar propiedades undefined
    Object.keys(backendData).forEach(key => {
      if (backendData[key] === undefined) {
        delete backendData[key];
      }
    });
    
    const response = await apiClient.patch(`${BASE_URL}/${environmentId}`, backendData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar ambiente:", error);
    throw error;
  }
};

/**
 * Elimina un ambiente existente
 * @param {number} environmentId - ID del ambiente a eliminar
 * @returns {Promise<void>}
 */
export const deleteEnvironment = async (environmentId) => {
  try {
    await apiClient.delete(`${BASE_URL}/${environmentId}`);
    return true;
  } catch (error) {
    console.error("Error al eliminar ambiente:", error);
    throw error;
  }
};

/**
 * Obtiene la etiqueta legible de un tipo de ambiente
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
  return labels[type] || type || "No especificado";
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
  
  if (!data.location || data.location.trim().length === 0) {
    errors.push('La ubicación es requerida');
  }
  
  if (!data.description || data.description.trim().length === 0) {
    errors.push('La descripción es requerida');
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
    id: environment.id,
    name: environment.title || "Sin título",  // Mapear title a name
    type: environment.environment_type,  // Mantener el tipo original
    typeLabel: getEnvironmentTypeLabel(environment.environment_type),  // Etiqueta legible
    location: environment.location || "No especificada",
    description: environment.description || "Sin descripción",
    is_active: environment.is_active !== false,  // Defaultear a true si no existe
    created_at: environment.created_at,
    updated_at: environment.updated_at,
    createdAtFormatted: environment.created_at ? 
      new Date(environment.created_at).toLocaleDateString('es-ES') : '',
    updatedAtFormatted: environment.updated_at ? 
      new Date(environment.updated_at).toLocaleDateString('es-ES') : '',
    areas: environment.areas || [],
    activities: environment.activities || []
  };
};