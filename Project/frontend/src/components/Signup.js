import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import api from '../api/api';

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Adjust the endpoint and payload as needed.
      const response = await api.post('/v1/users/signup', { username, email, password });
      console.log(response);
      // Save the auth token (or similar) to localStorage.
      localStorage.setItem("authToken", response.data.token);
      navigate("/home");
    } catch (err) {
      console.error("Error signing up:", err);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-custom">
      {/* Floating decorative orbs */}
      <div className="orb-large"></div>
      <div className="orb-small"></div>
      
      <div className="relative flex items-center justify-center min-h-screen">
        <div className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-lg shadow-xl w-96">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-darkerPurple">Create Account</h1>
            <p className="text-deeperPurple mt-2">Sign up to get started</p>
          </div>
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="relative">
              <User className="absolute left-3 top-3 text-darkerPurple" size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-70 border border-deeperPurple rounded-lg focus:outline-none focus:border-darkerPurple focus:ring-1 focus:ring-darkerPurple"
                required
              />
            </div>
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
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;