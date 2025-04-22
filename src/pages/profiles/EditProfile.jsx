import React, { useEffect, useState } from "react";
import { FormProfile } from "../../components/organisms/FormProfile";
import { getProfileById, updateProfile } from "../../api/profilesService";
import { useParams } from "react-router-dom";

export const EditProfile = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadProfile = async () => {
      const res = await getProfileById(id);
      setForm(res.data);
    };
    loadProfile();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName) newErrors.firstName = "Campo requerido";
    if (!form.Lastname) newErrors.Lastname = "Campo requerido";
    if (!form.birthdayDate) newErrors.birthdayDate = "Campo requerido";
    if (!form.telefono) newErrors.mobile = "Campo requerido";
    if (!form.direccion) newErrors.direccion = "Campo requerido";
    if (!form.ciudad) newErrors.ciudad = "Campo requerido";
    if (!form.departamento) newErrors.departamento = "Campo requerido";
    if (!form.pais) newErrors.pais = "Campo requerido";
    if (!form.rol) newErrors.rol = "Campo requerido";
    if (!form.relacion) newErrors.relacion = "Campo requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await updateProfile(id, form);
    alert("Perfil actualizado correctamente");
  };

  if (!form) return <p>Cargando...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Editar Perfil</h2>
      <form onSubmit={handleSubmit} noValidate>
        <FormProfile form={form} handleChange={handleChange} />
        {Object.values(errors).map((msg, i) => (
          <p key={i} className="text-red-600 text-sm">{msg}</p>
        ))}
        <button
          type="submit"
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Actualizar
        </button>
      </form>
    </div>
  );
};
