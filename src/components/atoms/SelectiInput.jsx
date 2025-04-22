import React from "react";

export const SelectInput = ({ 
  label, 
  name, 
  value, 
  options, 
  onChange, 
  isLoading = false 
}) => (
  <div className="flex flex-col mb-4">
    <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={isLoading}
      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
    >
      <option value="">Seleccione una opción</option>
      {Array.isArray(options) && options.map((opt) => (
        typeof opt === 'object' ? (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ) : (
          <option key={opt} value={opt}>
            {opt}
          </option>
        )
      ))}
    </select>
    {isLoading && (
      <p className="text-sm text-gray-500 mt-1">Cargando opciones...</p>
    )}
  </div>
);

// import React from "react";

// export const SelectInput = ({ label, name, value, options, onChange }) => (
//   <div className="flex flex-col mb-4">
//     <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">{label}</label>
//     <select
//       id={name}
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//     >
//       <option value="">Seleccione una opción</option>
//       {options.map((opt) => (
//         <option key={opt} value={opt}>{opt}</option>
//       ))}
//     </select>
//   </div>
// );
