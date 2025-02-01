import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { Login, Home } from "."; // Assumes Login and Home components are exported from index.js

function App() {
  const location = useLocation();

  // Render the proper component based on the current route
  const renderComponent = () => {
    switch (location.pathname) {
      case "/login":
        return <Login />;
      case "/home":
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-paleYellow">
      <Navbar />
      <div className="p-4">{renderComponent()}</div>
    </div>
  );
}

export default App;