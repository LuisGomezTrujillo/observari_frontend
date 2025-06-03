import React from 'react';
import { InputText } from '../atoms/InputText';

export const FormLogin = ({ form, handleChange, errors = {}, onForgotPassword }) => {
  return (
    <div className="w-full max-h-[80vh] overflow-y-auto p-2">
      <div className="space-y-3">
        {/* Campo de Email */}
        <div>
          <InputText
            label="Correo electrónico"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required={true}
            className={errors.email ? 'border-red-300' : ''}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Campo de Contraseña */}
        <div>
          <InputText
            label="Contraseña"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required={true}
            className={errors.password ? 'border-red-300' : ''}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Enlace de Olvidé mi contraseña */}
        {onForgotPassword && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

