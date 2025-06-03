import React, { useState, useEffect } from "react";
import { InputText } from "../atoms/InputText";
import { SelectInput } from "../atoms/SelectiInput";
import { getUsers } from "../../services/usersService";

export const FormRelationship = ({ form, handleChange }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  // Transformar los usuarios en opciones para el select
  const userOptions = users.map(user => ({
    value: user.id,
    label: user.email
  }));

  return (
    <div className="w-full max-h-[80vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
        <div className="space-y-3">
          <SelectInput
            label="Usuario Principal"
            name="user_id"
            value={form.user_id}
            options={userOptions}
            onChange={handleChange}
            isLoading={loading}
          />
          <SelectInput
            label="Usuario Relacionado"
            name="related_user_id"
            value={form.related_user_id}
            options={userOptions}
            onChange={handleChange}
            isLoading={loading}
          />
        </div>
        <div className="space-y-3">
          <InputText
            label="Tipo de Relación"
            name="relationship_type"
            value={form.relationship_type}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

// import React, { useEffect, useState } from "react";
// import { getUsers } from "../../services/usersService";

// export const FormRelationship = ({ form, handleChange }) => {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const loadUsers = async () => {
//       const data = await getUsers();
//       setUsers(data);
//     };
//     loadUsers();
//   }, []);

//   const options = users.map(user => ({ value: user.id, label: user.email }));

//   return (
//     <div className="grid grid-cols-2 gap-4">
//       <label>
//         Usuario Principal:
//         <select name="user_id" value={form.user_id} onChange={handleChange} className="input">
//           <option value="">Seleccione</option>
//           {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
//         </select>
//       </label>
//       <label>
//         Usuario Relacionado:
//         <select name="related_user_id" value={form.related_user_id} onChange={handleChange} className="input">
//           <option value="">Seleccione</option>
//           {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
//         </select>
//       </label>
//       <label>
//         Tipo de Relación:
//         <input type="text" name="relationship_type" value={form.relationship_type} onChange={handleChange} className="input" />
//       </label>
//     </div>
//   );
// };