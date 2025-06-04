import React, { useState, useEffect } from "react";
import { getEnvironmentById, getEnvironmentTypeLabel, getEnvironmentStatusLabel } from "../../services/environmentsService";
import { Modal } from "../../components/molecules/Modal";
import { useSessionAwareRequest } from "../../hooks/useSessionAwareRequest";

export const EnvironmentDetails = ({ isOpen, onClose, environmentId }) => {
  const { safeRequest } = useSessionAwareRequest();
  const [environment, setEnvironment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEnvironmentDetails = async () => {
    if (!environmentId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const environmentData = await safeRequest(
        () => getEnvironmentById(environmentId),
        setError,
        "Tu sesión ha expirado mientras se cargaban los detalles. Por favor, inicia sesión nuevamente."
      );
      
      if (environmentData) {
        setEnvironment(environmentData);
      }
    } catch (err) {
      console.error("Error al cargar detalles del ambiente:", err);
      setError("Error al cargar los detalles del ambiente. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && environmentId) {
      fetchEnvironmentDetails();
    }
  }, [isOpen, environmentId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Ambiente">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : environment ? (
        <div className="space-y-4">
          {/* Información General */}
          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">Información General</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-500">Nombre</p>
                <p className="text-sm md:text-base mt-1 break-all">{environment.title || "Sin título"}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-500">Tipo de Ambiente</p>
                <p className="text-sm md:text-base mt-1">{getEnvironmentTypeLabel(environment.environment_type) || "No especificado"}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-500">Estado</p>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                  {getEnvironmentStatusLabel(environment.environment_status) || "No especificado"}
                </span>
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-500">Ubicación</p>
                <p className="text-sm md:text-base mt-1">{environment.location || "No especificada"}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-500">Capacidad</p>
                <p className="text-sm md:text-base mt-1">{environment.capacity || "No especificada"}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-500">Disponibilidad</p>
                <p className="text-sm md:text-base mt-1">{environment.availability || "No especificada"}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs md:text-sm font-medium text-gray-500">Descripción</p>
                <p className="text-sm md:text-base mt-1 whitespace-pre-wrap">{environment.description || "Sin descripción"}</p>
              </div>
              {environment.photo_url && (
                <div className="sm:col-span-2">
                  <p className="text-xs md:text-sm font-medium text-gray-500">Foto</p>
                  <img 
                    src={environment.photo_url} 
                    alt="Imagen del ambiente" 
                    className="mt-2 rounded-lg max-h-64 w-auto object-contain"
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Metadatos */}
          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">Metadatos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-500">ID del Ambiente</p>
                <p className="text-sm md:text-base mt-1 break-all">{environment.id}</p>
              </div>
              <div className="sm:col-span-2 md:col-span-1">
                <p className="text-xs md:text-sm font-medium text-gray-500">Fecha de Creación</p>
                <p className="text-sm md:text-base mt-1">{formatDate(environment.created_at)}</p>
              </div>
              <div className="sm:col-span-2 md:col-span-1">
                <p className="text-xs md:text-sm font-medium text-gray-500">Última Actualización</p>
                <p className="text-sm md:text-base mt-1">{formatDate(environment.updated_at)}</p>
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
          No se encontraron detalles para este ambiente.
        </div>
      )}
    </Modal>
  );
};