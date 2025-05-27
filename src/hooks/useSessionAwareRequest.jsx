import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * Hook que maneja sesión expirada (401) y errores visuales coherentes.
 */
export const useSessionAwareRequest = () => {
  const { openLoginModal } = useAuth();
  const navigate = useNavigate();

  const handleSessionExpired = (setError, message) => {
    if (setError) setError(message);

    if (openLoginModal) {
      setTimeout(() => openLoginModal(), 1500);
    } else {
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  /**
   * Ejecuta una promesa y maneja error 401 mostrando mensaje visual.
   * @param {Function} asyncFn - Función que devuelve una promesa.
   * @param {Function} setError - Setter para mostrar error visual.
   * @param {string} contextMessage - Mensaje personalizado.
   */
  const safeRequest = async (asyncFn, setError, contextMessage = null) => {
    try {
      return await asyncFn();
    } catch (error) {
      if (error.response?.status === 401) {
        handleSessionExpired(setError, contextMessage || "Tu sesión ha expirado. Por favor, inicia sesión.");
        return null;
      }
      throw error;
    }
  };

  return { safeRequest };
};
