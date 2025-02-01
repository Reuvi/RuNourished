import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import api from '../api/api';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.get('/v1/users/login');
            console.log(response);
            navigate("/home");
        } catch (err) {
            console.log("error");
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden" 
             style={{
               background: `radial-gradient(circle at 70% 20%, #9370DB 0%, transparent 25%),
                           radial-gradient(circle at 30% 80%, #9370DB 0%, transparent 25%),
                           linear-gradient(45deg, #A7E8D0, #ADD8E6, #B8B5E1, #F5E6CA)`
             }}>
            {/* Floating orb decorative elements */}
            <div className="absolute w-64 h-64 rounded-full blur-3xl opacity-60"
                 style={{
                   background: 'radial-gradient(circle, #F5E6CA, #ADD8E6)',
                   top: '20%',
                   left: '60%',
                   transform: 'translate(-50%, -50%)'
                 }}></div>
            <div className="absolute w-32 h-32 rounded-full blur-2xl opacity-50"
                 style={{
                   background: 'radial-gradient(circle, #B8B5E1, #A7E8D0)',
                   top: '60%',
                   left: '30%',
                   transform: 'translate(-50%, -50%)'
                 }}></div>

            <div className="relative flex items-center justify-center min-h-screen">
                <div className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-lg shadow-xl w-96">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
                        <p className="text-gray-600 mt-2">Please sign in to continue</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-500" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email Address"
                                    className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-70 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-70 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-purple-600 bg-opacity-80 text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-300"
                        >
                            Sign In
                        </button>

                        <div className="text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <a href="#" className="text-purple-700 hover:text-purple-800 font-medium">
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