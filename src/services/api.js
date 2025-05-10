import axios from "axios";

// Obtener la URL base de la API desde las variables de entorno o usar un valor predeterminado
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Crear cliente axios con configuración base
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para añadir token de autenticación a las solicitudes
apiClient.interceptors.request.use(
  (config) => {
    // Obtener token del almacenamiento local
    const token = localStorage.getItem('user_token');
    
    // Si existe un token y no es una solicitud al endpoint de tokens, añadirlo
    if (token && !config.url.includes('/token')) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Registro de solicitudes para depuración
    console.log('Solicitud a:', `${config.baseURL}${config.url}`);
    console.log('Método:', config.method.toUpperCase());
    
    // Solo mostrar los datos de la solicitud si existen y no es una solicitud GET
    if (config.data && config.method !== 'get') {
      console.log('Datos:', config.data);
    }
    
    return config;
  },
  (error) => {
    console.error('Error en la solicitud:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => {
    // Registro de respuestas exitosas para depuración
    console.log('Respuesta exitosa de:', response.config.url);
    return response;
  },
  (error) => {
    // Registro detallado de errores para depuración
    const errorInfo = {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      mensaje: error.response?.data?.detail || error.message
    };
    
    console.error("Error en API:", errorInfo);
    
    // Si el error es 401 (No autorizado) y no es en el endpoint de token,
    // probablemente el token expiró o es inválido
    if (error.response?.status === 401 && !error.config.url.includes('/token')) {
      console.warn('Token inválido o expirado. Cerrando sesión...');
      localStorage.removeItem('user_token');
      
      // Emitir evento para que la aplicación pueda manejar el cierre de sesión
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    
    return Promise.reject(error);
  }
);
