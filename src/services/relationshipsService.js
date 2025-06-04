import { apiClient } from "./api";

const BASE_URL = "/api/relationships";

/**
 * Crea una nueva relación entre usuarios
 * @param {Object} data - Datos de la relación
 * @param {number} data.user_id - ID del usuario origen
 * @param {number} data.related_user_id - ID del usuario destino
 * @param {string} data.relationship_type - Tipo de relación (team, classmate, family, sponsor)
 * @param {string} [data.description] - Descripción opcional de la relación
 * @returns {Promise<Object>} - La relación creada
 */
export const createRelationship = async (data) => {
  const response = await apiClient.post(BASE_URL, data);
  return response.data;
};

/**
 * Obtiene todas las relaciones
 * @returns {Promise<Array>} - Lista de relaciones
 */
export const getRelationships = async () => {
  const response = await apiClient.get(BASE_URL);
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
 * @returns {Promise<Object>} - Respuesta de confirmación
 */
export const deleteRelationship = async (relationshipId) => {
  const response = await apiClient.delete(`${BASE_URL}/${relationshipId}`);
  return response.data;
};

/**
 * Convierte un tipo de relación a un formato legible
 * @param {string} type - Tipo de relación (team, classmate, family, sponsor)
 * @returns {string} - Etiqueta legible en español
 */
export const getRelationshipTypeLabel = (type) => {
  const labels = {
    team: 'Equipo Casa del Bambino',
    classmate: 'Compañero aprendiz',
    family: 'Familiar',
    sponsor: 'Padrino, Madrina o Patrocinador',
  };
  
  return labels[type] || 'Desconocido';
};

/**
 * Obtiene todas las opciones de tipos de relación disponibles
 * @returns {Array} - Lista de opciones para formularios
 */
export const getRelationshipTypeOptions = () => {
  return [
    { value: 'team', label: 'Equipo Casa del Bambino' },
    { value: 'classmate', label: 'Compañero aprendiz' },
    { value: 'family', label: 'Familiar' },
    { value: 'sponsor', label: 'Padrino o Madrina' }
  ];
};