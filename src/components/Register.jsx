import { useState } from "react";
import API from "../api";
import "./Register.css";
import { motion } from "framer-motion";   // 🔥 ADDED

function Register({ setPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("All fields required");
      return;
    }

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      setMsg("Registration successful. Please login.");
      setTimeout(() => setPage("login"), 1500);
    } catch (err) {
      setError("User already registered");
    }
  };

  return (
    <div className="register-page">
      <motion.div
        className="register-card"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
      >
        <h2>User Registration</h2>

        <input
          type="text"
          placeholder="Full Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}
        {msg && <p className="success">{msg}</p>}

        <button onClick={handleRegister}>Register</button>

        <p className="link">
          Already registered?{" "}
          <span onClick={() => setPage("login")}>Login</span>
        </p>

        <p className="back" onClick={() => setPage("home")}>
          ← Back to Home
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
