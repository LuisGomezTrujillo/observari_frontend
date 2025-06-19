import React, { useState } from "react";
import { InputText } from "../atoms/InputText";

export const FormRegister = ({ form = {}, handleChange, errors = {} }) => {
  const safeForm = {
    email: '',
    password: '',
    confirmPassword: '',
    ...form
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="w-full max-h-[80vh] overflow-y-auto p-2">
      <div className="space-y-4">
        {/* Email */}
        <div>
          <InputText
            label="Correo electrónico"
            name="email"
            id="register-email"
            type="email"
            value={safeForm.email}
            onChange={handleChange}
            required={true}
            className={errors?.email ? 'border-red-300' : ''}
          />
          {errors?.email && (
            <p className="mt-1 text-sm text-red-600" id="email-error">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <InputText
              label="Contraseña"
              name="password"
              id="register-password"
              type={showPassword ? "text" : "password"}
              value={safeForm.password}
              onChange={handleChange}
              required={true}
              className={errors?.password ? 'border-red-300 pr-10' : 'pr-10'}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-0 top-[30px] pr-3 flex items-center text-sm leading-5"
            >
              {showPassword ? (
                <EyeOffIcon />
              ) : (
                <EyeIcon />
              )}
            </button>
          </div>
          {errors?.password && (
            <p className="mt-1 text-sm text-red-600" id="password-error">
              {errors.password}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            La contraseña debe tener al menos 6 caracteres
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <div className="relative">
            <InputText
              label="Confirmar contraseña"
              name="confirmPassword"
              id="register-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={safeForm.confirmPassword}
              onChange={handleChange}
              required={true}
              className={errors?.confirmPassword ? 'border-red-300 pr-10' : 'pr-10'}
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-0 top-[30px] pr-3 flex items-center text-sm leading-5"
            >
              {showConfirmPassword ? (
                <EyeOffIcon />
              ) : (
                <EyeIcon />
              )}
            </button>
          </div>
          {errors?.confirmPassword && (
            <p className="mt-1 text-sm text-red-600" id="confirmPassword-error">
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Iconos como componentes para reutilización y claridad
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);


// import React, { useState } from "react";
// import { InputText } from "../atoms/InputText";

// export const FormRegister = ({ form = {}, handleChange, errors = {} }) => {
//   // Ensure form values are never undefined by providing default empty strings
//   const safeForm = {
//     email: '',
//     password: '',
//     confirmPassword: '',
//     ...form // Override defaults with actual values from props
//   };
  
//   // Estado para mostrar/ocultar contraseñas
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   // Función para cambiar visibilidad de contraseña
//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   // Función para cambiar visibilidad de confirmación de contraseña
//   const toggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   return (
//     <div className="w-full max-h-[80vh] overflow-y-auto p-2">
//       <div className="space-y-4">
//         {/* Email field */}
//         <div>
//           <InputText
//             label="Correo electrónico"
//             name="email"
//             type="email"
//             value={safeForm.email}
//             onChange={handleChange}
//             required={true}
//             className={errors?.email ? 'border-red-300' : ''}
//           />
//           {errors?.email && (
//             <p className="mt-1 text-sm text-red-600" id="email-error">
//               {errors.email}
//             </p>
//           )}
//         </div>
        
//         {/* Password field */}
//         <div>
//           <div className="relative">
//             <InputText
//               label="Contraseña"
//               name="password"
//               type={showPassword ? "text" : "password"}
//               value={safeForm.password}
//               onChange={handleChange}
//               required={true}
//               className={errors?.password ? 'border-red-300 pr-10' : 'pr-10'}
//             />
//             <button
//               type="button"
//               onClick={togglePasswordVisibility}
//               className="absolute right-0 top-[30px] pr-3 flex items-center text-sm leading-5"
//             >
//               {showPassword ? (
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                 </svg>
//               ) : (
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                 </svg>
//               )}
//             </button>
//           </div>
//           {errors?.password && (
//             <p className="mt-1 text-sm text-red-600" id="password-error">
//               {errors.password}
//             </p>
//           )}
//           <p className="mt-1 text-xs text-gray-500">
//             La contraseña debe tener al menos 6 caracteres
//           </p>
//         </div>
        
//         {/* Confirm Password field */}
//         <div>
//           <div className="relative">
//             <InputText
//               label="Confirmar contraseña"
//               name="confirmPassword"
//               type={showConfirmPassword ? "text" : "password"}
//               value={safeForm.confirmPassword}
//               onChange={handleChange}
//               required={true}
//               className={errors?.confirmPassword ? 'border-red-300 pr-10' : 'pr-10'}
//             />
//             <button
//               type="button"
//               onClick={toggleConfirmPasswordVisibility}
//               className="absolute right-0 top-[30px] pr-3 flex items-center text-sm leading-5"
//             >
//               {showConfirmPassword ? (
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                 </svg>
//               ) : (
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                 </svg>
//               )}
//             </button>
//           </div>
//           {errors?.confirmPassword && (
//             <p className="mt-1 text-sm text-red-600" id="confirmPassword-error">
//               {errors.confirmPassword}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
