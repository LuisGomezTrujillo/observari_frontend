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
import { ListRelationships } from "./pages/relationships/ListRelationships";
import { CreateRelationship } from "./pages/relationships/CreateRelationship";
import { EditRelationship } from "./pages/relationships/EditRelationship";

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
        <Route path="/relationships/create" element={<CreateRelationship />} />
        <Route path="/relationships" element={<ListRelationships />} />
        <Route path="/relationships/:id" element={<EditRelationship />} />
      </Routes>
    </Router>
  );
}