import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, deleteUser } from "../../services/usersService";
import { CreateUser } from "./CreateUser";
import { EditUser } from "./EditUser";
import { UserDetails } from "./UserDetails";
import { useAuth } from "../../contexts/AuthContext";

export const ListUsers = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 10
  });
  
  // Estados para los modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Verificar autenticación antes de cargar datos
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    } else if (!authLoading && isAuthenticated) {
      loadUsers();
    }
  }, [isAuthenticated, authLoading, pagination.skip, pagination.limit]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null); // Limpiar errores anteriores
      
      const data = await getUsers(pagination.skip, pagination.limit);
      
      // Asegurarse de que la respuesta sea un array
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data && typeof data === 'object' && Array.isArray(data.users)) {
        // En caso de que la API devuelva un objeto con una propiedad 'users'
        setUsers(data.users);
      } else {
        setUsers([]);
        setError("Formato de respuesta inesperado al cargar usuarios");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      
      // Verificar si el error es de autenticación
      if (err.response && err.response.status === 401) {
        setError("Sesión expirada o no autorizada. Por favor inicie sesión nuevamente.");
        // Redirigir al login después de un breve retraso
        setTimeout(() => navigate("/login"), 2000);
      } else if (err.response) {
        setError(`Error al cargar los usuarios: ${err.response.data?.message || "Error en el servidor"}`);
      } else if (err.request) {
        setError("No se pudo conectar con el servidor. Verifique su conexión a internet.");
      } else {
        setError("Error al preparar la solicitud. Por favor intente nuevamente.");
      }
      
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (userId) => {
    if (!userId) {
      console.error("ID de usuario inválido:", userId);
      alert("Error: El ID de usuario es inválido");
      return;
    }
    
    // Guardar el ID del usuario seleccionado
    setSelectedUserId(userId);
    // Abrir el modal de edición
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (userId) => {
    if (!userId) {
      console.error("ID de usuario inválido para ver detalles:", userId);
      alert("Error: El ID de usuario es inválido");
      return;
    }
    
    // Guardar el ID del usuario seleccionado
    setSelectedUserId(userId);
    // Abrir el modal de detalles
    setIsDetailsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error("ID de usuario inválido para eliminar:", id);
      alert("Error: El ID de usuario es inválido");
      return;
    }
    
    if (window.confirm("¿Está seguro de eliminar este usuario?")) {
      try {
        setIsDeleting(true);
        setError(null);
        
        await deleteUser(id);
        
        // Mostrar mensaje de éxito
        alert("Usuario eliminado correctamente");
        
        // Recargar usuarios después de eliminar
        loadUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
        
        // Verificar si el error es de autenticación
        if (err.response && err.response.status === 401) {
          setError("Sesión expirada o no autorizada. Por favor inicie sesión nuevamente.");
          setTimeout(() => navigate("/login"), 2000);
        } else if (err.response && err.response.status === 404) {
          alert("El usuario ya no existe o fue eliminado previamente.");
          loadUsers(); // Actualizar la lista de todos modos
        } else if (err.response) {
          setError(`Error al eliminar: ${err.response.data?.message || "Error en el servidor"}`);
        } else if (err.request) {
          setError("No se pudo conectar con el servidor. Verifique su conexión a internet.");
        } else {
          setError("Error al preparar la solicitud. Por favor intente nuevamente.");
        }
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Manejadores para la paginación
  const handleNextPage = () => {
    if (users.length >= pagination.limit) {
      setPagination(prev => ({
        ...prev,
        skip: prev.skip + prev.limit
      }));
    }
  };

  const handlePreviousPage = () => {
    setPagination(prev => ({
      ...prev,
      skip: Math.max(0, prev.skip - prev.limit)
    }));
  };

  // Si todavía está verificando la autenticación, muestra un indicador de carga
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Lista de Usuarios</h1>
        <button
          className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md hover:bg-blue-700 w-full sm:w-auto"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Crear Usuario
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm sm:text-base">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Contenedor con scroll horizontal */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <div className="min-w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          {user.id || "N/A"}
                        </td>
                        <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          {user.email || "N/A"}
                        </td>
                        <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          {user.role || "Usuario"}
                        </td>
                        <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                            <button
                              onClick={() => handleViewDetails(user.id)}
                              className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm"
                            >
                              Detalles
                            </button>
                            <button
                              onClick={() => handleEdit(user.id)}
                              className="text-indigo-600 hover:text-indigo-900 text-xs sm:text-sm"
                              disabled={isDeleting}
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="text-red-600 hover:text-red-900 text-xs sm:text-sm"
                              disabled={isDeleting}
                            >
                              {isDeleting ? "Eliminando..." : "Eliminar"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 sm:px-6 py-4 text-center text-xs sm:text-sm text-gray-500">
                        No hay usuarios para mostrar
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Indicador de desplazamiento horizontal en dispositivos móviles */}
          <div className="block sm:hidden text-xs text-gray-500 text-center mt-2 italic">
            Deslice horizontalmente para ver toda la información
          </div>

          <div className="flex flex-col sm:flex-row justify-between mt-4 gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={pagination.skip === 0}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded ${
                pagination.skip === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Anterior
            </button>
            <span className="text-center text-xs sm:text-sm text-gray-700 py-2">
              Página {Math.floor(pagination.skip / pagination.limit) + 1}
            </span>
            <button
              onClick={handleNextPage}
              disabled={users.length < pagination.limit}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded ${
                users.length < pagination.limit
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {/* Modales */}
      <CreateUser 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={loadUsers}
      />
      
      <EditUser 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        userId={selectedUserId}
        onSuccess={loadUsers}
      />
      
      <UserDetails 
        isOpen={isDetailsModalOpen} 
        onClose={() => setIsDetailsModalOpen(false)} 
        userId={selectedUserId}
      />
    </div>
  );
};
