import { apiClient } from './api.js';

/**
 * Servicio para manejar operaciones CRUD de áreas
 * Conecta con el backend FastAPI usando los endpoints definidos en area.py
 */
export class AreasService {
  
  /**
   * Crear una nueva área
   * @param {Object} areaData - Datos del área a crear
   * @param {string} areaData.title - Título del área
   * @param {string} areaData.area_type - Tipo de área (según enum AreaType)
   * @param {number} areaData.environment_id - ID del ambiente al que pertenece
   * @returns {Promise<Object>} Área creada con su ID
   */
  static async createArea(areaData) {
    try {
      console.log('Creando área:', areaData);
      
      const response = await apiClient.post('/api/areas/', areaData);
      
      console.log('Área creada exitosamente:', response.data);
      return {
        success: true,
        data: response.data,
        message: 'Área creada exitosamente'
      };
    } catch (error) {
      console.error('Error al crear área:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
        message: 'Error al crear el área'
      };
    }
  }

  /**
   * Obtener todas las áreas
   * @returns {Promise<Array>} Lista de todas las áreas
   */
  static async getAllAreas() {
    try {
      console.log('Obteniendo todas las áreas...');
      
      const response = await apiClient.get('/api/areas/');
      
      console.log(`Se obtuvieron ${response.data.length} áreas`);
      return {
        success: true,
        data: response.data,
        message: 'Áreas obtenidas exitosamente'
      };
    } catch (error) {
      console.error('Error al obtener áreas:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
        message: 'Error al obtener las áreas'
      };
    }
  }

  /**
   * Obtener un área específica por ID
   * @param {number} areaId - ID del área a obtener
   * @returns {Promise<Object>} Datos del área
   */
  static async getAreaById(areaId) {
    try {
      console.log('Obteniendo área con ID:', areaId);
      
      const response = await apiClient.get(`/api/areas/${areaId}`);
      
      console.log('Área obtenida:', response.data);
      return {
        success: true,
        data: response.data,
        message: 'Área obtenida exitosamente'
      };
    } catch (error) {
      console.error('Error al obtener área:', error);
      
      // Manejo específico para área no encontrada
      if (error.response?.status === 404) {
        return {
          success: false,
          error: 'Área no encontrada',
          message: 'El área solicitada no existe'
        };
      }
      
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
        message: 'Error al obtener el área'
      };
    }
  }

  /**
   * Actualizar un área existente
   * @param {number} areaId - ID del área a actualizar
   * @param {Object} updateData - Datos a actualizar (campos opcionales)
   * @param {string} [updateData.title] - Nuevo título del área
   * @param {string} [updateData.area_type] - Nuevo tipo de área
   * @param {number} [updateData.environment_id] - Nuevo ID del ambiente
   * @returns {Promise<Object>} Área actualizada
   */
  static async updateArea(areaId, updateData) {
    try {
      console.log('Actualizando área:', areaId, updateData);
      
      // Filtrar campos undefined para enviar solo los campos que se van a actualizar
      const cleanUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined && value !== null)
      );
      
      const response = await apiClient.patch(`/api/areas/${areaId}`, cleanUpdateData);
      
      console.log('Área actualizada exitosamente:', response.data);
      return {
        success: true,
        data: response.data,
        message: 'Área actualizada exitosamente'
      };
    } catch (error) {
      console.error('Error al actualizar área:', error);
      
      // Manejo específico para área no encontrada
      if (error.response?.status === 404) {
        return {
          success: false,
          error: 'Área no encontrada',
          message: 'El área que intenta actualizar no existe'
        };
      }
      
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
        message: 'Error al actualizar el área'
      };
    }
  }

  /**
   * Eliminar un área
   * @param {number} areaId - ID del área a eliminar
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  static async deleteArea(areaId) {
    try {
      console.log('Eliminando área con ID:', areaId);
      
      await apiClient.delete(`/api/areas/${areaId}`);
      
      console.log('Área eliminada exitosamente');
      return {
        success: true,
        message: 'Área eliminada exitosamente'
      };
    } catch (error) {
      console.error('Error al eliminar área:', error);
      
      // Manejo específico para área no encontrada
      if (error.response?.status === 404) {
        return {
          success: false,
          error: 'Área no encontrada',
          message: 'El área que intenta eliminar no existe'
        };
      }
      
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
        message: 'Error al eliminar el área'
      };
    }
  }

  /**
   * Obtener áreas filtradas por ambiente
   * @param {number} environmentId - ID del ambiente
   * @returns {Promise<Array>} Lista de áreas del ambiente especificado
   */
  static async getAreasByEnvironment(environmentId) {
    try {
      console.log('Obteniendo áreas del ambiente:', environmentId);
      
      const response = await apiClient.get('/api/areas/');
      
      // Filtrar áreas por environment_id en el frontend
      const filteredAreas = response.data.filter(area => area.environment_id === environmentId);
      
      console.log(`Se encontraron ${filteredAreas.length} áreas para el ambiente ${environmentId}`);
      return {
        success: true,
        data: filteredAreas,
        message: `Áreas del ambiente obtenidas exitosamente`
      };
    } catch (error) {
      console.error('Error al obtener áreas por ambiente:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
        message: 'Error al obtener las áreas del ambiente'
      };
    }
  }

  /**
   * Obtener áreas filtradas por tipo
   * @param {string} areaType - Tipo de área según enum AreaType
   * @returns {Promise<Array>} Lista de áreas del tipo especificado
   */
  static async getAreasByType(areaType) {
    try {
      console.log('Obteniendo áreas del tipo:', areaType);
      
      const response = await apiClient.get('/api/areas/');
      
      // Filtrar áreas por area_type en el frontend
      const filteredAreas = response.data.filter(area => area.area_type === areaType);
      
      console.log(`Se encontraron ${filteredAreas.length} áreas del tipo ${areaType}`);
      return {
        success: true,
        data: filteredAreas,
        message: `Áreas del tipo ${areaType} obtenidas exitosamente`
      };
    } catch (error) {
      console.error('Error al obtener áreas por tipo:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
        message: 'Error al obtener las áreas por tipo'
      };
    }
  }

  /**
   * Validar datos de área antes de enviar al backend
   * @param {Object} areaData - Datos del área a validar
   * @returns {Object} Resultado de la validación
   */
  static validateAreaData(areaData) {
    const errors = [];

    // Validar título
    if (!areaData.title || typeof areaData.title !== 'string' || areaData.title.trim().length === 0) {
      errors.push('El título es requerido y debe ser una cadena no vacía');
    }

    // Validar tipo de área
    if (!areaData.area_type || typeof areaData.area_type !== 'string') {
      errors.push('El tipo de área es requerido');
    }

    // Validar ID del ambiente
    if (!areaData.environment_id || !Number.isInteger(areaData.environment_id) || areaData.environment_id <= 0) {
      errors.push('El ID del ambiente es requerido y debe ser un número entero positivo');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Exportar también como default para mayor flexibilidad
//export default AreasService;