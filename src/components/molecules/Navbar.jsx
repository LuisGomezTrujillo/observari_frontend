import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Home, User, Handshake, Contact, LogIn, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Login } from "../../pages/auth/Login";
import { Register } from "../../pages/auth/Register"; // Importamos el componente Register
import Logo from "../../assets/Logo.png";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { 
    isAuthenticated, 
    currentUser, 
    logout, 
    isLoginModalOpen, 
    isRegisterModalOpen, 
    openLoginModal, 
    openRegisterModal, 
    closeModals
  } = useAuth();

  // Función para obtener la inicial del email
  const getEmailInitial = (email) => {
    if (!email) return "";
    return email.charAt(0).toUpperCase();
  };

  // Función para manejar inicio de sesión exitoso
  const handleAuthSuccess = () => {
    closeModals();
  };

  return (
    <>
      <nav className="bg-blue-600 p-4 text-white">
        <div className="flex justify-between items-center">
          {/* Logo y nombre */}
          <div className="flex items-center gap-2">
            <Link to="/">
              <div className="bg-white p-2 rounded-lg">
                <img src={Logo} alt="Casa del Bambino" className="h-12 w-auto" />
              </div>
            </Link>
            <h1 className="text-lg font-bold">Casa del Bambino</h1>
          </div>
        
          <div className="flex items-center gap-4">
            {/* Botón de inicio/cierre de sesión */}
            <div className="flex items-center">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white text-sm font-medium">
                      {getEmailInitial(currentUser?.email)}
                    </div>
                    <span className="hidden md:inline text-sm">
                      {currentUser?.email}
                    </span>
                  </div>
                  <button 
                    onClick={logout}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:inline">Cerrar sesión</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={openLoginModal}
                  className="flex items-center gap-1 bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden md:inline">Iniciar sesión</span>
                </button>
              )}
            </div>
            
            {/* Botón de menú móvil */}
            <button className="md:hidden" onClick={() => setOpen(!open)}>
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menú de navegación desktop */}
        <ul className="hidden md:flex gap-4 mt-2">
          <li className="flex items-center gap-1">
            <Home className="w-4 h-4" />
            <Link to="/" className="hover:underline">Inicio</Link>
          </li>
          
          {isAuthenticated && (
            <>
              <li className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <Link to="/users" className="hover:underline">Usuarios</Link>
              </li>
              <li className="flex items-center gap-1">
                <Contact className="w-4 h-4" />
                <Link to="/profiles" className="hover:underline">Perfiles</Link>
              </li>
              <li className="flex items-center gap-1">
                <Handshake className="w-4 h-4" />
                <Link to="/relationships" className="hover:underline">Relaciones</Link>
              </li>
            </>
          )}
        </ul>

        {/* Menú de navegación móvil */}
        {open && (
          <ul className="md:hidden mt-2 space-y-2">
            <li className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <Link to="/" className="block">Inicio</Link>
            </li>
            
            {isAuthenticated && (
              <>
                <li className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <Link to="/users" className="block">Usuarios</Link>
                </li>
                <li className="flex items-center gap-2">
                  <Contact className="w-4 h-4" />
                  <Link to="/profiles" className="block">Perfiles</Link>
                </li>
                <li className="flex items-center gap-2">
                  <Handshake className="w-4 h-4" />
                  <Link to="/relationships" className="block">Relaciones</Link>
                </li>
              </>
            )}
          </ul>
        )}
      </nav>

      {/* Modal de inicio de sesión */}
      {isLoginModalOpen && (
        <Login
          isOpen={isLoginModalOpen}
          onClose={closeModals}
          onLoginSuccess={handleAuthSuccess}
          onSwitchToRegister={openRegisterModal}
        />
      )}

      {/* Modal de registro */}
      {isRegisterModalOpen && (
        <Register
          isOpen={isRegisterModalOpen}
          onClose={closeModals}
          onRegisterSuccess={handleAuthSuccess}
          onSwitchToLogin={openLoginModal}
        />
      )}
    </>
  );
};