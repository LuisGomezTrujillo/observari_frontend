import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Home, User, Contact } from "lucide-react";
import Logo from "../../assets/Logo.png";

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/">
            <div className="bg-white p-2 rounded-lg">
              <img src={Logo} alt="Casa del Bambino" className="h-12 w-auto" />
            </div>
          </Link>
          <h1 className="text-lg font-bold">Casa del Bambino</h1>
        </div>
      
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <ul className="hidden md:flex gap-4">
          <li className="flex items-center gap-1">
            <Home className="w-4 h-4" />
            <Link to="/" className="hover:underline">Inicio</Link>
          </li>
          <li className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <Link to="/users" className="hover:underline">Usuarios</Link>
          </li>
          <li className="flex items-center gap-1">
            <Contact className="w-4 h-4" />
            <Link to="/profiles" className="hover:underline">Perfiles</Link>
          </li>
        </ul>
      </div>
      {open && (
        <ul className="md:hidden mt-2 space-y-2">
          <li className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            <Link to="/" className="block">Inicio</Link>
          </li>
          <li className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <Link to="/users" className="block">Usuarios</Link>
          </li>
          <li className="flex items-center gap-2">
            <Contact className="w-4 h-4" />
            <Link to="/profiles" className="block">Perfiles</Link>
          </li>
        </ul>
      )}
    </nav>
  );
};