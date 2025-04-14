import React, { useState } from "react";
import { FormUsuario } from "../components/organisms/FormUsuario";
import axios from "axios";

export const Usuarios = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post("http://localhost:8000/users/", form);
      console.log("Usuario creado:", response.data);
      // Aquí puedes hacer algo después de crear el usuario, como redirigir o limpiar el formulario
    } catch (err) {
      setError("Hubo un error al crear el usuario");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate={true}>
      <h2>Crear Usuario</h2>
      <FormUsuario form={form} handleChange={handleChange} />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? "Cargando..." : "Crear Usuario"}
      </button>
    </form>
  );
};