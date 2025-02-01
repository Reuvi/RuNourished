import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar, Login, Signup, Home } from "./";

// Helper function to get a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// ProtectedRoute: Only allow access if the "jwt" cookie exists
function ProtectedRoute({ children }) {
  const jwt = getCookie("jwt");
  return jwt ? children : <Navigate to="/login" />;
}

// PublicRoute: If user is already authenticated, redirect to home
function PublicRoute({ children }) {
  const jwt = getCookie("jwt");
  return jwt ? <Navigate to="/home" /> : children;
}

function App() {
  return (
    <Routes>
      {/* Redirect the base path to login */}
      <Route path="/" element={<Navigate to="/login" />} />
      
      {/* Public routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      
      {/* Protected Home route */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <div className="h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Home />
              </main>
            </div>
          </ProtectedRoute>
        }
      />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;