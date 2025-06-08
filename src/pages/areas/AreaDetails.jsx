import React, { useState, useEffect } from "react";
import { getAreaById } from "../../services/areasService";
import { Modal } from "../../components/molecules/Modal";

export const AreaDetails = ({ isOpen, onClose, areaId }) => {
  const [area, setArea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAreaDetails = async () => {
      if (!areaId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Obtener los detalles del área
        const areaData = await getAreaById(areaId, setError);
        setArea(areaData);
      } catch (err) {
        console.error("Error al cargar detalles del área:", err);
        setError("Error al cargar los detalles del área. Por favor intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && areaId) {
      fetchAreaDetails();
    }
  }, [isOpen, areaId]);

  // Función para formatear la fecha en formato legible
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Área">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : area ? (
        <div className="space-y-4">
          {/* Información del Área */}
          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">Información del Área</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-500">Título</p>
                <p className="text-sm md:text-base mt-1">{area.title || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-500">Tipo</p>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {area.area_type || "N/A"}
                </span>
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-500">ID del Ambiente</p>
                <p className="text-sm md:text-base mt-1">{area.environment_id || "No asignado"}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs md:text-sm font-medium text-gray-500">Descripción</p>
                <p className="text-sm md:text-base mt-1 whitespace-pre-wrap">{area.description || "Sin descripción"}</p>
              </div>
            </div>
          </div>
          
          {/* Metadatos */}
          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">Metadatos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-500">ID del Área</p>
                <p className="text-sm md:text-base mt-1 break-all">{area.id}</p>
              </div>
              <div className="sm:col-span-2 md:col-span-1">
                <p className="text-xs md:text-sm font-medium text-gray-500">Fecha de Creación</p>
                <p className="text-sm md:text-base mt-1">{formatDate(area.created_at)}</p>
              </div>
              <div className="sm:col-span-2 md:col-span-1">
                <p className="text-xs md:text-sm font-medium text-gray-500">Última Actualización</p>
                <p className="text-sm md:text-base mt-1">{formatDate(area.updated_at)}</p>
              </div>
            </div>
          </div>
          
          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded hover:bg-gray-300 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No se encontraron detalles para esta área.
        </div>
      )}
    </Modal>
  );
};
