import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const AuthFooter = () => {
  const navigate = useNavigate();
  const { 
    isAuthenticated, 
    currentUser, 
    isLoading, 
    logout, 
    openLoginModal, 
    openRegisterModal, 
    isAnyModalOpen 
  } = useAuth();
  
  // Función para redirigir al dashboard
  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 flex justify-center gap-4 z-20 ${
      isAnyModalOpen ? "opacity-50 pointer-events-none" : ""
    }`}>
      {isLoading ? (
        <div className="p-2 text-gray-600">Cargando...</div>
      ) : isAuthenticated ? (
        <>
          <div className="flex items-center mr-4">
            <span className="text-gray-700">
              Hola, {currentUser?.email || "Usuario"}
            </span>
          </div>
          <button 
            onClick={navigateToDashboard}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-all"
          >
            Mi Panel
          </button>
          <button 
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-all"
          >
            Cerrar Sesión
          </button>
        </>
      ) : (
        <>
          <button 
            onClick={openLoginModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-all"
          >
            Iniciar Sesión
          </button>
          <button 
            onClick={openRegisterModal}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition-all"
          >
            Registrarse
          </button>
        </>
      )}
    </div>
  );
};