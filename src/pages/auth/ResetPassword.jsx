import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verifyResetToken, resetPassword } from "../services/improvedAuthService";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isTokenChecking, setIsTokenChecking] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Verificar validez del token al cargar el componente
  useEffect(() => {
    const checkToken = async () => {
      try {
        const result = await verifyResetToken(token);
        if (result.success && result.data.valid) {
          setIsTokenValid(true);
        } else {
          setError("El enlace de restablecimiento es inválido o ha expirado.");
        }
      } catch (err) {
        console.error("Error al verificar token:", err);
        setError("No se pudo verificar el enlace de restablecimiento.");
      } finally {
        setIsTokenChecking(false);
      }
    };

    if (token) {
      checkToken();
    } else {
      setIsTokenChecking(false);
      setError("No se proporcionó un token de restablecimiento.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar contraseñas
    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const result = await resetPassword(token, newPassword);
      
      if (result.success) {
        setIsSuccess(true);
        setMessage("Tu contraseña ha sido restablecida correctamente. Ahora puedes iniciar sesión con tu nueva contraseña.");
      } else {
        setError(result.message || "Ocurrió un error al restablecer la contraseña.");
      }
    } catch (err) {
      console.error("Error al restablecer contraseña:", err);
      setError("Ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar estado de verificación del token o mensaje de error
  if (isTokenChecking) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <p className="text-center">Verificando enlace de restablecimiento...</p>
      </div>
    );
  }

  // Si el token no es válido, mostrar mensaje de error
  if (!isTokenValid && !isSuccess) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
        <div className="text-center mt-4">
          <button 
            onClick={() => navigate("/forgot-password")}
            className="text-blue-600 hover:text-blue-800"
          >
            Solicitar un nuevo enlace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Restablecer Contraseña</h2>
      
      {isSuccess ? (
        <div>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <p>{message}</p>
          </div>
          <div className="text-center mt-4">
            <button 
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
            >
              Ir a Iniciar Sesión
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Nueva Contraseña
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
              {isLoading ? "Procesando..." : "Restablecer Contraseña"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;