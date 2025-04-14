import React from "react";
import { InputText } from "../atoms/InputText";
import { SelectInput } from "../atoms/SelectiInput";

export const FormPerfil = ({ form, handleChange }) => (
  <div>
    <InputText label="Primer Nombre" name="primerNombre" value={form.primerNombre} onChange={handleChange} />
    <InputText label="Segundo Nombre" name="segundoNombre" value={form.segundoNombre} onChange={handleChange} />
    <InputText label="Apellido Paterno" name="apellidoPaterno" value={form.apellidoPaterno} onChange={handleChange} />
    <InputText label="Apellido Materno" name="apellidoMaterno" value={form.apellidoMaterno} onChange={handleChange} />
    <InputText label="Fecha de Nacimiento" name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={handleChange} />
    <InputText label="Teléfono Móvil" name="telefono" type="tel" value={form.telefono} onChange={handleChange} />
    <InputText label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} />
    <SelectInput label="Ciudad" name="ciudad" value={form.ciudad} options={["Ciudad A", "Ciudad B"]} onChange={handleChange} />
    <SelectInput label="Departamento" name="departamento" value={form.departamento} options={["Depto A", "Depto B"]} onChange={handleChange} />
    <SelectInput label="País" name="pais" value={form.pais} options={["País A", "País B"]} onChange={handleChange} />
    <SelectInput label="Rol" name="rol" value={form.rol} options={["Admin", "Usuario"]} onChange={handleChange} />
    <SelectInput label="Relación" name="relacion" value={form.relacion} options={["Padre", "Madre"]} onChange={handleChange} />
  </div>
);