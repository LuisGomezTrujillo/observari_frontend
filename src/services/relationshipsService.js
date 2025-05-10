import { apiClient } from "./api";

const BASE_URL = "/api/relationships";

/**
 * Crea una nueva relación entre usuarios
 * @param {Object} data - Datos de la relación
 * @param {number} data.user_id - ID del usuario origen
 * @param {number} data.related_user_id - ID del usuario destino
 * @param {string} data.relationship_type - Tipo de relación (friend, family, colleague, acquaintance, other)
 * @param {string} data.description - Descripción opcional de la relación
 * @returns {Promise<Object>} - La relación creada
 */
export const createRelationship = async (data) => {
  const response = await apiClient.post(BASE_URL, data);
  return response.data;
};

/**
 * Obtiene todas las relaciones (con paginación)
 * @param {number} skip - Número de registros a saltar (para paginación)
 * @param {number} limit - Límite de registros a devolver
 * @returns {Promise<Array>} - Lista de relaciones
 */
export const getRelationships = async (skip = 0, limit = 100) => {
  const response = await apiClient.get(`${BASE_URL}?skip=${skip}&limit=${limit}`);
  return response.data;
};

/**
 * Obtiene todas las relaciones de un usuario específico
 * @param {number} userId - ID del usuario
 * @returns {Promise<Array>} - Lista de relaciones del usuario
 */
export const getUserRelationships = async (userId) => {
  const response = await apiClient.get(`${BASE_URL}/user/${userId}`);
  return response.data;
};

/**
 * Obtiene una relación específica por su ID
 * @param {number} relationshipId - ID de la relación
 * @returns {Promise<Object>} - La relación encontrada
 */
export const getRelationshipById = async (relationshipId) => {
  const response = await apiClient.get(`${BASE_URL}/${relationshipId}`);
  return response.data;
};

/**
 * Actualiza una relación existente
 * @param {number} relationshipId - ID de la relación a actualizar
 * @param {Object} data - Datos a actualizar
 * @param {string} [data.relationship_type] - Tipo de relación (opcional)
 * @param {string} [data.description] - Descripción de la relación (opcional)
 * @returns {Promise<Object>} - La relación actualizada
 */
export const updateRelationship = async (relationshipId, data) => {
  const response = await apiClient.patch(`${BASE_URL}/${relationshipId}`, data);
  return response.data;
};

/**
 * Elimina una relación existente
 * @param {number} relationshipId - ID de la relación a eliminar
 * @returns {Promise<void>}
 */
export const deleteRelationship = async (relationshipId) => {
  await apiClient.delete(`${BASE_URL}/${relationshipId}`);
  return true;
};

/**
 * Obtiene la relación entre dos usuarios específicos
 * @param {number} userId - ID del usuario origen
 * @param {number} relatedUserId - ID del usuario destino
 * @returns {Promise<Object>} - La relación encontrada entre ambos usuarios
 */
export const getRelationshipBetweenUsers = async (userId, relatedUserId) => {
  const response = await apiClient.get(`${BASE_URL}/between/${userId}/${relatedUserId}`);
  return response.data;
};

/**
 * Obtiene las relaciones mutuas de un usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<Array>} - Lista de relaciones mutuas
 */
export const getMutualRelationships = async (userId) => {
  const response = await apiClient.get(`${BASE_URL}/mutual/${userId}`);
  return response.data;
};

/**
 * Convierte un tipo de relación a un formato legible
 * @param {string} type - Tipo de relación (friend, family, colleague, acquaintance, other)
 * @returns {string} - Etiqueta legible en español
 */
export const getRelationshipTypeLabel = (type) => {
  const labels = {
    friend: 'Amigo',
    family: 'Familiar',
    colleague: 'Colega',
    acquaintance: 'Conocido',
    other: 'Otro'
  };
  
  return labels[type] || 'Desconocido';
};

/**
 * Obtiene todas las opciones de tipos de relación disponibles
 * @returns {Array} - Lista de opciones para formularios
 */
export const getRelationshipTypeOptions = () => {
  return [
    { value: 'learner', label: 'Aprendiz' },
    { value: 'guide', label: 'Guía' },
    { value: 'assistant', label: 'Asistente' },
    { value: 'administrator', label: 'Coordinador' },
    { value: 'family', label: 'Familiar' },
    { value: 'sponsor', label: 'Benefactor' }
  ];
};
