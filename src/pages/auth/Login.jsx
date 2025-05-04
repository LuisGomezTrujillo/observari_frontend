import React, { useState, useEffect } from "react";
import { Modal } from "../../components/molecules/Modal";
import { FormLogin } from "../../components/organisms/FormLogin";
import { requestPasswordReset } from "../../services/authService";

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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isProcessingReset, setIsProcessingReset] = useState(false);

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
      setShowForgotPassword(false);
      setResetEmailSent(false);
      setResetEmail('');
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

  // Manejar cambio en el email para recuperación
  const handleResetEmailChange = (e) => {
    setResetEmail(e.target.value);
    // Limpiar mensajes de error cuando el usuario está escribiendo
    if (errors.resetEmail) {
      setErrors(prev => ({ ...prev, resetEmail: '' }));
    }
  };

  // Validar el formulario de login
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

  // Validar el email de recuperación
  const validateResetEmail = () => {
    if (!resetEmail.trim()) {
      setErrors(prev => ({ ...prev, resetEmail: 'El correo electrónico es requerido' }));
      return false;
    } else if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      setErrors(prev => ({ ...prev, resetEmail: 'El formato del correo electrónico es inválido' }));
      return false;
    }
    return true;
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

  // Manejar la solicitud de restablecimiento de contraseña
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (validateResetEmail()) {
      setIsProcessingReset(true);
      
      try {
        // Llamada real al servicio de autenticación
        const result = await requestPasswordReset(resetEmail);
        
        if (result.success) {
          setResetEmailSent(true);
          toast.success("¡Instrucciones enviadas! Revisa tu correo electrónico.");
        } else {
          setErrors(prev => ({ 
            ...prev, 
            resetEmail: result.message || 'Error al procesar la solicitud.' 
          }));
          toast.error(result.message || 'Error al procesar la solicitud.');
        }
      } catch (error) {
        console.error('Error en restablecimiento:', error);
        setErrors(prev => ({ 
          ...prev, 
          resetEmail: 'Error inesperado. Por favor, intenta más tarde.' 
        }));
        toast.error('Error inesperado. Por favor, intenta de nuevo más tarde.');
      } finally {
        setIsProcessingReset(false);
      }
    }
  };

  // Manejar el clic en "Olvidaste tu contraseña"
  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    // Pre-rellenar con el email si ya está ingresado en el formulario de login
    if (form.email) {
      setResetEmail(form.email);
    }
  };

  // Volver al formulario de login desde la recuperación de contraseña
  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setResetEmailSent(false);
    setErrors(prev => ({ ...prev, resetEmail: '' }));
  };

  // Renderizar el formulario de recuperación de contraseña
  const renderForgotPasswordForm = () => {
    if (resetEmailSent) {
      return (
        <div className="text-center py-6">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <p>Se han enviado las instrucciones para restablecer tu contraseña a:</p>
            <p className="font-semibold mt-2">{resetEmail}</p>
          </div>
          <p className="mb-4">Revisa tu bandeja de entrada y sigue las instrucciones proporcionadas.</p>
          <button
            type="button"
            onClick={handleBackToLogin}
            className="mt-2 px-4 py-2 text-sm font-medium text-blue-600 underline hover:text-blue-500"
          >
            Volver al inicio de sesión
          </button>
        </div>
      );
    }

    return (
      <form onSubmit={handlePasswordReset} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Restablecer contraseña
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
          </p>
          
          <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <div className="mt-1">
            <input
              id="reset-email"
              name="reset-email"
              type="email"
              value={resetEmail}
              onChange={handleResetEmailChange}
              required
              className={`appearance-none block w-full px-3 py-2 border ${
                errors.resetEmail ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="tu@correo.com"
            />
            {errors.resetEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.resetEmail}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between space-x-3">
          <button
            type="button"
            onClick={handleBackToLogin}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Volver
          </button>
          <button
            type="submit"
            disabled={isProcessingReset}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isProcessingReset ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isProcessingReset ? 'Enviando...' : 'Enviar instrucciones'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={showForgotPassword ? "Recuperar contraseña" : "Iniciar Sesión"}>
      <div className="space-y-6">
        {showForgotPassword ? (
          renderForgotPasswordForm()
        ) : submitSuccess ? (
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
                onForgotPassword={handleForgotPasswordClick}
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
