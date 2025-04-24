import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserRelationshipById, createUserRelationship } from "../../api/relationshipsService";
import { FormRelationship } from "../../components/organisms/FormRelationship";

export const EditRelationship = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ user_id: "", related_user_id: "", relationship_type: "" });

  useEffect(() => {
    const load = async () => {
      const data = await getUserRelationshipById(id);
      setForm(data);
    };
    load();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUserRelationship(form);
      alert("Relación actualizada correctamente");
      navigate("/relationships");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Editar Relación</h2>
      <form onSubmit={handleSubmit}>
        <FormRelationship form={form} handleChange={handleChange} />
        <button type="submit" className="btn btn-primary mt-4">Actualizar</button>
      </form>
    </div>
  );
};
