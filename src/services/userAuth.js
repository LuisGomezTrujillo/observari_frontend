// /api/userAuth.js
import axios from 'axios';
const URL = 'http://localhost:8000/auth';

export const createUserAuth = (data) => axios.post(`${URL}/`, data);
export const getUserAuths = () => axios.get(`${URL}/`);
export const getUserAuthById = (id) => axios.get(`${URL}/${id}`);
export const deleteUserAuth = (id) => axios.delete(`${URL}/${id}`);