import React, { useState, useEffect } from "react";
import { 
  getRelationshipById,
  updateRelationship, 
  getRelationshipTypeOptions 
} from "../../services/relationshipsService";
import { getUserById } from "../../services/usersService";

export const EditRelationship = ({ isOpen, onClose, relationshipId, onSuccess }) => {
  const [formData, setFormData] = useState({
    relationship_type: "",
    description: ""
  });
  
  const [userInfo, setUserInfo] = useState({
    user_name: "",
    related_user_name: ""
  });
  
  const [relationshipTypes, setRelationshipTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  // Cargar los datos de la relación cuando se abre el modal
  useEffect(() => {
    const loadRelationshipData = async () => {
      if (!relationshipId || !isOpen) return;
      
      try {
        setLoadingData(true);
        setError(null);
        
        // Cargar datos de la relación
        const relationshipData = await getRelationshipById(relationshipId);
        
        // Preparar los datos del formulario
        setFormData({
          relationship_type: relationshipData.relationship_type || "",
          description: relationshipData.description || ""
        });
        
        // Cargar información de los usuarios para mostrar
        try {
          const [userOrigin, userDestination] = await Promise.all([
            getUserById(relationshipData.user_id),
            getUserById(relationshipData.related_user_id)
          ]);
          
          setUserInfo({
            user_name: `${userOrigin.first_name || ''} ${userOrigin.last_name || ''}`.trim() || userOrigin.email || "N/A",
            related_user_name: `${userDestination.first_name || ''} ${userDestination.last_name || ''}`.trim() || userDestination.email || "N/A"
          });
        } catch (userErr) {
          console.error("Error al cargar datos de usuarios:", userErr);
          setUserInfo({
            user_name: "Error al cargar",
            related_user_name: "Error al cargar"
          });
        }
        
        // Cargar opciones de tipos de relación
        const typeOptions = getRelationshipTypeOptions();
        setRelationshipTypes(typeOptions);
        
      } catch (err) {
        console.error("Error al cargar datos de la relación:", err);
        setError("No se pudo cargar la información de la relación");
      } finally {
        setLoadingData(false);
      }
    };
    
    if (isOpen) {
      loadRelationshipData();
    }
  }, [relationshipId, isOpen]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg("");

    try {
      // Validar campos
      if (!formData.relationship_type) {
        setError("El tipo de relación es obligatorio");
        setLoading(false);
        return;
      }

      await updateRelationship(relationshipId, formData);
      setSuccessMsg("Relación actualizada correctamente");
      
      // Esperar un momento antes de cerrar el modal
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error al actualizar relación:", err);
      if (err.response) {
        setError(err.response.data?.message || "Error al actualizar la relación");
      } else {
        setError("No se pudo conectar con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Editar Relación</h3>
        </div>
        
        {loadingData ? (
          <div className="px-6 py-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Cargando datos...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-4">
            {/* Mensaje de error */}
            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            {/* Mensaje de éxito */}
            {successMsg && (
              <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {successMsg}
              </div>
            )}
            
            {/* Información de usuarios (no editable) */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Usuario Origen
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight"
                value={userInfo.user_name}
                disabled
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Usuario Destino
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight"
                value={userInfo.related_user_name}
                disabled
              />
            </div>
            
            {/* Tipo de relación */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Tipo de Relación *
              </label>
              <select
                name="relationship_type"
                value={formData.relationship_type}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Seleccione un tipo</option>
                {relationshipTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Descripción */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="3"
                placeholder="Descripción opcional de la relación"
              />
            </div>
            
            {/* Botones */}
            <div className="flex items-center justify-end pt-2 border-t">
              <button
                type="button"
                onClick={onClose}
                className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};