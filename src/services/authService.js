// authService.js
// Servicio para manejar operaciones de autenticación

import { apiClient } from './api';

// Función para registrar un nuevo usuario
export const registerUser = async (userData) => {
  try {
    console.log('Iniciando registro de usuario con datos:', userData);
    
    const response = await apiClient.post('/api/users', userData);
    
    console.log('Respuesta de registro exitoso:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error en el registro:', error);
    
    // Preparamos un objeto de respuesta de error detallado
    const errorResponse = {
      success: false,
      status: error.response?.status,
      message: error.response?.data?.detail || error.message,
      error: error.response?.data || error.message
    };
    
    console.error('Detalles del error:', errorResponse);
    return errorResponse;
  }
};

// Función para iniciar sesión
export const loginUser = async (username, password) => {
  try {
    // Para el login, FastAPI espera los datos en formato de formulario (x-www-form-urlencoded)
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    console.log('Intentando login con:', { username });
    
    const response = await apiClient.post('/api/token', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    console.log('Respuesta login exitoso:', response.data);
    
    // Guardamos el token en localStorage para uso futuro
    if (response.data.access_token) {
      localStorage.setItem('user_token', response.data.access_token);
    }
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error en el login:', error);
    return {
      success: false,
      status: error.response?.status,
      message: error.response?.data?.detail || error.message
    };
  }
};

// Función para solicitar restablecimiento de contraseña
export const requestPasswordReset = async (email) => {
  try {
    const response = await apiClient.post('/api/forgot-password', { email });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error al solicitar restablecimiento de contraseña:', error);
    return {
      success: false,
      status: error.response?.status,
      message: error.response?.data?.detail || error.message
    };
  }
};

// Función para verificar un token de restablecimiento
export const verifyResetToken = async (token) => {
  try {
    const response = await apiClient.get(`/api/verify-token/${token}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error al verificar token:', error);
    return {
      success: false,
      status: error.response?.status,
      message: error.response?.data?.detail || error.message
    };
  }
};

// Función para restablecer la contraseña
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await apiClient.post('/api/reset-password', {
      token,
      new_password: newPassword
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    return {
      success: false,
      status: error.response?.status,
      message: error.response?.data?.detail || error.message
    };
  }
};

// Función para cerrar sesión
export const logout = () => {
  localStorage.removeItem('user_token');
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = () => {
  return localStorage.getItem('user_token') !== null;
};

// Función para obtener el token actual
export const getToken = () => {
  return localStorage.getItem('user_token');
};

// Función para obtener información del usuario actual
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/api/users/me');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    
    // Si el error es 401, el token ha expirado o es inválido
    if (error.response?.status === 401) {
      // Limpiar el token inválido
      localStorage.removeItem('user_token');
    }
    
    return {
      success: false,
      status: error.response?.status,
      message: error.response?.data?.detail || error.message
    };
  }
};