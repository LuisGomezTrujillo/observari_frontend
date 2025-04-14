import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/molecules/Navbar";
import { Inicio } from "./pages/Inicio";
import { Usuarios } from "./pages/Usuarios";
import { Perfil } from "./pages/Perfil";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </Router>
  );
}