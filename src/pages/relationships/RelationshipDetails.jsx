import React, { useState, useEffect } from "react";
import { getRelationshipById, getRelationshipTypeLabel } from "../../services/relationshipsService";
import { getUserById } from "../../services/usersService";
import { Modal } from "../../components/molecules/Modal";

export const RelationshipDetails = ({ isOpen, onClose, relationshipId }) => {
  const [relationship, setRelationship] = useState(null);
  const [userOrigin, setUserOrigin] = useState(null);
  const [userDestination, setUserDestination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRelationshipDetails = async () => {
      if (!relationshipId || !isOpen) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Cargar los datos de la relación
        const relationshipData = await getRelationshipById(relationshipId);
        setRelationship(relationshipData);
        
        // Cargar datos de los usuarios involucrados
        if (relationshipData.user_id) {
          try {
            const userData = await getUserById(relationshipData.user_id);
            setUserOrigin(userData);
          } catch (userErr) {
            console.error(`Error al cargar usuario origen (${relationshipData.user_id}):`, userErr);
          }
        }
        
        if (relationshipData.related_user_id) {
          try {
            const relatedUserData = await getUserById(relationshipData.related_user_id);
            setUserDestination(relatedUserData);
          } catch (userErr) {
            console.error(`Error al cargar usuario destino (${relationshipData.related_user_id}):`, userErr);
          }
        }
      } catch (err) {
        console.error("Error al cargar los detalles de la relación:", err);
        setError("No se pudo cargar la información de la relación. Por favor, intente de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };
    
    if (isOpen) {
      loadRelationshipDetails();
    }
  }, [relationshipId, isOpen]);
  
  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Función para mostrar el nombre completo del usuario
  const getUserFullName = (user) => {
    if (!user) return "No disponible";
    
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || user.email || "No disponible";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles de la Relación">
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : relationship ? (
        <div className="space-y-4">
          {/* Información básica */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Información Básica</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Tipo de Relación</p>
                <p className="text-gray-800">{getRelationshipTypeLabel(relationship.relationship_type) || "No especificado"}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Fecha de Creación</p>
                <p className="text-gray-800">{formatDate(relationship.created_at)}</p>
              </div>
              
              {relationship.updated_at && (
                <div>
                  <p className="text-sm text-gray-500">Última Actualización</p>
                  <p className="text-gray-800">{formatDate(relationship.updated_at)}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Usuarios involucrados */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Usuarios Involucrados</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Usuario Origen */}
              <div className="border rounded-lg bg-white p-3">
                <p className="text-sm text-gray-500 mb-1">Usuario Origen</p>
                <p className="font-medium text-gray-800">{getUserFullName(userOrigin)}</p>
                {userOrigin && (
                  <>
                    <p className="text-sm text-gray-600 mt-1">{userOrigin.email}</p>
                    {userOrigin.phone && (
                      <p className="text-sm text-gray-600">{userOrigin.phone}</p>
                    )}
                  </>
                )}
              </div>
              
              {/* Usuario Destino */}
              <div className="border rounded-lg bg-white p-3">
                <p className="text-sm text-gray-500 mb-1">Usuario Destino</p>
                <p className="font-medium text-gray-800">{getUserFullName(userDestination)}</p>
                {userDestination && (
                  <>
                    <p className="text-sm text-gray-600 mt-1">{userDestination.email}</p>
                    {userDestination.phone && (
                      <p className="text-sm text-gray-600">{userDestination.phone}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Descripción */}
          {relationship.description && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Descripción</h4>
              <p className="text-gray-800 whitespace-pre-line">{relationship.description}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No se encontró información para esta relación
        </div>
      )}
      
      {/* Botón de cerrar en la parte inferior */}
      {!loading && relationship && (
        <div className="flex justify-end pt-4 mt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cerrar
          </button>
        </div>
      )}
    </Modal>
  );
};

// import React, { useState, useEffect } from "react";
// import { getRelationshipById, getRelationshipTypeLabel } from "../../services/relationshipsService";
// import { getUserById } from "../../services/usersService";

// export const RelationshipDetails = ({ isOpen, onClose, relationshipId }) => {
//   const [relationship, setRelationship] = useState(null);
//   const [userOrigin, setUserOrigin] = useState(null);
//   const [userDestination, setUserDestination] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const loadRelationshipDetails = async () => {
//       if (!relationshipId || !isOpen) return;
      
//       try {
//         setLoading(true);
//         setError(null);
        
//         // Cargar los datos de la relación
//         const relationshipData = await getRelationshipById(relationshipId);
//         setRelationship(relationshipData);
        
//         // Cargar datos de los usuarios involucrados
//         if (relationshipData.user_id) {
//           try {
//             const userData = await getUserById(relationshipData.user_id);
//             setUserOrigin(userData);
//           } catch (userErr) {
//             console.error(`Error al cargar usuario origen (${relationshipData.user_id}):`, userErr);
//           }
//         }
        
//         if (relationshipData.related_user_id) {
//           try {
//             const relatedUserData = await getUserById(relationshipData.related_user_id);
//             setUserDestination(relatedUserData);
//           } catch (userErr) {
//             console.error(`Error al cargar usuario destino (${relationshipData.related_user_id}):`, userErr);
//           }
//         }
//       } catch (err) {
//         console.error("Error al cargar los detalles de la relación:", err);
//         setError("No se pudo cargar la información de la relación. Por favor, intente de nuevo más tarde.");
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     if (isOpen) {
//       loadRelationshipDetails();
//     }
//   }, [relationshipId, isOpen]);

//   if (!isOpen) return null;
  
//   // Función para formatear la fecha
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
    
//     const options = { 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
    
//     return new Date(dateString).toLocaleDateString('es-ES', options);
//   };

//   // Función para mostrar el nombre completo del usuario
//   const getUserFullName = (user) => {
//     if (!user) return "No disponible";
    
//     const firstName = user.first_name || "";
//     const lastName = user.last_name || "";
    
//     const fullName = `${firstName} ${lastName}`.trim();
//     return fullName || user.email || "No disponible";
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
//         <div className="px-6 py-4 border-b flex justify-between items-center">
//           <h3 className="text-lg font-semibold text-gray-900">Detalles de la Relación</h3>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-500 focus:outline-none"
//           >
//             <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>
        
//         <div className="px-6 py-4">
//           {loading ? (
//             <div className="flex justify-center items-center py-8">
//               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
//             </div>
//           ) : error ? (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//               {error}
//             </div>
//           ) : relationship ? (
//             <div className="space-y-4">
//               {/* Información básica */}
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <h4 className="font-semibold text-gray-800 mb-2">Información Básica</h4>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-500">Tipo de Relación</p>
//                     <p className="text-gray-800">{getRelationshipTypeLabel(relationship.relationship_type) || "No especificado"}</p>
//                   </div>
                  
//                   <div>
//                     <p className="text-sm text-gray-500">Fecha de Creación</p>
//                     <p className="text-gray-800">{formatDate(relationship.created_at)}</p>
//                   </div>
                  
//                   {relationship.updated_at && (
//                     <div>
//                       <p className="text-sm text-gray-500">Última Actualización</p>
//                       <p className="text-gray-800">{formatDate(relationship.updated_at)}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
              
//               {/* Usuarios involucrados */}
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <h4 className="font-semibold text-gray-800 mb-2">Usuarios Involucrados</h4>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {/* Usuario Origen */}
//                   <div className="border rounded-lg bg-white p-3">
//                     <p className="text-sm text-gray-500 mb-1">Usuario Origen</p>
//                     <p className="font-medium text-gray-800">{getUserFullName(userOrigin)}</p>
//                     {userOrigin && (
//                       <>
//                         <p className="text-sm text-gray-600 mt-1">{userOrigin.email}</p>
//                         {userOrigin.phone && (
//                           <p className="text-sm text-gray-600">{userOrigin.phone}</p>
//                         )}
//                       </>
//                     )}
//                   </div>
                  
//                   {/* Usuario Destino */}
//                   <div className="border rounded-lg bg-white p-3">
//                     <p className="text-sm text-gray-500 mb-1">Usuario Destino</p>
//                     <p className="font-medium text-gray-800">{getUserFullName(userDestination)}</p>
//                     {userDestination && (
//                       <>
//                         <p className="text-sm text-gray-600 mt-1">{userDestination.email}</p>
//                         {userDestination.phone && (
//                           <p className="text-sm text-gray-600">{userDestination.phone}</p>
//                         )}
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
              
//               {/* Descripción */}
//               {relationship.description && (
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <h4 className="font-semibold text-gray-800 mb-2">Descripción</h4>
//                   <p className="text-gray-800 whitespace-pre-line">{relationship.description}</p>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="text-center py-8 text-gray-500">
//               No se encontró información para esta relación
//             </div>
//           )}
//         </div>
        
//         <div className="px-6 py-4 border-t">
//           <div className="flex justify-end">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
//             >
//               Cerrar
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
