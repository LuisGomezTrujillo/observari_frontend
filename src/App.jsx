import React from "react";
import './index.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import { Login } from "./pages/auth/Login";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen pb-20">
          {/* <Navbar /> */}

          <div className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />

              {/* Rutas protegidas */}
              <Route element={<ProtectedRoute />}>
                <Route path="/users" element={<ListUsers />} />
                <Route path="/users/create" element={<CreateUser />} />
                <Route path="/users/:id" element={<EditUser />} />
                <Route path="/profiles" element={<ListProfiles />} />
                <Route path="/profiles/create" element={<CreateProfile />} />
                <Route path="/profiles/:id" element={<EditProfile />} />
                <Route path="/relationships" element={<ListRelationships />} />
                <Route path="/relationships/create" element={<CreateRelationship />} />
                <Route path="/relationships/:id" element={<EditRelationship />} />
              </Route>

              {/* Ruta de fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          {/* <AuthFooter /> */}
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
