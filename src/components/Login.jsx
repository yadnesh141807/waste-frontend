import { useState } from "react";
import API from "../api";
import "./Login.css";
import { motion } from "framer-motion";

function Login({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and Password required");
      return;
    }

    try {
      const res = await API.post("/api/auth/login", {
        email,
        password,
      });

      // ✅ SAFE FIX (overwrite only)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify({
        _id: res.data.user._id,
        name: res.data.user.name,
        email: res.data.user.email,
      }));
      localStorage.setItem("role", "user");

      setPage("dashboard");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="login-page">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
      >
        <h2>🙎 User Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button onClick={handleLogin}>Login</button>

        <p className="link">
          New user?{" "}
          <span onClick={() => setPage("register")}>Register here</span>
        </p>

        <p className="back" onClick={() => setPage("home")}>
          ← Back to Home
        </p>
      </motion.div>
    </div>
  );
}

export default Login;