import { apiClient } from "./api";

const URL = "/user-relationships";

export const createUserRelationship = async (data) => {
  const res = await apiClient.post(`${URL}`, data);
  return res.data;
};

export const getUserRelationships = async () => {
  const res = await apiClient.get(`${URL}`);
  return res.data;
};

export const getUserRelationshipById = async (id) => {
  const res = await apiClient.get(`${URL}/${id}`);
  return res.data;
};

export const deleteUserRelationship = async (id) => {
  const res = await apiClient.delete(`${URL}/${id}`);
  return res.data;
};