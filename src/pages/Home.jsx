import React, { useState, useEffect } from "react";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register"; // Cambiado de RegisterModal a Register
import Fundacion1Img from "../assets/fundacion1.jpg";
import Fundacion2Img from "../assets/fundacion2.jpg";
import Fundacion3Img from "../assets/fundacion3.jpg"; 
import LogoImg from "../assets/LogoCasaDelBambino.png";
import { HeroSection } from "../components/organisms/HeroSection";
import { AuthFooter } from "../components/molecules/AuthFooter"; // Importar el nuevo componente
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
    setIsRegisterOpen(false);
    setIsLoginOpen(true); // Abrir el modal de login después de un registro exitoso
  };

  // Función para manejar el inicio de sesión exitoso
  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    setUserAuthenticated(true);
    // Actualizar los datos del usuario actual
    checkUserData();
  };

  // Función para comprobar los datos del usuario
  const checkUserData = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error al obtener el usuario después del login:", error);
    }
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    logout();
    setUserAuthenticated(false);
    setCurrentUser(null);
    // Redirigir al usuario a la página principal
    navigate("/");
  };

  // Función para cambiar entre modales
  const switchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  // Funciones para manejar los botones del AuthFooter
  const handleLoginClick = () => setIsLoginOpen(true);
  const handleRegisterClick = () => setIsRegisterOpen(true);

  return (
    <div className="min-h-screen relative">
      {/* Contenedor principal con efecto de desenfoque cuando hay un modal abierto */}
      <div className={`transition-all duration-300 ${isAnyModalOpen ? "blur-sm" : ""}`}>
        
         <HeroSection 
          images={heroImages}
          title="Bienvenido a la Fundación Casa del Bambino"
          logo={LogoImg}
          subtitle="Educación Montessori"
          textPosition="center"
          interval={5000}
        />

        {/* Componente AuthFooter */}
        <AuthFooter 
          isLoading={isLoading}
          userAuthenticated={userAuthenticated}
          currentUser={currentUser}
          onLogout={handleLogout}
          onLogin={handleLoginClick}
          onRegister={handleRegisterClick}
          isAnyModalOpen={isAnyModalOpen}
        />
      </div>

      {/* Modales */}
      <Login 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={switchToRegister}
      />
      <Register 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)}
        onRegisterSuccess={handleRegisterSuccess}
        onSwitchToLogin={switchToLogin}
      />
    </div>
  );
};