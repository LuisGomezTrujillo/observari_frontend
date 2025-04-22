import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfiles, deleteProfile } from "../../api/profilesService";
import { EditProfile } from './EditProfile';

export const ListProfiles = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [editingProfileId, setEditingProfileId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const data = await getProfiles();  // Remove .data as it should be handled in service
      setProfiles(Array.isArray(data) ? data : []);  // Ensure users is always an array
      setError(null);
    } catch (err) {
      setError("Error al cargar los perfiles");
      console.error("Error cargando perfiles:", err);
      setProfiles([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (profileId) => {
    setEditingProfileId(profileId);
  };

  const handleUpdateSuccess = () => {
    setEditingProfileId(null);
    loadProfiles(); // Recargar la lista después de actualizar
  };

  const handleCancel = () => {
    setEditingProfileId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este perfil?')) {
      try {
        await deleteProfile(id);
        // Refresh the users list after successful deletion
        loadProfiles();
      } catch (err) {
        setError("Error al eliminar el perfil");
        console.error("Error eliminando perfil:", err);
      }
    }
  };

  return (
    <div>
      {editingProfileId && (
        <EditProfile
          ProfileId={editingProfileId}
          onUpdateSuccess={handleUpdateSuccess}
          onCancel={handleCancel}
        />
      )}
    <div className="container mx-auto px-4 py-8">
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lista de Perfiles</h1>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={() => navigate('/profiles/create')}
        >
          Crear Perfil
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
              <tr>
                <th>ID Usuario</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Rol</th>              
              </tr>
            </thead>
          <tbody className="bg-white divide-y divide-gray-200">            
            {profiles && profiles.length > 0 ? (
              profiles.map((profile) => (
                <tr key={profile.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{profile.user_id || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{profile.first_name || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{profile.last_name || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{profile.role || 'Usuario'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                      onClick={() => handleEdit(profile.id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(profile.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No hay perfiles para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};


