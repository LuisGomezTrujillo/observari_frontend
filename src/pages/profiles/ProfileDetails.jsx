import React, { useState, useEffect } from "react";
import { getProfileById } from "../../services/profilesService";
import { getUserById } from "../../services/usersService";
import { Modal } from "../../components/molecules/Modal";

export const ProfileDetails = ({ isOpen, onClose, profileId }) => {
  const [profile, setProfile] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      if (!profileId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Obtener los detalles del perfil
        const profileData = await getProfileById(profileId);
        setProfile(profileData);
        
        // Si el perfil tiene un usuario asociado, obtener sus datos
        if (profileData.user_id) {
          try {
            const user = await getUserById(profileData.user_id);
            setUserData(user);
          } catch (err) {
            console.error("Error al obtener datos del usuario:", err);
            setUserData(null);
          }
        }
      } catch (err) {
        console.error("Error al cargar detalles del perfil:", err);
        setError("Error al cargar los detalles del perfil. Por favor intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && profileId) {
      fetchProfileDetails();
    }
  }, [isOpen, profileId]);

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
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Perfil">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : profile ? (
        <div className="space-y-4">
          {/* Información del Usuario */}
          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">Información de Usuario</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-500">ID de Usuario</p>
                <p className="text-sm md:text-base mt-1 break-all">{profile.user_id || "No asignado"}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-500">Correo Electrónico</p>
                <p className="text-sm md:text-base mt-1 break-all">{userData?.email || "No disponible"}</p>
              </div>
            </div>
          </div>
          
          {/* Información Personal */}
          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">Información Personal</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-500">Nombre</p>
                <p className="text-sm md:text-base mt-1">{profile.first_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-500">Apellido</p>
                <p className="text-sm md:text-base mt-1">{profile.last_name || "N/A"}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs md:text-sm font-medium text-gray-500">Rol</p>
                <p className="text-sm md:text-base mt-1">{profile.role || "Usuario"}</p>
              </div>
            </div>
          </div>
          
          {/* Metadatos */}
          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">Metadatos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-500">ID del Perfil</p>
                <p className="text-sm md:text-base mt-1 break-all">{profile.id}</p>
              </div>
              <div className="sm:col-span-2 md:col-span-1">
                <p className="text-xs md:text-sm font-medium text-gray-500">Fecha de Creación</p>
                <p className="text-sm md:text-base mt-1">{formatDate(profile.created_at)}</p>
              </div>
              <div className="sm:col-span-2 md:col-span-1">
                <p className="text-xs md:text-sm font-medium text-gray-500">Última Actualización</p>
                <p className="text-sm md:text-base mt-1">{formatDate(profile.updated_at)}</p>
              </div>
            </div>
          </div>
          
          {/* Información Adicional (si existe) */}
          {profile.additional_info && (
            <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
              <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">Información Adicional</h3>
              <p className="text-sm md:text-base whitespace-pre-wrap break-words">{profile.additional_info}</p>
            </div>
          )}
          
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
          No se encontraron detalles para este perfil.
        </div>
      )}
    </Modal>
  );
};