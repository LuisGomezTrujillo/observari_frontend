import React, { useState, useEffect } from 'react';
import { FormRegister } from '../../components/organisms/FormRegister';
import { registerUser } from '../../services/authService';
import { Modal } from '../../components/molecules/Modal';

// Función temporal de toast mientras agregas react-toastify
const toast = {
  success: (msg) => console.log('SUCCESS:', msg),
  error: (msg) => console.error('ERROR:', msg),
  warning: (msg) => console.warn('WARNING:', msg)
};

export const RegisterModal = ({ isOpen, onClose, onRegisterSuccess, onSwitchToLogin }) => {
  // Inicializar estado del formulario
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: ''
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
        email: '',
        password: '',
        confirmPassword: ''
      });
      setErrors({});
      setSubmitSuccess(false);
      setSubmitError('');
    }
  }, [isOpen]);

  // Manejar cambios en los campos del formulario
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
    } else if (form.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    // Validación de confirmación de contraseña
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Confirmar la contraseña es requerido';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      setSubmitError('');
      
      try {
        // Crear objeto de datos para enviar a la API
        const userData = {
          email: form.email,
          password: form.password
        };
        
        console.log('Enviando datos de registro:', userData);
        
        // Usar el servicio de autenticación para registrar
        const result = await registerUser(userData);
        
        if (result.success) {
          console.log('Registro exitoso:', result.data);
          setSubmitSuccess(true);
          
          // Mostrar mensaje de éxito
          toast.success('¡Registro exitoso! Ya puedes iniciar sesión.');
          
          // Notificar al componente padre del éxito y cerrar el modal después de 2 segundos
          setTimeout(() => {
            if (onRegisterSuccess) onRegisterSuccess();
            onClose();
          }, 2000);
        } else {
          // Manejar errores específicos
          if (result.status === 400) {
            if (result.message && result.message.includes("email ya está en uso")) {
              setErrors(prev => ({ ...prev, email: "El email ya está en uso" }));
              toast.error("El email ya está en uso");
            } else {
              setSubmitError(result.message || 'Error en los datos enviados');
              toast.error(result.message || 'Error en los datos enviados');
            }
          } else {
            setSubmitError(result.message || 'Error de conexión');
            toast.error(result.message || 'Error de conexión al servidor');
          }
        }
      } catch (error) {
        console.error('Error inesperado al registrar:', error);
        setSubmitError('Error inesperado al procesar la solicitud.');
        toast.error('Error inesperado. Por favor, intenta de nuevo más tarde.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear una cuenta">
      <div className="space-y-6">
        {submitSuccess ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <p className="text-center">¡Registro exitoso! Redireccionando al inicio de sesión...</p>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {submitError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{submitError}</p>
              </div>
            )}
            
            {isFormReady && (
              <FormRegister 
                form={form} 
                handleChange={handleChange} 
                errors={errors} 
              />
            )}
            
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isSubmitting ? 'Procesando...' : 'Registrarse'}
              </button>
            </div>
            
            <div className="text-sm text-center">
              <p className="text-gray-600">
                Al registrarte, aceptas nuestros{' '}
                <a href="/terms" className="font-medium text-blue-600 hover:text-blue-500">
                  Términos y Condiciones
                </a>
              </p>
            </div>
            
            <div className="text-sm text-center border-t pt-4">
              <p className="text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <button 
                  type="button"
                  onClick={() => {
                    if (onSwitchToLogin) {
                      onSwitchToLogin();
                    } else {
                      onClose();
                    }
                  }} 
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Inicia sesión aquí
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
