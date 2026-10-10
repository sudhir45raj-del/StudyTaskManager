import React from "react";
import { useState } from "react";
import Login from "./Login";
import { API_URL } from "../api/config";
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState('')
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-1 bg-slate-900 text-white">
      <h2>Register</h2>
      <form className="space-y-4 flex flex-col gap-2" onSubmit={async (e) => {
        e.preventDefault();
        try {
          const response = await fetch('${API_URL}/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
          });
          const data = await response.json();
          if (response.ok) {
            console.log('Registration successful:', data);
          } else {
            setError("Registration failed");
            console.error('Registration failed:', data.message);
          }
        } catch (error) {
          setError("Error during registration")
          console.error('Error during registration:', error);
        }
      }}>
        <div>
          <input className="bg-slate-800 text-slate-300 placeholder:text-slate-500 border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
            placeholder="Name"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <input className="bg-slate-800 text-slate-300 placeholder:text-slate-500 border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
            placeholder="Email"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input className="bg-slate-800 text-slate-300 placeholder:text-slate-500 border-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
            placeholder="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-400">{error}</p>
        )}
        <button id="signUp" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded" type="submit">Sign Up</button>

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded">Login</button>
      </form>
    </div>
  );
}
export default Register;