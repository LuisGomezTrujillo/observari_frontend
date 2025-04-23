import React from "react";
import './index.css' 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/molecules/Navbar";
import { Home } from "./pages/Home";
import { ListUsers } from "./pages/users/ListUsers";
import { CreateUser } from "./pages/users/CreateUser";
import { EditUser } from "./pages/users/EditUser";
import { ListProfiles } from "./pages/profiles/ListProfiles";
import { CreateProfile } from "./pages/profiles/CreateProfile";
import { EditProfile } from "./pages/profiles/EditProfile";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<ListUsers />} />
        <Route path="/users/create" element={<CreateUser />} />
        <Route path="/users/edit" element={<EditUser />} />
        <Route path="/profiles" element={<ListProfiles />} />
        <Route path="/users/:id" element={<EditUser />} />
        <Route path="/profiles/create" element={<CreateProfile />} />
        <Route path="/profiles" element={<ListProfiles />} />
        <Route path="/profiles/:id" element={<EditProfile />} />
      </Routes>
    </Router>
  );
}