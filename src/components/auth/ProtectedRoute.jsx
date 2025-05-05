import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Componente para proteger rutas que requieren autenticación
 * Si el usuario no está autenticado, será redirigido a la página de login
 */
export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Si está cargando, mostrar un indicador de carga
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Si el usuario está autenticado, renderiza el componente hijo
  // Si no, redirige al login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { isAuthenticated } from "../../services/authService";

// /**
//  * Componente para proteger rutas que requieren autenticación
//  * Si el usuario no está autenticado, será redirigido a la página de login
//  */
// export const ProtectedRoute = () => {
//   const auth = isAuthenticated();
  
//   // Si el usuario está autenticado, renderiza el componente hijo
//   // Si no, redirige al login
//   return auth ? <Outlet /> : <Navigate to="/login" />;
// };