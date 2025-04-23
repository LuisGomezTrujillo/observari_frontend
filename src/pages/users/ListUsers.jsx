import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, deleteUser } from "../../api/usersService";

export const ListUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError("Error al cargar los usuarios");
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (userId) => {
    console.log("Editando usuario con ID:", userId);
    navigate(`/users/${userId}`); // Redirige a ruta de edición
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de eliminar este usuario?")) {
      try {
        await deleteUser(id);
        loadUsers();
      } catch (err) {
        setError("Error al eliminar el usuario");
        console.error("Error deleting user:", err);
      }
    }
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

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
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
    </div>
  );
};


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getUsers, deleteUser } from "../../api/usersService";
// import { EditUser } from './EditUser';

// export const ListUsers = () => {
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const [editingUserId, setEditingUserId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   const loadUsers = async () => {
//     try {
//       const data = await getUsers();  // Remove .data as it should be handled in service
//       setUsers(Array.isArray(data) ? data : []);  // Ensure users is always an array
//       setError(null);
//     } catch (err) {
//       setError("Error al cargar los usuarios");
//       console.error("Error fetching users:", err);
//       setUsers([]); // Set empty array on error
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (userId) => {
//     setEditingUserId(userId);
//     navigate(`/users/${userId}`);
//   };

//   const handleUpdateSuccess = () => {
//     setEditingUserId(null);
//     loadUsers(); // Recargar la lista después de actualizar
//   };

//   const handleCancel = () => {
//     setEditingUserId(null);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('¿Está seguro de eliminar este usuario?')) {
//       try {
//         await deleteUser(id);
//         // Refresh the users list after successful deletion
//         loadUsers();
//       } catch (err) {
//         setError("Error al eliminar el usuario");
//         console.error("Error deleting user:", err);
//       }
//     }
//   };

//   return (
//     <div>
//       {editingUserId && (
//         <EditUser
//           userId={editingUserId}
//           onUpdateSuccess={handleUpdateSuccess}
//           onCancel={handleCancel}
//         />
//       )}
//     <div className="container mx-auto px-4 py-8">
      
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Lista de Usuarios</h1>
//         <button 
//           className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//           onClick={() => navigate('/users/create')}
//         >
//           Crear Usuario
//         </button>
//       </div>
      
//       <div className="bg-white shadow-md rounded-lg overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           {/* ... existing table header ... */}
//           <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Email</th>
//                 <th>Rol</th>
//                 <th>Acciones</th>
//               </tr>
//             </thead>
//           <tbody className="bg-white divide-y divide-gray-200">            
//             {users && users.length > 0 ? (
//               users.map((user) => (
//                 <tr key={user.id}>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">{user.id || 'N/A'}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">{user.email || 'N/A'}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">{user.role || 'Usuario'}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                   <button
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
//     </div>
//   );
// };