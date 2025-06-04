import { apiClient } from "./api";

const URL = "api/environments";

/**
 * Crea un nuevo ambiente
 * @param {Object} data - Datos del ambiente
 * @param {string} data.title - Título del ambiente
 * @param {string} data.environment_type - Tipo de ambiente
 * @param {string} data.environment_status - Estado del ambiente
 * @param {string} data.location - Ubicación del ambiente
 * @param {string} data.availability - Disponibilidad del ambiente
 * @param {number} data.capacity - Capacidad del ambiente
 * @param {string} [data.description] - Descripción del ambiente (opcional)
 * @param {string} [data.photo_url] - URL de la foto del ambiente (opcional)
 * @returns {Promise<Object>} - El ambiente creado
 */
export const createEnvironment = async (data) => {
  try {
    // Validar que los campos requeridos estén presentes
    validateEnvironmentData(data);
    
    const formattedData = formatEnvironmentForBackend(data);
    const response = await apiClient.post(`${URL}`, formattedData);
    return response.data;
  } catch (error) {
    console.error("Error al crear el ambiente:", error);
    throw error;
  }
};

/**
 * Obtiene todos los ambientes
 * @returns {Promise<Array>} - Lista de ambientes
 */
export const getEnvironments = async () => {
  try {
    const response = await apiClient.get(`${URL}`);
    return response.data.map(env => formatEnvironmentForDisplay(env));
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
    const response = await apiClient.get(`${URL}/${environmentId}`);
    return formatEnvironmentForDisplay(response.data);
  } catch (error) {
    console.error("Error al obtener el ambiente:", error);
    throw error;
  }
};

/**
 * Actualiza un ambiente existente
 * @param {number} environmentId - ID del ambiente a actualizar
 * @param {Object} data - Datos a actualizar
 * @param {string} [data.title] - Título del ambiente (opcional)
 * @param {string} [data.environment_type] - Tipo de ambiente (opcional)
 * @param {string} [data.environment_status] - Estado del ambiente (opcional)
 * @param {string} [data.location] - Ubicación del ambiente (opcional)
 * @param {string} [data.availability] - Disponibilidad del ambiente (opcional)
 * @param {number} [data.capacity] - Capacidad del ambiente (opcional)
 * @param {string} [data.description] - Descripción del ambiente (opcional)
 * @param {string} [data.photo_url] - URL de la foto del ambiente (opcional)
 * @returns {Promise<Object>} - El ambiente actualizado
 */
