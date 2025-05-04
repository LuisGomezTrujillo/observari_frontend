import React, { useState } from "react";
import { requestPasswordReset } from "../services/improvedAuthService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Por favor, introduce un correo electrónico válido");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");
    
    try {
      const result = await requestPasswordReset(email);
      
      if (result.success) {
        setIsSuccess(true);
        setMessage("Si el correo electrónico existe en nuestra base de datos, recibirás un enlace para restablecer tu contraseña.");
      } else {
        // Nota: Por seguridad, no revelamos si el email existe o no
        setIsSuccess(true);
        setMessage("Si el correo electrónico existe en nuestra base de datos, recibirás un enlace para restablecer tu contraseña.");
      }
    } catch (err) {
      console.error("Error al solicitar restablecimiento:", err);
      setIsSuccess(false);
      setError("Ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Recuperar Contraseña</h2>
      
      {isSuccess ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="tu@email.com"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${
                isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              {isLoading ? "Procesando..." : "Enviar Instrucciones"}
            </button>
          </div>
        </form>
      )}
      
      <div className="mt-4 text-center">
        <a 
          href="/login" 
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Volver a Iniciar Sesión
        </a>
      </div>
    </div>
  );
};

export default ForgotPassword;