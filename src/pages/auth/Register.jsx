import React, { useState } from "react";
import { Modal } from "../../components/molecules/Modal";
import { FormRegister } from "../../components/organisms/FormRegister";

export const Register = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí va la lógica de registro
    console.log("Register:", form);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registro">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormRegister form={form} handleChange={handleChange} />
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Registrarse
          </button>
        </div>
      </form>
    </Modal>
  );
};