import React, { useState, useEffect } from "react";
import { Modal } from "../../components/molecules/Modal";
import { getUserById } from "../../services/usersService";

export const UserDetails = ({ isOpen, onClose, userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId || !isOpen) return;
      
      try {
        setLoading(true);
        setError(null);
        const userData = await getUserById(userId);
        setUser(userData);
      } catch (err) {
        console.error("Error al obtener detalles del usuario:", err);
        setError("No se pudieron cargar los detalles del usuario");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Usuario">
      {loading ? (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-red-600 p-4">{error}</div>
      ) : user ? (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Información General</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-600">ID:</div>
              <div>{user.id}</div>
              
              <div className="text-gray-600">Email:</div>
              <div>{user.email}</div>
              
              <div className="text-gray-600">Rol:</div>
              <div>{user.role || "Usuario"}</div>
              
              {user.created_at && (
                <>
                  <div className="text-gray-600">Creado:</div>
                  <div>{new Date(user.created_at).toLocaleString()}</div>
                </>
              )}
              
              {user.updated_at && (
                <>
                  <div className="text-gray-600">Actualizado:</div>
                  <div>{new Date(user.updated_at).toLocaleString()}</div>
                </>
              )}
            </div>
          </div>
          
          {/* Si hay más información específica del usuario, se puede agregar aquí */}
          
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center p-4">No se encontraron datos del usuario</div>
      )}
    </Modal>
  );
};