import React, { useState, useEffect } from "react";
import { InputText } from "../atoms/InputText";
import { SelectInput } from "../atoms/SelectiInput";
import { getUsers } from "../../services/usersService";

export const FormProfile = ({ form, handleChange }) => {
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
          <InputText
            label="Primer Nombre"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
          />
          <InputText
            label="Segundo Nombre"
            name="second_name"
            value={form.second_name}
            onChange={handleChange}
          />
          <InputText
            label="Apellido Paterno"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
          />
          <InputText
            label="Apellido Materno"
            name="second_last_name"
            value={form.second_last_name}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-3">
          <InputText
            label="Fecha de Nacimiento"
            name="birth_date"
            type="date"
            value={form.birth_date}
            onChange={handleChange}
          />
          <InputText
            label="Teléfono Móvil"
            name="mobile_phone"
            type="tel"
            value={form.mobile_phone}
            onChange={handleChange}
          />
          <InputText
            label="Dirección"
            name="home_address"
            value={form.home_address}
            onChange={handleChange}
          />
          <SelectInput
            label="Rol"
            name="role"
            value={form.role}
            options={["Administrador", "Guía", "Asistente", "Estudiante", "Acudiente", "Padrino"]}
            onChange={handleChange}
          />
          <SelectInput
            label="Usuario Asignado"
            name="user_id"
            value={form.user_id}
            options={userOptions}
            onChange={handleChange}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
};
