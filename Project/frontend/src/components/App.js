import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar, Login, Signup, Home, Cookbook, Profile, ProtectedRoute, RecipeDetails } from "./";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

function ProtectedRouteWrapper({ children }) {
  const jwt = getCookie("jwt");
  return jwt ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const jwt = getCookie("jwt");
  return jwt ? <Navigate to="/home" /> : children;
}

function App() {
  return (
    <Routes>
      {/* Redirect base path to login */}
      <Route path="/" element={<Navigate to="/login" />} />
      
      {/* Public routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      
      {/* Protected Home route */}
      <Route
        path="/home"
        element={
          <ProtectedRouteWrapper>
            <div className="h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Home />
              </main>
            </div>
          </ProtectedRouteWrapper>
        }
      />

      {/* Protected Cookbook route */}
      <Route
        path="/cookbook"
        element={
          <ProtectedRouteWrapper>
            <div className="h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Cookbook />
              </main>
            </div>
          </ProtectedRouteWrapper>
        }
      />

      {/* Protected Profile route */}
      <Route
        path="/profile"
        element={
          <ProtectedRouteWrapper>
            <div className="h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Profile />
              </main>
            </div>
          </ProtectedRouteWrapper>
        }
      />

      {/* Protected Recipe Details route */}
      <Route
        path="/recipe"
        element={
          <ProtectedRouteWrapper>
            <div className="h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <RecipeDetails />
              </main>
            </div>
          </ProtectedRouteWrapper>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;