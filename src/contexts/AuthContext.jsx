import React, { createContext, useState, useContext, useEffect } from "react";
import { loginUser } from "../services/usersService";

// Crear el contexto
export const AuthContext = createContext(null);

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Comprobar si el usuario está autenticado al cargar
  useEffect(() => {
    const checkAuth = () => {
      const userLogged = localStorage.getItem("user_logged");
      const userEmail = localStorage.getItem("user_email");
      const token = localStorage.getItem("access_token");
      
      if (userLogged === "true" && token) {
        setIsAuthenticated(true);
        if (userEmail) {
          setCurrentUser({ email: userEmail });
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await loginUser(email, password);
      
      if (data.access_token) {
        localStorage.setItem("user_logged", "true");
        localStorage.setItem("user_email", email);
        localStorage.setItem("access_token", data.access_token);
        
        setIsAuthenticated(true);
        setCurrentUser({ email });
        closeModals();
        
        return { success: true };
      }
      return { success: false, error: "Credenciales inválidas" };
    } catch (error) {
      console.error("Error durante el login:", error);
      return { 
        success: false, 
        error: error.response?.data?.detail || "Error al conectar con el servidor" 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("user_logged");
    localStorage.removeItem("user_email");
    localStorage.removeItem("access_token");
    
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Funciones para gestionar modales
  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
    setIsCreateUserModalOpen(false);
    setIsEditUserModalOpen(false);
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
    setIsCreateUserModalOpen(false);
    setIsEditUserModalOpen(false);
  };

  const openCreateUserModal = () => {
    setIsCreateUserModalOpen(true);
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
    setIsEditUserModalOpen(false);
  };

  const openEditUserModal = (userId) => {
    setSelectedUserId(userId);
    setIsEditUserModalOpen(true);
    setIsCreateUserModalOpen(false);
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  const closeModals = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
    setIsCreateUserModalOpen(false);
    setIsEditUserModalOpen(false);
    setSelectedUserId(null);
  };

  // Verificar si algún modal está abierto
  const isAnyModalOpen = isLoginModalOpen || isRegisterModalOpen || isCreateUserModalOpen || isEditUserModalOpen;

  const value = {
    isAuthenticated,
    currentUser,
    isLoading,
    login,
    logout,
    isLoginModalOpen,
    isRegisterModalOpen,
    isCreateUserModalOpen,
    isEditUserModalOpen,
    selectedUserId,
    openLoginModal,
    openRegisterModal,
    openCreateUserModal,
    openEditUserModal,
    closeModals,
    isAnyModalOpen
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// import React, { createContext, useState, useContext, useEffect } from "react";
// import { loginUser } from "../services/usersService";

// // Crear el contexto
// export const AuthContext = createContext(null);

// // Hook personalizado para usar el contexto
// export const useAuth = () => useContext(AuthContext);

// // Proveedor del contexto
// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//   const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

//   // Comprobar si el usuario está autenticado al cargar
//   useEffect(() => {
//     const checkAuth = () => {
//       const userLogged = localStorage.getItem("user_logged");
//       const userEmail = localStorage.getItem("user_email");
      
//       if (userLogged === "true") {
//         setIsAuthenticated(true);
//         if (userEmail) {
//           setCurrentUser({ email: userEmail });
//         }
//       }
      
//       setIsLoading(false);
//     };
    
//     checkAuth();
//   }, []);

//   // Función para iniciar sesión
//   const login = async (email, password) => {
//     setIsLoading(true);
//     try {
//       const data = await loginUser(email, password);
      
//       if (data.access_token) {
//         localStorage.setItem("user_logged", "true");
//         localStorage.setItem("user_email", email);
        
//         setIsAuthenticated(true);
//         setCurrentUser({ email });
        
//         return { success: true };
//       }
//       return { success: false, error: "Credenciales inválidas" };
//     } catch (error) {
//       console.error("Error durante el login:", error);
//       return { 
//         success: false, 
//         error: error.response?.data?.detail || "Error al conectar con el servidor" 
//       };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Función para cerrar sesión
//   const logout = () => {
//     localStorage.removeItem("user_logged");
//     localStorage.removeItem("user_email");
//     localStorage.removeItem("access_token");
    
//     setIsAuthenticated(false);
//     setCurrentUser(null);
//   };

//   // Función para abrir modal de login
//   const openLoginModal = () => {
//     setIsLoginModalOpen(true);
//     setIsRegisterModalOpen(false);
//   };

//   // Función para abrir modal de registro
//   const openRegisterModal = () => {
//     setIsRegisterModalOpen(true);
//     setIsLoginModalOpen(false);
//   };

//   // Función para cerrar modales
//   const closeModals = () => {
//     setIsLoginModalOpen(false);
//     setIsRegisterModalOpen(false);
//   };

//   // Verificar si algún modal está abierto
//   const isAnyModalOpen = isLoginModalOpen || isRegisterModalOpen;

//   const value = {
//     isAuthenticated,
//     currentUser,
//     isLoading,
//     login,
//     logout,
//     isLoginModalOpen,
//     isRegisterModalOpen,
//     openLoginModal,
//     openRegisterModal,
//     closeModals,
//     isAnyModalOpen
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };