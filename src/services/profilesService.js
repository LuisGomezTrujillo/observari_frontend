import { apiClient } from "./api";

const URL = "api/profiles";

export const createProfile = async (data) => {
  try{
    const response = await apiClient.post(`${URL}`, data);
    return response.data;
  } catch (error) {
    console.error("Error al crear el perfil:", error)
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

export const getProfilesByUserId = async (userId) => {
  try {
    const response = await apiClient.get(`${URL}/by_user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener perfiles por usuario:", error);
    throw error;
  }
};
