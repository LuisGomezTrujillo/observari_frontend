import { apiClient } from "./api";

// Prefijo de URL para las operaciones de usuarios
const URL = "/api/users";

/**
 * Crear un nuevo usuario
 * @param {Object} data - Datos del usuario a crear
 * @returns {Promise} Promesa con la respuesta
 */
export const createUser = async (data) => {
  try {
    const response = await apiClient.post(URL, data);
    return response.data;
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
};

/**
 * Obtener lista de usuarios con paginación
 * @param {Number} skip - Cantidad de registros a saltar
 * @param {Number} limit - Cantidad máxima de registros a devolver
 * @returns {Promise} Promesa con la lista de usuarios
 */
export const getUsers = async (skip = 0, limit = 10) => {
  try {
    // Asegurar que los parámetros sean números válidos
    const validSkip = isNaN(parseInt(skip)) ? 0 : parseInt(skip);
    const validLimit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);
    
    const response = await apiClient.get(`${URL}?skip=${validSkip}&limit=${validLimit}`);
    
    // Devolver los datos directamente, confiando en que el backend devuelve un array
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

/**
 * Obtener un usuario por su ID
 * @param {String|Number} id - ID del usuario
 * @returns {Promise} Promesa con los datos del usuario
 */
export const getUserById = async (id) => {
  if (!id) {
    throw new Error("ID de usuario no proporcionado");
  }
  
  try {
    // Asegurarse de que la URL esté correctamente formada
    const userId = String(id).trim();
    const url = `${URL}/${userId}`;
    
    console.log("Solicitando usuario con URL:", url);
    
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener usuario con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Obtener información del usuario actualmente autenticado
 * @returns {Promise} Promesa con los datos del usuario actual
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get(`${URL}/me`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el usuario actual:", error);
    throw error;
  }
};

/**
 * Actualizar un usuario existente
 * @param {String|Number} id - ID del usuario a actualizar
 * @param {Object} data - Datos a actualizar (solo email)
 * @returns {Promise} Promesa con la respuesta
 */
export const updateUser = async (id, data) => {
  if (!id) {
    throw new Error("ID de usuario no proporcionado para actualización");
  }
  
  try {
    // Convertir ID a string y eliminar espacios
    const userId = String(id).trim();
    const url = `${URL}/${userId}`;
    
    console.log("Actualizando usuario con URL:", url, "datos:", data);
    
    // Asegurarse de que solo enviamos los campos permitidos por el backend
    // Según el error, solo enviamos el email y eliminamos cualquier otro campo
    const updateData = {
      email: data.email
    };
    
    const response = await apiClient.put(url, updateData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar usuario con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Eliminar un usuario
 * @param {String|Number} id - ID del usuario a eliminar
 * @returns {Promise} Promesa con la respuesta
 */
export const deleteUser = async (id) => {
  if (!id) {
    throw new Error("ID de usuario no proporcionado para eliminación");
  }
  
  try {
    // Convertir ID a string y eliminar espacios
    const userId = String(id).trim();
    const url = `${URL}/${userId}`;
    
    console.log("Eliminando usuario con URL:", url);
    
    const response = await apiClient.delete(url);
    // Para respuestas 204 No Content, devolvemos un objeto vacío
    return response.data || {};
  } catch (error) {
    console.error(`Error al eliminar usuario con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Autenticar un usuario
 * @param {String} email - Correo electrónico del usuario
 * @param {String} password - Contraseña del usuario
 * @returns {Promise} Promesa con los datos de autenticación
 */
export const loginUser = async (email, password) => {
  try {
    // Crear FormData para enviar las credenciales (requerido por OAuth2)
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await apiClient.post('/api/token', formData, {
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

/**
 * Cerrar sesión del usuario actual
 */
export const logoutUser = () => {
  localStorage.removeItem('user_token');
  // Disparar evento para que otros componentes sepan que se cerró sesión
  window.dispatchEvent(new CustomEvent('auth:logout'));
};

// import { apiClient } from "./api";

// // Prefijo de URL para las operaciones de usuarios
// const URL = "/api/users";

// /**
//  * Crear un nuevo usuario
//  * @param {Object} data - Datos del usuario a crear
//  * @returns {Promise} Promesa con la respuesta
//  */
// export const createUser = async (data) => {
//   try {
//     const response = await apiClient.post(URL, data);
//     return response.data;
//   } catch (error) {
//     console.error("Error al crear usuario:", error);
//     throw error;
//   }
// };

// /**
//  * Obtener lista de usuarios con paginación
//  * @param {Number} skip - Cantidad de registros a saltar
//  * @param {Number} limit - Cantidad máxima de registros a devolver
//  * @returns {Promise} Promesa con la lista de usuarios
//  */
// export const getUsers = async (skip = 0, limit = 10) => {
//   try {
//     // Asegurar que los parámetros sean números válidos
//     const validSkip = isNaN(parseInt(skip)) ? 0 : parseInt(skip);
//     const validLimit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);
    
//     const response = await apiClient.get(`${URL}?skip=${validSkip}&limit=${validLimit}`);
    
//     // Devolver los datos directamente, confiando en que el backend devuelve un array
//     return response.data;
//   } catch (error) {
//     console.error("Error al obtener usuarios:", error);
//     throw error;
//   }
// };

// /**
//  * Obtener un usuario por su ID
//  * @param {String|Number} id - ID del usuario
//  * @returns {Promise} Promesa con los datos del usuario
//  */
// export const getUserById = async (id) => {
//   if (!id) {
//     throw new Error("ID de usuario no proporcionado");
//   }
  
//   try {
//     // Asegurarse de que la URL esté correctamente formada
//     const userId = String(id).trim();
//     const url = `${URL}/${userId}`;
    
//     console.log("Solicitando usuario con URL:", url);
    
//     const response = await apiClient.get(url);
//     return response.data;
//   } catch (error) {
//     console.error(`Error al obtener usuario con ID ${id}:`, error);
//     throw error;
//   }
// };

// /**
//  * Obtener información del usuario actualmente autenticado
//  * @returns {Promise} Promesa con los datos del usuario actual
//  */
// export const getCurrentUser = async () => {
//   try {
//     const response = await apiClient.get(`${URL}/me`);
//     return response.data;
//   } catch (error) {
//     console.error("Error al obtener el usuario actual:", error);
//     throw error;
//   }
// };

// /**
//  * Actualizar un usuario existente
//  * @param {String|Number} id - ID del usuario a actualizar
//  * @param {Object} data - Datos a actualizar (email, role)
//  * @returns {Promise} Promesa con la respuesta
//  */
// export const updateUser = async (id, data) => {
//   if (!id) {
//     throw new Error("ID de usuario no proporcionado para actualización");
//   }
  
//   try {
//     // Convertir ID a string y eliminar espacios
//     const userId = String(id).trim();
//     const url = `${URL}/${userId}`;
    
//     console.log("Actualizando usuario con URL:", url, "datos:", data);
    
//     // Asegurarse de que solo enviamos los campos permitidos
//     const updateData = {
//       email: data.email,
//       role: data.role
//     };
    
//     const response = await apiClient.put(url, updateData);
//     return response.data;
//   } catch (error) {
//     console.error(`Error al actualizar usuario con ID ${id}:`, error);
//     throw error;
//   }
// };

// /**
//  * Eliminar un usuario
//  * @param {String|Number} id - ID del usuario a eliminar
//  * @returns {Promise} Promesa con la respuesta
//  */
// export const deleteUser = async (id) => {
//   if (!id) {
//     throw new Error("ID de usuario no proporcionado para eliminación");
//   }
  
//   try {
//     // Convertir ID a string y eliminar espacios
//     const userId = String(id).trim();
//     const url = `${URL}/${userId}`;
    
//     console.log("Eliminando usuario con URL:", url);
    
//     const response = await apiClient.delete(url);
//     // Para respuestas 204 No Content, devolvemos un objeto vacío
//     return response.data || {};
//   } catch (error) {
//     console.error(`Error al eliminar usuario con ID ${id}:`, error);
//     throw error;
//   }
// };

// /**
//  * Autenticar un usuario
//  * @param {String} email - Correo electrónico del usuario
//  * @param {String} password - Contraseña del usuario
//  * @returns {Promise} Promesa con los datos de autenticación
//  */
// export const loginUser = async (email, password) => {
//   try {
//     // Crear FormData para enviar las credenciales (requerido por OAuth2)
//     const formData = new URLSearchParams();
//     formData.append('username', email);
//     formData.append('password', password);
    
//     const response = await apiClient.post('/api/token', formData, {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       }
//     });
    
//     // Guardar el token en localStorage
//     if (response.data.access_token) {
//       localStorage.setItem('user_token', response.data.access_token);
//     }
    
//     return response.data;
//   } catch (error) {
//     console.error("Error al iniciar sesión:", error);
//     throw error;
//   }
// };

// /**
//  * Cerrar sesión del usuario actual
//  */
// export const logoutUser = () => {
//   localStorage.removeItem('user_token');
//   // Disparar evento para que otros componentes sepan que se cerró sesión
//   window.dispatchEvent(new CustomEvent('auth:logout'));
// };

