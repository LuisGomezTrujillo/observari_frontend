import { apiClient } from "./api";

const URL = "api/profiles";

export const createProfile = async (data) => {
  try {
    const response = await apiClient.post(`${URL}`, data);
    return response.data;
  } catch (error) {
    console.error("Error al crear el perfil:", error);
    throw error;
  }
};

export const getProfiles = async () => {
  try {
    const response = await apiClient.get(`${URL}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener perfiles:", error);
    throw error;
  }
};

export const getProfileById = async (id) => {
  try {
    const response = await apiClient.get(`${URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    throw error;
  }
};

export const updateProfile = async (id, data) => {
  try {
    const response = await apiClient.patch(`${URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    throw error;
  }
};

export const deleteProfile = async (id) => {
  try {
    const response = await apiClient.delete(`${URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el perfil:", error);
    throw error;
  }
};

// Función auxiliar para validar datos del perfil antes del envío
export const validateProfileData = (profileData) => {
  const requiredFields = ['first_name', 'last_name', 'birth_date'];
  const missingFields = requiredFields.filter(field => !profileData[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
  }
  
  // Validar formato de fecha
  if (profileData.birth_date && !isValidDate(profileData.birth_date)) {
    throw new Error('Formato de fecha de nacimiento inválido. Use YYYY-MM-DD');
  }
  
  return true;
};

// Función auxiliar para validar formato de fecha
const isValidDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// Función auxiliar para formatear datos del perfil para el backend
export const formatProfileForBackend = (profileData) => {
  const formattedData = { ...profileData };
  
  // Asegurar que la fecha esté en formato ISO (YYYY-MM-DD)
  if (formattedData.birth_date && formattedData.birth_date instanceof Date) {
    formattedData.birth_date = formattedData.birth_date.toISOString().split('T')[0];
  }
  
  // Remover campos undefined o null innecesarios
  Object.keys(formattedData).forEach(key => {
    if (formattedData[key] === undefined || formattedData[key] === '') {
      delete formattedData[key];
    }
  });
  
  return formattedData;
};