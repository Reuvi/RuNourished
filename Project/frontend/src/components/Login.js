import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import api from '../api/api';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // If the user is already logged in or is a guest, redirect to home.
    if (document.cookie.includes("jwt=") || document.cookie.includes("guest=true")) {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Call your login API endpoint with the email and password
      const response = await api.post('/v1/users/login', { email, password });
      console.log(response.data.message);
      setErrorMessage('');

      // Set authentication cookies
      document.cookie = `jwt=${JSON.stringify(response.data.jwt)}; path=/; Secure; SameSite=Strict`;
      document.cookie = `values=${JSON.stringify(response.data.values)}; path=/; Secure; SameSite=Strict`;
      // Clear any guest cookie if present
      document.cookie = "guest=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      navigate("/home");
    } catch (err) {
      console.error("Error logging in:", err);
      setErrorMessage(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  const handleGuestLogin = () => {
    // Clear any existing auth cookies
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "values=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Set guest cookie
    document.cookie = "guest=true; path=/; Secure; SameSite=Strict";
    navigate("/home");
  };

  return (
    <div className="h-screen relative overflow-hidden bg-custom">
      <div className="orb-large"></div>
      <div className="orb-small"></div>

      <div className="relative flex items-center justify-center h-screen">
        <div className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-lg shadow-xl w-96">
          <div className="flex justify-center mb-4">
            <img
              src="/images/logo_light_background.png"
              alt="Logo"
              className="h-16 object-contain"
            />
          </div>

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
          </form>
          <div className="mt-4 text-center text-sm text-deeperPurple">
            Don't have an account?{' '}
            <a href="/signup" className="text-darkerPurple hover:text-deeperPurple font-medium">
              Sign up
            </a>
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={handleGuestLogin}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-300"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;