import { apiClient } from "./api";

const URL = "/users";

export const createUser = async (data) => {
  try {
    const response = await apiClient.post(`${URL}`, data);
    return response.data;
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await apiClient.get(`${URL}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await apiClient.get(`${URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    throw error;
  }
};


export const updateUser = async (id, data) => {
  try {
    const response = await apiClient.patch(`${URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`${URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    throw error;
  }
};
