import React from "react";
import { InputText } from "../atoms/InputText";

export const FormLogin = ({ form, handleChange }) => (
  <div className="space-y-4">
    <InputText
      label="Email"
      name="email"
      type="email"
      value={form.email}
      onChange={handleChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <InputText
      label="Password"
      name="password"
      type="password"
      value={form.password}
      onChange={handleChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);