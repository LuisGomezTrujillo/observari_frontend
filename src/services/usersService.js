import { apiClient } from "./api";

// Cambiado para usar el prefijo /api que usa el backend
const URL = "/api/users";

export const createUser = async (data) => {
  try {
    const response = await apiClient.post(URL, data);
    return response.data;
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
};

export const getUsers = async (skip = 0, limit = 100) => {
  try {
    // Agregados parámetros de paginación según el backend
    const response = await apiClient.get(`${URL}?skip=${skip}&limit=${limit}`);
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

// Obtener información del usuario actualmente autenticado
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get(`${URL}/me`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el usuario actual:", error);
    throw error;
  }
};

export const updateUser = async (id, data) => {
  try {
    // El backend podría estar usando PUT en lugar de PATCH, ajustado por compatibilidad
    const response = await apiClient.put(`${URL}/${id}`, data);
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

// Función para autenticación de usuarios
export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post('/api/token', {
      username: email, // El backend usa 'username' según OAuth2PasswordBearer
      password: password
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    // Guardar el token en localStorage
    if (response.data.access_token) {
      localStorage.setItem('user_token', response.data.access_token);
    }
    
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

// Función para cerrar sesión
export const logoutUser = () => {
  localStorage.removeItem('user_token');
  // Disparar evento para que otros componentes sepan que se cerró sesión
  window.dispatchEvent(new CustomEvent('auth:logout'));
};
// import { apiClient } from "./api";

// const URL = "/users";

// export const createUser = async (data) => {
//   try {
//     const response = await apiClient.post(`${URL}`, data);
//     return response.data;
//   } catch (error) {
//     console.error("Error al crear usuario:", error);
//     throw error;
//   }
// };

// export const getUsers = async () => {
//   try {
//     const response = await apiClient.get(`${URL}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error al obtener usuarios:", error);
//     throw error;
//   }
// };

// export const getUserById = async (id) => {
//   try {
//     const response = await apiClient.get(`${URL}/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error al obtener el usuario:", error);
//     throw error;
//   }
// };


// export const updateUser = async (id, data) => {
//   try {
//     const response = await apiClient.patch(`${URL}/${id}`, data);
//     return response.data;
//   } catch (error) {
//     console.error("Error al actualizar el usuario:", error);
//     throw error;
//   }
// };

// export const deleteUser = async (id) => {
//   try {
//     const response = await apiClient.delete(`${URL}/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error al eliminar el usuario:", error);
//     throw error;
//   }
// };
