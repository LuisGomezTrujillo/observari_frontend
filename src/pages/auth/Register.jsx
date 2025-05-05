import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/molecules/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { registerUser } from '../../services/authService';

export const Register = ({ isOpen, onClose, onRegisterSuccess, onSwitchToLogin }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Reiniciar el formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setFormData({
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
    setFormData(prevForm => ({
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
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato del correo electrónico es inválido';
    }
    
    // Validación de contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    // Validación de confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmar la contraseña es requerido';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      setSubmitError('');
      
      try {
        // Crear objeto de datos para enviar a la API
        const userData = {
          email: formData.email,
          password: formData.password
        };
        
        // Usar el servicio de autenticación para registrar
        const response = await registerUser(userData);
        
        // Si el registro es exitoso
        setSubmitSuccess(true);
        
        // Iniciar sesión automáticamente después del registro exitoso
        await login(formData.email, formData.password);
        
        // Notificar al componente padre del éxito y cerrar el modal después de 2 segundos
        setTimeout(() => {
          if (onRegisterSuccess) onRegisterSuccess();
          onClose();
        }, 2000);
      } catch (error) {
        console.error('Error al registrar:', error);
        
        if (error.response && error.response.status === 400) {
          // Error de validación o email duplicado
          if (error.response.data && error.response.data.detail && 
              error.response.data.detail.includes("email ya está en uso")) {
            setErrors(prev => ({ ...prev, email: "El email ya está en uso" }));
          } else {
            setSubmitError(error.response.data?.detail || 'Error en los datos enviados');
          }
        } else {
          // Error de red o de otro tipo
          setSubmitError('Error al procesar la solicitud. Intente nuevamente.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear una cuenta">
      <div className="space-y-6">
        {submitSuccess ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <p className="text-center">¡Registro exitoso! Iniciando sesión...</p>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {submitError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{submitError}</p>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600" id="email-error">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600" id="password-error">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar contraseña
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600" id="confirmPassword-error">
                    {errors.confirmPassword}
                  </p>
                )}
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
                    Registrando...
                  </>
                ) : (
                  "Registrarse"
                )}
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
                  onClick={onSwitchToLogin} 
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