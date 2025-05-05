import React from "react";
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Navbar } from "./components/molecules/Navbar";
import { Home } from "./pages/Home";
import { AuthFooter } from "./components/molecules/AuthFooter"
import { ListUsers } from "./pages/users/ListUsers";
import { CreateUser } from "./pages/users/CreateUser";
import { EditUser } from "./pages/users/EditUser";
import { ListProfiles } from "./pages/profiles/ListProfiles";
import { CreateProfile } from "./pages/profiles/CreateProfile";
import { EditProfile } from "./pages/profiles/EditProfile";
import { ListRelationships } from "./pages/relationships/ListRelationships";
import { CreateRelationship } from "./pages/relationships/CreateRelationship";
import { EditRelationship } from "./pages/relationships/EditRelationship";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen pb-20">
          <Navbar />

          <div className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Home />} />

              {/* Rutas protegidas */}
              <Route element={<ProtectedRoute />}>
                <Route path="/users" element={<ListUsers />} />
               
              </Route>

              {/* Ruta para login independiente (opcional si todo está en modales) */}
              {/* <Route path="/login" element={<LoginPage />} /> */}

              {/* Ruta de fallback */}
              <Route path="*" element={<div>Página no encontrada</div>} />
            </Routes>
          </div>

          <AuthFooter />
        </div>
      </AuthProvider>
    </BrowserRouter>

  );
}

