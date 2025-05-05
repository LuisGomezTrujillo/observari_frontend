import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../components/molecules/Modal";
import { useAuth } from "../../contexts/AuthContext";

export const Login = ({ isOpen, onClose, onLoginSuccess, onSwitchToRegister }) => {
  const navigate = useNavigate();
  const { login, openRegisterModal } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Reiniciar el formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setFormData({
        email: "",
        password: ""
      });
      setError(null);
      setSubmitSuccess(false);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Usar la función de login del contexto
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Mostrar mensaje de éxito
        setSubmitSuccess(true);
        
        // Después de un breve retraso, notificar al padre y cerrar el modal
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess();
          onClose();
        }, 1500);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Error durante el login:", err);
      setError("Error al conectar con el servidor. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSwitchToRegister = () => {
    onClose();
    openRegisterModal();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Iniciar Sesión">
      <div className="space-y-6">
        {submitSuccess ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <p className="text-center">¡Inicio de sesión exitoso! Redireccionando...</p>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}
            
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <>
                    <span className="inline-block mr-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar sesión"
                )}
              </button>
            </div>
            
            <div className="text-sm text-center border-t pt-4">
              <p className="text-gray-600">
                ¿No tienes una cuenta?{' '}
                <button 
                  type="button"
                  onClick={handleSwitchToRegister} 
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginUser } from "../../services/usersService";
// import { Modal } from "../../components/molecules/Modal";

// export const Login = ({ isOpen, onClose, onLoginSuccess, onSwitchToRegister }) => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: "",
//     password: ""
//   });
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [submitSuccess, setSubmitSuccess] = useState(false);

//   // Reiniciar el formulario cuando se abre el modal
//   useEffect(() => {
//     if (isOpen) {
//       setFormData({
//         email: "",
//         password: ""
//       });
//       setError(null);
//       setSubmitSuccess(false);
//     }
//   }, [isOpen]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       // Llamamos al servicio de login
//       const data = await loginUser(formData.email, formData.password);
      
//       // Si el login es exitoso
//       if (data.access_token) {
//         localStorage.setItem("user_logged", "true");
        
//         // Mostrar mensaje de éxito
//         setSubmitSuccess(true);
        
//         // Después de un breve retraso, notificar al padre y cerrar el modal
//         setTimeout(() => {
//           if (onLoginSuccess) onLoginSuccess();
//           // Opcional: redirigir a la página de usuarios
//           // navigate("/users");
//           onClose();
//         }, 1500);
//       }
//     } catch (err) {
//       console.error("Error durante el login:", err);
      
//       if (err.response) {
//         // Error específico de la API
//         setError(err.response.data?.detail || "Credenciales incorrectas.");
//       } else {
//         // Error de red o de otro tipo
//         setError("Error al conectar con el servidor. Intente nuevamente.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title="Iniciar Sesión">
//       <div className="space-y-6">
//         {submitSuccess ? (
//           <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//             <p className="text-center">¡Inicio de sesión exitoso! Redireccionando...</p>
//           </div>
//         ) : (
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             {error && (
//               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
//                 {error}
//               </div>
//             )}
            
//             <div className="rounded-md shadow-sm -space-y-px">
//               <div>
//                 <label htmlFor="email" className="sr-only">
//                   Email
//                 </label>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                   placeholder="Email"
//                   value={formData.email}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label htmlFor="password" className="sr-only">
//                   Contraseña
//                 </label>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="current-password"
//                   required
//                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                   placeholder="Contraseña"
//                   value={formData.password}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
            
//             <div className="flex items-center justify-between mt-2">
//               <div className="flex items-center">
//                 <input
//                   id="remember-me"
//                   name="remember-me"
//                   type="checkbox"
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
//                   Recordarme
//                 </label>
//               </div>

//               <div className="text-sm">
//                 <button
//                   type="button"
//                   className="font-medium text-blue-600 hover:text-blue-500"
//                 >
//                   ¿Olvidaste tu contraseña?
//                 </button>
//               </div>
//             </div>

//             <div className="flex justify-end space-x-3 mt-4">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
//               >
//                 Cancelar
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
//                   loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
//                 }`}
//               >
//                 {loading ? (
//                   <>
//                     <span className="inline-block mr-2">
//                       <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                     </span>
//                     Iniciando sesión...
//                   </>
//                 ) : (
//                   "Iniciar sesión"
//                 )}
//               </button>
//             </div>
            
//             <div className="text-sm text-center border-t pt-4">
//               <p className="text-gray-600">
//                 ¿No tienes una cuenta?{' '}
//                 <button 
//                   type="button"
//                   onClick={onSwitchToRegister} 
//                   className="font-medium text-blue-600 hover:text-blue-500"
//                 >
//                   Regístrate aquí
//                 </button>
//               </p>
//             </div>
//           </form>
//         )}
//       </div>
//     </Modal>
//   );
// };
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginUser } from "../../services/usersService";

// export const Login = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: "",
//     password: ""
//   });
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       // Llamamos al servicio de login
//       const data = await loginUser(formData.email, formData.password);
      
//       // Guardamos el token en localStorage (esto ya se hace en loginUser)
      
//       // Opcional: guardar información del usuario en localStorage o en estado global
//       if (data.access_token) {
//         localStorage.setItem("user_logged", "true");
        
//         // Redirigir a la página principal o de usuarios
//         navigate("/users");
//       }
//     } catch (err) {
//       console.error("Error durante el login:", err);
      
//       if (err.response) {
//         // Error específico de la API
//         setError(err.response.data?.detail || "Credenciales incorrectas.");
//       } else {
//         // Error de red o de otro tipo
//         setError("Error al conectar con el servidor. Intente nuevamente.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Iniciar sesión
//           </h2>
//         </div>
        
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
//             {error}
//           </div>
//         )}
        
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <label htmlFor="email" className="sr-only">
//                 Email
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Email"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">
//                 Contraseña
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 autoComplete="current-password"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Contraseña"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={loading}
//               className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
//                 loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
//               } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
//             >
//               {loading ? (
//                 <span className="absolute left-0 inset-y-0 flex items-center pl-3">
//                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                 </span>
//               ) : (
//                 <span className="absolute left-0 inset-y-0 flex items-center pl-3">
//                   <svg className="h-5 w-5 text-blue-400 group-hover:text-blue-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                     <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
//                   </svg>
//                 </span>
//               )}
//               {loading ? "Iniciando sesión..." : "Iniciar sesión"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

