// authService.js - Servicio mejorado para autenticación
import { apiClient } from './api';

/**
 * Registra un nuevo usuario en el sistema
 * @param {Object} userData Datos del usuario a registrar
 * @returns {Promise<Object>} Respuesta con el resultado del registro
 */
export const registerUser = async (userData) => {
  try {
    console.log('Iniciando registro de usuario con datos:', userData);
    
    const response = await apiClient.post('/api/users', userData);
    
    console.log('Respuesta de registro exitoso:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error en el registro:', error);
    
    return {
      success: false,
      status: error.response?.status,
      message: error.response?.data?.detail || error.message,
      error: error.response?.data || error.message
    };
  }
};

/**
 * Inicia sesión y obtiene un token de acceso
 * @param {string} email Correo electrónico del usuario
 * @param {string} password Contraseña del usuario
 * @returns {Promise<Object>} Token de acceso o error
 */
export const loginUser = async (email, password) => {
  try {
    // Para el login, FastAPI espera los datos en formato de formulario (x-www-form-urlencoded)
    const formData = new URLSearchParams();
    formData.append('username', email); // FastAPI OAuth2 espera 'username' aunque sea un email
    formData.append('password', password);
    
    console.log('Intentando login con:', { email });
    
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

/**
 * Solicita un restablecimiento de contraseña
 * @param {string} email Correo electrónico del usuario
 * @returns {Promise<Object>} Respuesta de la API
 */
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

/**
 * Verifica si un token de restablecimiento es válido
 * @param {string} token Token de restablecimiento
 * @returns {Promise<Object>} Respuesta de la API
 */
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

/**
 * Restablece la contraseña del usuario usando un token válido
 * @param {string} token Token de restablecimiento
 * @param {string} newPassword Nueva contraseña
 * @returns {Promise<Object>} Respuesta de la API
 */
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

/**
 * Cierra la sesión del usuario eliminando el token
 * @returns {Object} Resultado de la operación
 */
export const logoutUser = () => {
  localStorage.removeItem('user_token');
  // Disparar un evento que otros componentes pueden escuchar
  window.dispatchEvent(new CustomEvent('auth:logout'));
  return { success: true };
};

/**
 * Alias para logoutUser para mantener compatibilidad con código existente
 * @returns {Object} Resultado de la operación
 */
export const logout = logoutUser;

/**
 * Verifica si hay un usuario autenticado actualmente
 * @returns {boolean} True si hay un usuario autenticado
 */
export const isAuthenticated = () => {
  return localStorage.getItem('user_token') !== null;
};

/**
 * Obtiene el token actual del usuario
 * @returns {string|null} Token del usuario o null si no hay sesión
 */
export const getToken = () => {
  return localStorage.getItem('user_token');
};

/**
 * Obtiene la información del usuario actual
 * @returns {Promise<Object>} Datos del usuario o error
 */
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
      // Disparar evento de cierre de sesión
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    
    return {
      success: false,
      status: error.response?.status,
      message: error.response?.data?.detail || error.message
    };
  }
};
