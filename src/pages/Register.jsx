import React from "react";
import { useState } from "react";
function Register() {
const [email, setEmail] = useState(""); 
const [password, setPassword] = useState("");
const [name, setName] = useState("");
return (
<div>
  <h2>Register</h2>
  <form>
    <div>
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
    <div>
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
    <div>
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
    <button type="submit">Register</button>
  </form>
</div>
);
}
export default Register;