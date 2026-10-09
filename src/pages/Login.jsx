import React from 'react';
import {API_URL} from "../api/config";
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Register from './Register';
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                // Handle successful login (e.g., store token, redirect)
                console.log('Login successful:', data);
                localStorage.setItem('token', data.token); // Store the token in local storage
                navigate('/')
            } else {
                // Handle login error
                console.error('Login failed:', data.message);
                setError("Login failed: Invalid email or password")
            }
        } catch (error) {
            setError("Error during login")
            console.error('Error during login:', error);
        }
    };

    return (
        <div id='login' className="flex flex-col items-center justify-center min-h-screen gap-1 bg-slate-900 text-white">
            <h1>Login</h1>
            <form className="space-y-4 flex flex-col gap-2" onSubmit={(e) => {e.preventDefault(); handleLogin()}}>
                <input className="bg-slate-800 text-slate-300 placeholder:text-slate-500 border-slate-600 focus:ring-cyan-500 focus:border-cyan-500" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="bg-slate-800 text-slate-300 placeholder:text-slate-500 border-slate-600 focus:ring-cyan-500 focus:border-cyan-500" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
                )}
                <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded" type="submit">Login</button>
            </form>
            <a href="#signUp">
        <button id="signUp" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded">Sign Up</button></a>
        </div>
    );
}
export default Login; 