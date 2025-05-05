import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, deleteUser } from "../../services/usersService";

export const ListUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 10
  });

  useEffect(() => {
    loadUsers();
  }, [pagination.skip, pagination.limit]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers(pagination.skip, pagination.limit);
      setUsers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      // Verificar si el error es de autenticación
      if (err.response && err.response.status === 401) {
        setError("Sesión expirada o no autorizada. Por favor inicie sesión nuevamente.");
        // Redirigir al login después de un breve retraso
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Error al cargar los usuarios");
      }
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (userId) => {
    console.log("Editando usuario con ID:", userId);
    navigate(`/users/${userId}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de eliminar este usuario?")) {
      try {
        await deleteUser(id);
        // Recargar usuarios después de eliminar
        loadUsers();
      } catch (err) {
        // Verificar si el error es de autenticación
        if (err.response && err.response.status === 401) {
          setError("Sesión expirada o no autorizada. Por favor inicie sesión nuevamente.");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setError("Error al eliminar el usuario");
        }
        console.error("Error deleting user:", err);
      }
    }
  };

  // Manejadores para la paginación
  const handleNextPage = () => {
    setPagination(prev => ({
      ...prev,
      skip: prev.skip + prev.limit
    }));
  };

  const handlePreviousPage = () => {
    setPagination(prev => ({
      ...prev,
      skip: Math.max(0, prev.skip - prev.limit)
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lista de Usuarios</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={() => navigate("/users/create")}
        >
          Crear Usuario
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.id || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.role || "Usuario"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleEdit(user.id)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
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
                      No hay usuarios para mostrar
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={pagination.skip === 0}
              className={`px-4 py-2 rounded ${
                pagination.skip === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Anterior
            </button>
            <button
              onClick={handleNextPage}
              disabled={users.length < pagination.limit}
              className={`px-4 py-2 rounded ${
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
    </div>
  );
};

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getUsers, deleteUser } from "../../services/usersService";

// export const ListUsers = () => {
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   const loadUsers = async () => {
//     try {
//       const data = await getUsers();
//       setUsers(Array.isArray(data) ? data : []);
//       setError(null);
//     } catch (err) {
//       setError("Error al cargar los usuarios");
//       console.error("Error fetching users:", err);
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (userId) => {
//     console.log("Editando usuario con ID:", userId);
//     navigate(`/api/users/${userId}`); // Redirige a ruta de edición
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("¿Está seguro de eliminar este usuario?")) {
//       try {
//         await deleteUser(id);
//         loadUsers();
//       } catch (err) {
//         setError("Error al eliminar el usuario");
//         console.error("Error deleting user:", err);
//       }
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Lista de Usuarios</h1>
//         <button
//           className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//           onClick={() => navigate("/users/create")}
//         >
//           Crear Usuario
//         </button>
//       </div>

//       <div className="bg-white shadow-md rounded-lg overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Email</th>
//               <th>Rol</th>
//               <th>Acciones</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {users && users.length > 0 ? (
//               users.map((user) => (
//                 <tr key={user.id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {user.id || "N/A"}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {user.email || "N/A"}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {user.role || "Usuario"}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     <button
//                       onClick={() => handleEdit(user.id)}
//                       className="text-indigo-600 hover:text-indigo-900 mr-4"
//                     >
//                       Editar
//                     </button>
//                     <button
//                       onClick={() => handleDelete(user.id)}
//                       className="text-red-600 hover:text-red-900"
//                     >
//                       Eliminar
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
//                   No hay usuarios para mostrar
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };
