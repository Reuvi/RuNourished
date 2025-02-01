import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {Login, Home} from "."
import api from "../api/api";


function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const renderComponent = () => {
    switch (location.pathname) {
      case "/login":
        return <Login />;
      case "/home":
        return <Home />;
      default:
        return <Home />;
    }
  };
  return (
    <div>
      <h1>Default Header/Background</h1>
      {renderComponent()}
    </div>
  );
}

export default App;
