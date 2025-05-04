import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Home, User, Contact, LogIn, LogOut, UserCircle } from "lucide-react";
import Logo from "../../assets/Logo.png";
import { Login } from "../../pages/auth/Login"; // Asegúrate de ajustar la ruta de importación según tu estructura

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  // Estado para controlar si el usuario está logueado o no
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Estado para guardar la información del usuario
  const [userInfo, setUserInfo] = useState({ email: "" });
  // Estado para controlar si el modal de login está abierto
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Función para obtener las iniciales del email
  const getEmailInitials = (email) => {
    if (!email) return "";
    const parts = email.split("@");
    return parts[0].substring(0, 2).toUpperCase();
  };

  // Función para manejar inicio de sesión exitoso
  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUserInfo({ email: userData.email });
    setIsLoginModalOpen(false);
  };

  // Función para manejar cierre de sesión
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserInfo({ email: "" });
  };

  // Función para abrir el modal de login
  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  // Función para cerrar el modal de login
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <>
      <nav className="bg-blue-600 p-4 text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link to="/">
              <div className="bg-white p-2 rounded-lg">
                <img src={Logo} alt="Casa del Bambino" className="h-12 w-auto" />
              </div>
            </Link>
            <h1 className="text-lg font-bold">Casa del Bambino</h1>
          </div>
        
          <div className="flex items-center gap-4">
            {/* Botones de inicio/cierre de sesión */}
            <div className="flex items-center">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white text-sm font-medium">
                      {getEmailInitials(userInfo.email)}
                    </div>
                    <span className="hidden md:inline text-sm">
                      {userInfo.email}
                    </span>
                  </div>
                  <button 
                    onClick={handleLogout}
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
        
        {isLoggedIn && (
          <>
            <li className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <Link to="/users" className="hover:underline">Usuarios</Link>
            </li>
            {/* Podemos descomentar estas opciones si las necesitas activar
            <li className="flex items-center gap-1">
              <Contact className="w-4 h-4" />
              <Link to="/profiles" className="hover:underline">Perfiles</Link>
            </li>
            <li className="flex items-center gap-1">
              <Contact className="w-4 h-4" />
              <Link to="/relationships" className="hover:underline">Relaciones</Link>
            </li> */}
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
          
          {isLoggedIn && (
            <>
              <li className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <Link to="/users" className="block">Usuarios</Link>
              </li>
              {/* Podemos descomentar estas opciones si son necesarias
              <li className="flex items-center gap-2">
                <Contact className="w-4 h-4" />
                <Link to="/profiles" className="block">Perfiles</Link>
              </li>
              <li className="flex items-center gap-2">
                <Contact className="w-4 h-4" />
                <Link to="/relationships" className="block">Relaciones</Link>
              </li> */}
            </>
          )}
        </ul>
      )}
    </nav>

      {/* Modal de inicio de sesión */}
      <Login
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onLoginSuccess={(userData) => handleLoginSuccess(userData)}
        onSwitchToRegister={() => {
          closeLoginModal();
          // Aquí podrías abrir un modal de registro si lo tienes
        }}
      />
    </>
  );
};

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { Menu, X, Home, User, Contact, LogIn, LogOut, UserCircle } from "lucide-react";
// import Logo from "../../assets/Logo.png";

// export const Navbar = () => {
//   const [open, setOpen] = useState(false);
//   // Estado para controlar si el usuario está logueado o no
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // Función para manejar inicio de sesión
//   const handleLogin = () => {
//     setIsLoggedIn(true);
//   };

//   // Función para manejar cierre de sesión
//   const handleLogout = () => {
//     setIsLoggedIn(false);
//   };

//   return (
//     <nav className="bg-blue-600 p-4 text-white">
//       <div className="flex justify-between items-center">
//         <div className="flex items-center gap-2">
//           <Link to="/">
//             <div className="bg-white p-2 rounded-lg">
//               <img src={Logo} alt="Casa del Bambino" className="h-12 w-auto" />
//             </div>
//           </Link>
//           <h1 className="text-lg font-bold">Casa del Bambino</h1>
//         </div>
      
//         <div className="flex items-center gap-4">
//           {/* Botones de inicio/cierre de sesión */}
//           <div className="flex items-center">
//             {isLoggedIn ? (
//               <div className="flex items-center gap-3">
//                 <UserCircle className="w-6 h-6" />
//                 <button 
//                   onClick={handleLogout}
//                   className="flex items-center gap-1 bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md"
//                 >
//                   <LogOut className="w-4 h-4" />
//                   <span className="hidden md:inline">Cerrar sesión</span>
//                 </button>
//               </div>
//             ) : (
//               <button 
//                 onClick={handleLogin}
//                 className="flex items-center gap-1 bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md"
//               >
//                 <LogIn className="w-4 h-4" />
//                 <span className="hidden md:inline">Iniciar sesión</span>
//               </button>
//             )}
//           </div>
          
//           <button className="md:hidden" onClick={() => setOpen(!open)}>
//             {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </div>
//       </div>

//       {/* Menú de navegación desktop */}
//       <ul className="hidden md:flex gap-4 mt-2">
//         <li className="flex items-center gap-1">
//           <Home className="w-4 h-4" />
//           <Link to="/" className="hover:underline">Inicio</Link>
//         </li>
        
//         {isLoggedIn && (
//           <>
//             <li className="flex items-center gap-1">
//               <User className="w-4 h-4" />
//               <Link to="/users" className="hover:underline">Usuarios</Link>
//             </li>
//             {/* Podemos descomentar estas opciones si las necesitas activar
//             <li className="flex items-center gap-1">
//               <Contact className="w-4 h-4" />
//               <Link to="/profiles" className="hover:underline">Perfiles</Link>
//             </li>
//             <li className="flex items-center gap-1">
//               <Contact className="w-4 h-4" />
//               <Link to="/relationships" className="hover:underline">Relaciones</Link>
//             </li> */}
//           </>
//         )}
//       </ul>

//       {/* Menú de navegación móvil */}
//       {open && (
//         <ul className="md:hidden mt-2 space-y-2">
//           <li className="flex items-center gap-2">
//             <Home className="w-4 h-4" />
//             <Link to="/" className="block">Inicio</Link>
//           </li>
          
//           {isLoggedIn && (
//             <>
//               <li className="flex items-center gap-2">
//                 <User className="w-4 h-4" />
//                 <Link to="/users" className="block">Usuarios</Link>
//               </li>
//               {/* Podemos descomentar estas opciones si son necesarias
//               <li className="flex items-center gap-2">
//                 <Contact className="w-4 h-4" />
//                 <Link to="/profiles" className="block">Perfiles</Link>
//               </li>
//               <li className="flex items-center gap-2">
//                 <Contact className="w-4 h-4" />
//                 <Link to="/relationships" className="block">Relaciones</Link>
//               </li> */}
//             </>
//           )}
//         </ul>
//       )}
//     </nav>
//   );
// };