export const updateEnvironment = async (environmentId, data) => {
  try {
    validateEnvironmentData(data, true);
    
    const formattedData = formatEnvironmentForBackend(data);
    const response = await apiClient.patch(`${URL}/${environmentId}`, formattedData);
    return formatEnvironmentForDisplay(response.data);
  } catch (error) {
    console.error("Error al actualizar el ambiente:", error);
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
    const response = await apiClient.delete(`${URL}/${environmentId}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el ambiente:", error);
    throw error;
  }
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
 * Obtiene los ambientes por estado
 * @param {string} status - Estado de ambiente a filtrar
 * @returns {Promise<Array>} - Lista de ambientes del estado especificado
 */
export const getEnvironmentsByStatus = async (status) => {
  const environments = await getEnvironments();
  return environments.filter(env => env.environment_status === status);
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
    env.title.toLowerCase().includes(searchTerm) ||
    (env.description && env.description.toLowerCase().includes(searchTerm)) ||
    (env.location && env.location.toLowerCase().includes(searchTerm))
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
 * Convierte un estado de ambiente a un formato legible
 * @param {string} status - Estado de ambiente
 * @returns {string} - Etiqueta legible en español
 */
export const getEnvironmentStatusLabel = (status) => {
  const labels = {
    active: 'Activo',
    inactive: 'Inactivo',
  maintenance: 'En Mantenimiento',
    planned: 'Planificado',
    reserved: 'Reservado'
  };
  
  return labels[status] || 'Desconocido';
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
 * Obtiene todas las opciones de estados de ambiente disponibles
 * @returns {Array} - Lista de opciones para formularios
 */
export const getEnvironmentStatusOptions = () => {
  return [    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' },
    { value: 'maintenance', label: 'En Mantenimiento' },
    { value: 'planned', label: 'Planificado' },
    { value: 'reserved', label: 'Reservado' }
  ];
};

/**
 * Valida los datos de un ambiente antes de enviarlos
 * @param {Object} data - Datos del ambiente a validar
 * @param {boolean} isUpdate - Si es una actualización (campos opcionales)
 * @returns {boolean} - true si es válido, lanza error si no
 */
export const validateEnvironmentData = (data, isUpdate = false) => {
  const requiredFields = isUpdate ? [] : ['title', 'environment_type', 'environment_status', 'location', 'availability', 'capacity'];
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
  }
  
  // Validaciones específicas
  if (data.title && data.title.length > 100) {
    throw new Error('El título del ambiente no puede exceder 100 caracteres');
  }
  
  const validTypes = ['nest', 'community', 'house', 'lower', 'upper', 'adolescence', 'high'];
  if (data.environment_type && !validTypes.includes(data.environment_type)) {
    throw new Error('El tipo de ambiente no es válido');
  }
    const validStatuses = ['active', 'inactive', 'maintenance', 'planned', 'reserved'];
  if (data.environment_status && !validStatuses.includes(data.environment_status)) {
    throw new Error('El estado del ambiente no es válido');
  }
  
  if (data.capacity !== undefined && data.capacity !== null) {
    if (!Number.isInteger(data.capacity) || data.capacity < 1) {
      throw new Error('La capacidad debe ser un número entero mayor a 0');
    }
    if (data.capacity > 1000) {
      throw new Error('La capacidad no puede exceder 1000 personas');
    }
  }
  
  if (data.description && data.description.length > 1000) {
    throw new Error('La descripción no puede exceder 1000 caracteres');
  }
  
  if (data.photo_url && data.photo_url.length > 500) {
    throw new Error('La URL de la foto no puede exceder 500 caracteres');
  }
  
  return true;
};

/**
 * Formatea los datos del ambiente para mostrar en la interfaz
 * @param {Object} environment - Objeto ambiente del backend
 * @returns {Object} - Ambiente formateado para el frontend
 */
export const formatEnvironmentForDisplay = (environment) => {
  return {
    ...environment,
    typeLabel: getEnvironmentTypeLabel(environment.environment_type),
    statusLabel: getEnvironmentStatusLabel(environment.environment_status),
    createdAtFormatted: environment.created_at ? 
      formatDateTime(environment.created_at) : '',
    updatedAtFormatted: environment.updated_at ? 
      formatDateTime(environment.updated_at) : '',
    capacityFormatted: environment.capacity ? 
      `${environment.capacity} ${environment.capacity === 1 ? 'persona' : 'personas'}` : ''
  };
};

/**
 * Formatea los datos del ambiente para el backend
 * @param {Object} environmentData - Datos del formulario del frontend
 * @returns {Object} - Datos formateados para el backend
 */
export const formatEnvironmentForBackend = (environmentData) => {
  const formattedData = { ...environmentData };
  
  // Remover campos undefined, null o vacíos innecesarios
  Object.keys(formattedData).forEach(key => {
    if (formattedData[key] === undefined || formattedData[key] === null || formattedData[key] === '') {
      delete formattedData[key];
    }
  });
  
  return formattedData;
};

/**
 * Función auxiliar para formatear fechas y horas
 * @param {string} dateTimeString - String de fecha/hora del backend
 * @returns {string} - Fecha formateada en español
 */
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  
  try {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return '';
  }
};

/**
 * Transforma los datos del frontend al formato del backend (mantenido para compatibilidad)
 * @param {Object} frontendData - Datos del formulario del frontend
 * @param {boolean} isUpdate - Si es una actualización (omite campos undefined)
 * @returns {Object} - Datos formateados para el backend
 */
export const transformToBackendFormat = (frontendData, isUpdate = false) => {
  return formatEnvironmentForBackend(frontendData);
};

/**
 * Transforma los datos del backend al formato del frontend
 * @param {Object} backendData - Datos del backend
 * @returns {Object} - Datos formateados para el frontend
 */
export const transformToFrontendFormat = (backendData) => {
  return {
    ...backendData,
    // Agregar aliases para compatibilidad con versiones anteriores del frontend
    name: backendData.title,
    type: backendData.environment_type,
    status: backendData.environment_status
  };
};

/**
 * Obtiene estadísticas básicas de los ambientes
 * @returns {Promise<Object>} - Estadísticas de ambientes
 */
export const getEnvironmentStats = async () => {
  const environments = await getEnvironments();
  
  const stats = {
    total: environments.length,
    byType: {},
    byStatus: {},
    totalCapacity: 0,
    averageCapacity: 0
  };
  
  environments.forEach(env => {
    // Contar por tipo
    const typeLabel = getEnvironmentTypeLabel(env.environment_type);
    stats.byType[typeLabel] = (stats.byType[typeLabel] || 0) + 1;
    
    // Contar por estado
    const statusLabel = getEnvironmentStatusLabel(env.environment_status);
    stats.byStatus[statusLabel] = (stats.byStatus[statusLabel] || 0) + 1;
    
    // Sumar capacidades
    stats.totalCapacity += env.capacity || 0;
  });
  
  stats.averageCapacity = stats.total > 0 ? 
    Math.round(stats.totalCapacity / stats.total) : 0;
  
  return stats;
};

// Mantener funciones de compatibilidad con versiones anteriores
export const getActiveEnvironments = async () => {
  return await getEnvironmentsByStatus('active');
};