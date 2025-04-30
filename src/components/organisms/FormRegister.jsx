import React from "react";
import { InputText } from "../atoms/InputText";

export const FormRegister = ({ form, handleChange }) => (
  <div className="space-y-4">
    <InputText
      label="Email"
      name="email"
      type="email"
      value={form.email}
      onChange={handleChange}
      required
    />
    <InputText
      label="Password"
      name="password"
      type="password"
      value={form.password}
      onChange={handleChange}
      required
    />
    <InputText
      label="Confirm Password"
      name="confirmPassword"
      type="password"
      value={form.confirmPassword}
      onChange={handleChange}
      required
    />
  </div>
);