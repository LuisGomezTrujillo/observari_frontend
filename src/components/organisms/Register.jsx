import React, { useState } from "react";
import { Modal } from "../molecules/Modal";
import { FormRegister } from "../molecules/FormRegister";
import { ButtonGroup } from "../atoms/ButtonGroup";

export const Register = ({ isOpen, onClose }) => {
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Register submitted:", registerForm);
    // Aquí iría la lógica de registro
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrarse">
      <div className="space-y-6">
        <FormRegister form={registerForm} handleChange={handleChange} />
        
        <ButtonGroup 
          onCancel={onClose}
          onAccept={handleSubmit}
          acceptText="Registrarse"
          cancelText="Cancelar"
        />
      </div>
    </Modal>
  );
};