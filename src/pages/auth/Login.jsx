import React, { useState } from "react";
import { Modal } from "../../components/molecules/Modal";
import { InputText } from "../../components/atoms/InputText";
import { useAuth } from "../../contexts/AuthContext";

export const Login = () => {
  const { isLoginModalOpen, closeModals, login } = useAuth();
  
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.email || !form.password) {
      setError("Por favor ingrese email y contraseña");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await login(form.email, form.password);
      if (!result.success) {
        setError(result.error || "Error al iniciar sesión");
      }
    } catch (err) {
      console.error("Error durante el login:", err);
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    // Función para cambiar al modal de registro si lo necesitas
    // En este caso, cerraría el de login y abriría el de registro
    closeModals();
    // openRegisterModal(); // Esta función estaría en AuthContext
  };

  return (
    <Modal isOpen={isLoginModalOpen} onClose={closeModals} title="Iniciar Sesión">
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputText
          label="Correo Electrónico"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        
        <InputText
          label="Contraseña"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
        
        {error && (
          <div className="text-red-600 text-sm py-2">{error}</div>
        )}
        
        <div className="flex flex-col space-y-4 pt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
          
          <div className="text-center text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <button
              type="button"
              className="text-blue-600 hover:underline focus:outline-none"
              onClick={handleRegisterClick}
            >
              Regístrate aquí
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
