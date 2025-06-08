import React, { useState, useEffect } from "react";
import { getMaterialById } from "../../services/materialsService";
import { Modal } from "../../components/molecules/Modal";

export const MaterialDetails = ({ isOpen, onClose, materialId }) => {
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaterialDetails = async () => {
      if (!materialId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Obtener los detalles del material
        const materialData = await getMaterialById(materialId, setError);
        setMaterial(materialData);
      } catch (err) {
        console.error("Error al cargar detalles del material:", err);
        setError("Error al cargar los detalles del material. Por favor intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && materialId) {
      fetchMaterialDetails();
    }
  }, [isOpen, materialId]);

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

  // Función para obtener el color y texto del estado
  const getStatusDisplay = (status) => {
    const statusConfig = {
      in_use: { bg: 'bg-green-100', text: 'text-green-800', label: 'En uso' },
      available: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Disponible' },
      repair: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En reparación' },
      discarded: { bg: 'bg-red-100', text: 'text-red-800', label: 'Descartado' }
    };

    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    return config;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Material">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : material ? (
        <div className="space-y-4">
          {/* Información del Material */}
          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">Información del Material</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-500">Título</p>
                <p className="text-sm md:text-base mt-1">{material.title || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-500">Referencia</p>
                <p className="text-sm md:text-base mt-1">{material.reference || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-500">Estado</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  getStatusDisplay(material.status).bg
                } ${getStatusDisplay(material.status).text}`}>
                  {getStatusDisplay(material.status).label}
                </span>
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-500">ID del Área</p>
                <p className="text-sm md:text-base mt-1">{material.area_id || "No asignado"}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs md:text-sm font-medium text-gray-500">Descripción</p>
                <p className="text-sm md:text-base mt-1 whitespace-pre-wrap">{material.description || "Sin descripción"}</p>
              </div>
            </div>
          </div>
          
          {/* Metadatos */}
          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">Metadatos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-500">ID del Material</p>
                <p className="text-sm md:text-base mt-1 break-all">{material.id}</p>
              </div>
              <div className="sm:col-span-2 md:col-span-1">
                <p className="text-xs md:text-sm font-medium text-gray-500">Fecha de Creación</p>
                <p className="text-sm md:text-base mt-1">{formatDate(material.created_at)}</p>
              </div>
              <div className="sm:col-span-2 md:col-span-1">
                <p className="text-xs md:text-sm font-medium text-gray-500">Última Actualización</p>
                <p className="text-sm md:text-base mt-1">{formatDate(material.updated_at)}</p>
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
          No se encontraron detalles para este material.
        </div>
      )}
    </Modal>
  );
};
