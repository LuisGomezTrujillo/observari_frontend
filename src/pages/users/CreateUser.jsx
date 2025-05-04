// Usuarios.jsx
import React, { useState } from "react";
import { FormUser } from "../../components/organisms/FormUser";
import { createUser } from "../../services/usersService";

export const CreateUser = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setError(null);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Campo requerido";
    if (!form.password) newErrors.password = "Campo requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await createUser(form);
      console.log("Usuario creado:", response.data);
    } catch (err) {
      setError("Hubo un error al crear el usuario");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Crear Usuario</h2>
      <form onSubmit={handleSubmit} noValidate>
        <FormUser form={form} handleChange={handleChange} />
        {Object.values(errors).map((msg, i) => (
          <p key={i} className="text-red-600 text-sm">{msg}</p>
        ))}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Crear Usuario"}
        </button>
      </form>
    </div>
  );
};
