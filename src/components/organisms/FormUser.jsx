import React from "react";
import { InputText } from "../atoms/InputText";

export const FormUser = ({ form, handleChange, formIdPrefix = "" }) => (
  <div className="mb-6">
    <InputText 
      label="Email" 
      name="email" 
      id={`${formIdPrefix}-email`}
      type="email" 
      value={form.email} 
      onChange={handleChange} 
    />
    <InputText 
      label="Contraseña" 
      name="password" 
      id={`${formIdPrefix}-password`}
      type="password" 
      value={form.password} 
      onChange={handleChange} 
    />
  </div>
);


// import React from "react";
// import { InputText } from "../atoms/InputText";

// export const FormUser = ({ form, handleChange }) => (
//   <div className="mb-6">
//     <InputText 
//       label="Email" 
//       name="email" 
//       type="email" 
//       value={form.email} 
//       onChange={handleChange} 
//     />
//     <InputText 
//       label="Contraseña" 
//       name="password" 
//       type="password" 
//       value={form.password} 
//       onChange={handleChange} 
//     />
//   </div>
// );