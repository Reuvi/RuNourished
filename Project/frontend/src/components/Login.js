import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

function Login() {
    const navigate = useNavigate();


    const handleLogin = async () => {
        try {
            const response = await api.get('/v1/users/login');
            console.log(response)
            }
        catch(err)  {
            console.log("error");
        }
        navigate("/home");

    }

    return (
        <div>
            <h1> Login Template </h1>
            <div >
                <button type="button" class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900" onClick={handleLogin}> 
                    Login(Hello World)
                </button>
            </div>
        </div>


    )

}

export default Login;