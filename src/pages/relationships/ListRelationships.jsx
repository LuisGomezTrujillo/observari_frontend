import React, { useEffect, useState } from "react";
import { getUserRelationships, deleteUserRelationship } from "../../api/relationshipsService";
import { useNavigate } from "react-router-dom";

export const ListRelationships = () => {
  const [relations, setRelations] = useState([]);
  const navigate = useNavigate();

  const load = async () => {
    const data = await getUserRelationships();
    setRelations(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar esta relación?")) {
      await deleteUserRelationship(id);
      load();
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Relaciones de Usuario</h2>
      <button 
        onClick={() => navigate("/relationships/create")} 
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >Crear Relación
      </button>
      <table className="min-w-full border border-gray-200">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Relacionado Con</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {relations.map(rel => (
            <tr key={rel.id}>
              <td>{rel.id}</td>
              <td>{rel.user_id}</td>
              <td>{rel.related_user_id}</td>
              <td>{rel.relationship_type}</td>
              <td>
                <button onClick={() => navigate(`/relationships/${rel.id}`)} className="text-blue-500">Editar</button>
                <button onClick={() => handleDelete(rel.id)} className="text-red-500 ml-2">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
