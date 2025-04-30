import React, { useState } from "react";
import { Modal } from "../molecules/Modal";
import { FormLogin } from "../molecules/FormLogin";
import { ButtonGroup } from "../atoms/ButtonGroup";

export const Login = ({ isOpen, onClose }) => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Login submitted:", loginForm);
    // Aquí iría la lógica de autenticación
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Iniciar Sesión">
      <div className="space-y-6">
        <FormLogin form={loginForm} handleChange={handleChange} />
        
        <ButtonGroup 
          onCancel={onClose}
          onAccept={handleSubmit}
          acceptText="Iniciar Sesión"
          cancelText="Cancelar"
        />
      </div>
    </Modal>
  );
};