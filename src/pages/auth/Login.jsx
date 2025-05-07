import React, { useState } from "react";
import { Modal } from "../../components/molecules/Modal";
import { InputText } from "../../components/atoms/InputText";
import { useAuth } from "../../contexts/AuthContext";

export const Login = () => {
  const { isLoginModalOpen, closeModals, login } = useAuth();
  
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.email || !form.password) {
      setError("Por favor ingrese email y contraseña");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await login(form.email, form.password);
      if (!result.success) {
        setError(result.error || "Error al iniciar sesión");
      }
    } catch (err) {
      console.error("Error durante el login:", err);
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    // Función para cambiar al modal de registro si lo necesitas
    // En este caso, cerraría el de login y abriría el de registro
    closeModals();
    // openRegisterModal(); // Esta función estaría en AuthContext
  };

  return (
    <Modal isOpen={isLoginModalOpen} onClose={closeModals} title="Iniciar Sesión">
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputText
          label="Correo Electrónico"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        
        <InputText
          label="Contraseña"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
        
        {error && (
          <div className="text-red-600 text-sm py-2">{error}</div>
        )}
        
        <div className="flex flex-col space-y-4 pt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
          
          <div className="text-center text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <button
              type="button"
              className="text-blue-600 hover:underline focus:outline-none"
              onClick={handleRegisterClick}
            >
              Regístrate aquí
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Modal } from "../../components/molecules/Modal";
// import { useAuth } from "../../contexts/AuthContext";

// export const Login = ({ isOpen, onClose, onLoginSuccess, onSwitchToRegister }) => {
//   const navigate = useNavigate();
//   const { login, openRegisterModal } = useAuth();
  
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
//       // Usar la función de login del contexto
//       const result = await login(formData.email, formData.password);
      
//       if (result.success) {
//         // Mostrar mensaje de éxito
//         setSubmitSuccess(true);
        
//         // Después de un breve retraso, notificar al padre y cerrar el modal
//         setTimeout(() => {
//           if (onLoginSuccess) onLoginSuccess();
//           onClose();
//         }, 1500);
//       } else {
//         setError(result.error);
//       }
//     } catch (err) {
//       console.error("Error durante el login:", err);
//       setError("Error al conectar con el servidor. Intente nuevamente.");
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const handleSwitchToRegister = () => {
//     onClose();
//     openRegisterModal();
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
//                   onClick={handleSwitchToRegister} 
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

