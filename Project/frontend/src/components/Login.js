import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import api from '../api/api';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // State for storing error messages
  const [errorMessage, setErrorMessage] = useState('');

  // If the user is already logged in, redirect to home.
  useEffect(() => {
    if (document.cookie.includes("jwt=")) {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Call the login API endpoint with the email and password
      const response = await api.post('/v1/users/login', { email, password });
      console.log(response.data.message);

      // Clear any previous error message
      setErrorMessage('');

      // Set authentication cookies
      document.cookie = `jwt=${JSON.stringify(response.data.jwt)}; path=/; Secure; SameSite=Strict`;
      document.cookie = `values=${JSON.stringify(response.data.values)}; path=/; Secure; SameSite=Strict`;

      // Navigate to the home page after a successful login
      navigate("/home");
    } catch (err) {
      console.error("Error logging in:", err);
      // Set error message from API response or a default message
      setErrorMessage(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-custom">
      {/* Floating decorative orbs */}
      <div className="orb-large"></div>
      <div className="orb-small"></div>

      <div className="relative flex items-center justify-center min-h-screen">
        <div className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-lg shadow-xl w-96">
          {/* Logo with light background */}
          <div className="flex justify-center mb-4">
            <img
              src="/images/logo_light_background.png"
              alt="Logo"
              className="h-16 object-contain"
            />
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <User className="absolute left-3 top-3 text-darkerPurple" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-70 border border-deeperPurple rounded-lg focus:outline-none focus:border-darkerPurple focus:ring-1 focus:ring-darkerPurple"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-darkerPurple" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-70 border border-deeperPurple rounded-lg focus:outline-none focus:border-darkerPurple focus:ring-1 focus:ring-darkerPurple"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-darkerPurple bg-opacity-80 text-white py-2 px-4 rounded-lg hover:bg-darkerPurple/90 focus:outline-none focus:ring-2 focus:ring-darkerPurple focus:ring-offset-2 transition-colors duration-300"
            >
              Sign In
            </button>
            <div className="text-center text-sm text-deeperPurple">
              Don't have an account?{' '}
              <a href="/signup" className="text-darkerPurple hover:text-deeperPurple font-medium">
                Sign up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;