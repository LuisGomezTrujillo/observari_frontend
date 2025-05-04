import React, { useState, useEffect } from "react";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import Fundacion1Img from "../assets/fundacion1.jpg";
import Fundacion2Img from "../assets/fundacion2.jpg";
import Fundacion3Img from "../assets/fundacion3.jpg"; 
import LogoImg from "../assets/LogoCasaDelBambino.png";
import { HeroSection } from "../components/organisms/HeroSection";
import { isAuthenticated, logout, getCurrentUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Comprobamos si algún modal está abierto
  const isAnyModalOpen = isLoginOpen || isRegisterOpen;

  const heroImages = [Fundacion1Img, Fundacion2Img, Fundacion3Img];

  // Verificar si el usuario está autenticado al cargar el componente
  useEffect(() => {
    const checkAuthStatus = async () => {
      const authStatus = isAuthenticated();
      setUserAuthenticated(authStatus);
      
      if (authStatus) {
        try {
          const user = await getCurrentUser();
          setCurrentUser(user);
        } catch (error) {
          console.error("Error al obtener el usuario actual:", error);
          // Si hay un error al obtener el usuario, podría ser que el token esté expirado
          handleLogout();
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuthStatus();
  }, []);

  // Función para manejar el registro exitoso
  const handleRegisterSuccess = () => {
    // Podríamos mostrar un mensaje de éxito o redirigir al usuario
    setIsLoginOpen(true); // Abrir el modal de login después de un registro exitoso
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    logout();
    setUserAuthenticated(false);
    setCurrentUser(null);
    // Redirigir al usuario a la página principal
    navigate("/");
  };

  // Función para redirigir al dashboard
  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen relative">
      {/* Aplicamos el desenfoque directamente al contenedor principal */}
      <div className={`transition-all duration-300 ${isAnyModalOpen ? "blur-sm" : ""}`}>
        
         <HeroSection 
          images={heroImages}
          title="Bienvenidos a la Fundación Casa del Bambino"
          logo={LogoImg}
          subtitle="Un lugar donde los sueños se hacen realidad"
          textPosition="center"
          interval={5000}
        />

        {/* Fixed Bottom Buttons - Cambian dependiendo del estado de autenticación */}
        <div className={`fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 flex justify-center gap-4 z-20 ${
          isAnyModalOpen ? "opacity-50 pointer-events-none" : ""
        }`}>
          {isLoading ? (
            <div className="p-2 text-gray-600">Cargando...</div>
          ) : userAuthenticated ? (
            <>
              <div className="flex items-center mr-4">
                <span className="text-gray-700">
                  Hola, {currentUser?.full_name || currentUser?.username || "Usuario"}
                </span>
              </div>
              <button 
                onClick={navigateToDashboard}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-all"
              >
                Mi Panel
              </button>
              <button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-all"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-all"
              >
                Iniciar Sesión
              </button>
              <button 
                onClick={() => setIsRegisterOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition-all"
              >
                Registrarse
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modales - Fuera del contenedor principal para evitar el desenfoque en ellos */}
      <Login 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
      <Register 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)}
        onRegisterSuccess={handleRegisterSuccess}
      />
    </div>
  );
};