import React, { useState } from "react";
import { FormRelationship } from "../../components/organisms/FormRelationship";
import { createUserRelationship } from "../../api/relationshipsService";

export const CreateRelationship = () => {
  const [form, setForm] = useState({ user_id: "", related_user_id: "", relationship_type: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUserRelationship(form);
      alert("Relación creada correctamente");
    } catch (err) {
      console.error(err);
      setError("Error al crear la relación");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Crear Relación</h2>
      <form onSubmit={handleSubmit}>
        <FormRelationship form={form} handleChange={handleChange} />
        {error && <div className="text-red-600 mt-2">{error}</div>}
        <button type="submit" className="btn btn-primary mt-4">Crear</button>
      </form>
    </div>
  );
};
