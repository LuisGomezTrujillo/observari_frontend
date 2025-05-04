import React, { useEffect, useState } from "react";
import { getUsers } from "../../services/usersService";

export const FormRelationship = ({ form, handleChange }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const data = await getUsers();
      setUsers(data);
    };
    loadUsers();
  }, []);

  const options = users.map(user => ({ value: user.id, label: user.email }));

  return (
    <div className="grid grid-cols-2 gap-4">
      <label>
        Usuario Principal:
        <select name="user_id" value={form.user_id} onChange={handleChange} className="input">
          <option value="">Seleccione</option>
          {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </label>
      <label>
        Usuario Relacionado:
        <select name="related_user_id" value={form.related_user_id} onChange={handleChange} className="input">
          <option value="">Seleccione</option>
          {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </label>
      <label>
        Tipo de Relación:
        <input type="text" name="relationship_type" value={form.relationship_type} onChange={handleChange} className="input" />
      </label>
    </div>
  );
};