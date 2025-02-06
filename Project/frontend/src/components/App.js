import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { 
  Navbar, 
  Login, 
  Signup, 
  Home, 
  Cookbook, 
  Profile, 
  RecipeDetails, 
  RecipeGeneration, 
  IngredientGeneration,
  IngredientsDetails
} from "./";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

function SemiProtectedRoute({ children }) {
  // Allow access if the user has a JWT (logged in) OR a guest cookie.
  const jwt = getCookie("jwt");
  const isGuest = document.cookie.includes("guest=true");
  if (!jwt && !isGuest) {
    return <Navigate to="/login" />;
  }
  return children;
}

function FullProtectedRoute({ children }) {
  // Only allow access for a full user (JWT present, no guest cookie).
  const jwt = getCookie("jwt");
  const isGuest = document.cookie.includes("guest=true");
  if (!jwt || isGuest) {
    return <Navigate to="/home" />;
  }
  return children;
}

function PublicRoute({ children }) {
  // If a user is already logged in or is a guest, redirect to home.
  const jwt = getCookie("jwt");
  const isGuest = document.cookie.includes("guest=true");
  return jwt || isGuest ? <Navigate to="/home" /> : children;
}

function App() {
  return (
    <Routes>
      {/* Redirect base path to login */}
      <Route path="/" element={<Navigate to="/login" />} />
      
      {/* Public routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      
      {/* Routes accessible to both guests and logged-in users */}
      <Route
        path="/home"
        element={
          <SemiProtectedRoute>
            <div className="h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Home />
              </main>
            </div>
          </SemiProtectedRoute>
        }
      />

      <Route
        path="/recipe/generate"
        element={
          <SemiProtectedRoute>
            <div className="h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <RecipeGeneration />
              </main>
            </div>
          </SemiProtectedRoute>
        }
      />

      <Route
        path="/ingredient/generate"
        element={
          <SemiProtectedRoute>
            <div className="h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <IngredientGeneration />
              </main>
            </div>
          </SemiProtectedRoute>
        }
      />

      <Route
        path="/ingredient"
        element={
          <SemiProtectedRoute>
            <div className="h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <IngredientsDetails />
              </main>
            </div>
          </SemiProtectedRoute>
        }
      />

      <Route
        path="/recipe"
        element={
          <SemiProtectedRoute>
            <div className="h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <RecipeDetails />
              </main>
            </div>
          </SemiProtectedRoute>
        }
      />

      {/* Routes that require a full (non-guest) account */}
      <Route
        path="/cookbook"
        element={
          <FullProtectedRoute>
            <div className="h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Cookbook />
              </main>
            </div>
          </FullProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <FullProtectedRoute>
            <div className="h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Profile />
              </main>
            </div>
          </FullProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;