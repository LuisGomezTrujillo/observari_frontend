import React, { useState, useEffect } from "react";
import { Modal } from "../../components/molecules/Modal";
import { FormLogin } from "../../components/organisms/FormLogin";

// Función temporal de toast mientras agregas react-toastify
const toast = {
  success: (msg) => console.log('SUCCESS:', msg),
  error: (msg) => console.error('ERROR:', msg),
  warning: (msg) => console.warn('WARNING:', msg)
};

export const Login = ({ isOpen, onClose, onLoginSuccess, onSwitchToRegister }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  
  const [errors, setErrors] = useState({});
  const [isFormReady, setIsFormReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Asegurar que el formulario está listo antes de renderizar
  useEffect(() => {
    setIsFormReady(true);
  }, []);

  // Reiniciar el formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setForm({
        email: "",
        password: "",
      });
      setErrors({});
      setSubmitSuccess(false);
      setSubmitError('');
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
    
    // Limpiar error específico cuando el usuario comienza a corregir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validar el formulario
  const validateForm = () => {
    const newErrors = {};
    
    // Validación de email
    if (!form.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'El formato del correo electrónico es inválido';
    }
    
    // Validación de contraseña
    if (!form.password) {
      newErrors.password = 'La contraseña es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      setSubmitError('');
      
      try {
        // Aquí iría la llamada al servicio de autenticación
        // Por ahora solo simulamos el proceso
        console.log("Login:", form);
        
        // Simulación de login exitoso (cambiar por tu servicio real)
        setTimeout(() => {
          setSubmitSuccess(true);
          toast.success("¡Inicio de sesión exitoso!");
          
          // Notificar al componente padre del éxito y cerrar el modal
          setTimeout(() => {
            if (onLoginSuccess) onLoginSuccess();
            onClose();
          }, 1500);
        }, 1000);
        
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        setSubmitError('Error inesperado al procesar la solicitud.');
        toast.error('Error inesperado. Por favor, intenta de nuevo más tarde.');
      } finally {
        setIsSubmitting(false);
      }
    }
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
            {submitError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{submitError}</p>
              </div>
            )}
            
            {isFormReady && (
              <FormLogin 
                form={form} 
                handleChange={handleChange} 
                errors={errors} 
              />
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? 'Procesando...' : 'Iniciar Sesión'}
              </button>
            </div>
            
            <div className="text-sm text-center border-t pt-4">
              <p className="text-gray-600">
                ¿No tienes una cuenta?{' '}
                <button 
                  type="button"
                  onClick={() => {
                    if (onSwitchToRegister) {
                      onSwitchToRegister();
                    } else {
                      onClose();
                    }
                  }} 
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
// import { Modal } from "../../components/molecules/Modal";
// import { FormLogin } from "../../components/organisms/FormLogin";

// // Función temporal de toast mientras agregas react-toastify
// const toast = {
//   success: (msg) => console.log('SUCCESS:', msg),
//   error: (msg) => console.error('ERROR:', msg),
//   warning: (msg) => console.warn('WARNING:', msg)
// };

// export const Login = ({ isOpen, onClose, onLoginSuccess }) => {
//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });
  
//   const [errors, setErrors] = useState({});
//   const [isFormReady, setIsFormReady] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitSuccess, setSubmitSuccess] = useState(false);
//   const [submitError, setSubmitError] = useState('');

//   // Asegurar que el formulario está listo antes de renderizar
//   useEffect(() => {
//     setIsFormReady(true);
//   }, []);

//   // Reiniciar el formulario cuando se abre el modal
//   useEffect(() => {
//     if (isOpen) {
//       setForm({
//         email: "",
//         password: "",
//       });
//       setErrors({});
//       setSubmitSuccess(false);
//       setSubmitError('');
//     }
//   }, [isOpen]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prevForm => ({
//       ...prevForm,
//       [name]: value
//     }));
    
//     // Limpiar error específico cuando el usuario comienza a corregir
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   // Validar el formulario
//   const validateForm = () => {
//     const newErrors = {};
    
//     // Validación de email
//     if (!form.email.trim()) {
//       newErrors.email = 'El correo electrónico es requerido';
//     } else if (!/\S+@\S+\.\S+/.test(form.email)) {
//       newErrors.email = 'El formato del correo electrónico es inválido';
//     }
    
//     // Validación de contraseña
//     if (!form.password) {
//       newErrors.password = 'La contraseña es requerida';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (validateForm()) {
//       setIsSubmitting(true);
//       setSubmitError('');
      
//       try {
//         // Aquí iría la llamada al servicio de autenticación
//         // Por ahora solo simulamos el proceso
//         console.log("Login:", form);
        
//         // Simulación de login exitoso (cambiar por tu servicio real)
//         setTimeout(() => {
//           setSubmitSuccess(true);
//           toast.success("¡Inicio de sesión exitoso!");
          
//           // Notificar al componente padre del éxito y cerrar el modal
//           setTimeout(() => {
//             if (onLoginSuccess) onLoginSuccess();
//             onClose();
//           }, 1500);
//         }, 1000);
        
//       } catch (error) {
//         console.error('Error al iniciar sesión:', error);
//         setSubmitError('Error inesperado al procesar la solicitud.');
//         toast.error('Error inesperado. Por favor, intenta de nuevo más tarde.');
//       } finally {
//         setIsSubmitting(false);
//       }
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
//             {submitError && (
//               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//                 <p>{submitError}</p>
//               </div>
//             )}
            
//             {isFormReady && (
//               <FormLogin 
//                 form={form} 
//                 handleChange={handleChange} 
//                 errors={errors} 
//               />
//             )}
            
//             <div className="flex justify-end space-x-3">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
//               >
//                 Cancelar
//               </button>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
//                   isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
//                 }`}
//               >
//                 {isSubmitting ? 'Procesando...' : 'Iniciar Sesión'}
//               </button>
//             </div>
            
//             <div className="text-sm text-center border-t pt-4">
//               <p className="text-gray-600">
//                 ¿No tienes una cuenta?{' '}
//                 <button 
//                   type="button"
//                   onClick={() => {
//                     onClose();
//                     // Aquí se podría agregar lógica para abrir el modal de registro
//                   }} 
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