import "./AdminLogin.css";
import { useState } from "react";
import API from "../api";
import { motion } from "framer-motion";   // 🔥 ADDED

function AdminLogin({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      // 🔥 FIXED ROUTE (ONLY CHANGE)
      const res = await API.post("/api/admin/login", {
        email,
        password,
      });

      // ✅ VERY IMPORTANT
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      setPage("adminDashboard");
    } catch (err) {
      setError("Invalid Admin Credentials");
    }
  };

  return (
    <div className="admin-login-page">
      <motion.div
        className="admin-login-card"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
      >
        <h2>Admin Login</h2>

        <input
          type="email"
          placeholder="Admin Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button onClick={handleLogin}>Login</button>

        <p className="back" onClick={() => setPage("home")}>
          ← Back to Home
        </p>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
