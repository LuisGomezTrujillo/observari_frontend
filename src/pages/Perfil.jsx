import React, { useState } from "react";
import { FormPerfil } from "../components/organisms/FormPerfil";

export const Perfil = () => {
  const [form, setForm] = useState({
    primerNombre: "",
    segundoNombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    fechaNacimiento: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    departamento: "",
    pais: "",
    rol: "",
    relacion: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.primerNombre) newErrors.primerNombre = "Campo requerido";
    if (!form.apellidoPaterno) newErrors.apellidoPaterno = "Campo requerido";
    if (!form.fechaNacimiento) newErrors.fechaNacimiento = "Campo requerido";
    if (!form.telefono) newErrors.telefono = "Campo requerido";
    if (!form.direccion) newErrors.direccion = "Campo requerido";
    if (!form.ciudad) newErrors.ciudad = "Campo requerido";
    if (!form.departamento) newErrors.departamento = "Campo requerido";
    if (!form.pais) newErrors.pais = "Campo requerido";
    if (!form.rol) newErrors.rol = "Campo requerido";
    if (!form.relacion) newErrors.relacion = "Campo requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    console.log("Formulario Perfil", form);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Registrar Perfil</h2>
      <form onSubmit={handleSubmit} noValidate>
        <FormPerfil form={form} handleChange={handleChange} />
        {Object.values(errors).map((msg, i) => (
          <p key={i} className="text-red-600 text-sm">{msg}</p>
        ))}
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar
        </button>
      </form>
    </div>
  );
};
