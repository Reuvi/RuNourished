// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar, Login, Signup, Home } from "./";

function App() {
  return (
    <Routes>
      {/* Redirect the base path to login */}
      <Route path="/" element={<Navigate to="/login" />} />
      
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Public Home route for now */}
      <Route
        path="/home"
        element={
          <div className="h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Home />
            </main>
          </div>
        }
      />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
