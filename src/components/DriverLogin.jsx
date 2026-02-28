import { useState } from "react";
import API from "../api";
import "./driverlogin.css";
import { motion } from "framer-motion";   // 🔥 ADDED

function DriverLogin({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Email & Password required");
      return;
    }

    try {
      const res = await API.post("/api/driver/login", {
        email,
        password,
      });

      localStorage.setItem("driverId", res.data.driver._id);
      localStorage.setItem("driver", JSON.stringify(res.data.driver));
      localStorage.setItem("role", "driver");

      setPage("driverDashboard");
    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="driver-login-page">
      <motion.div
        className="driver-login-card"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
      >
        <h2>🚚 Driver Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <p className="back" onClick={() => setPage("home")}>
          ⬅ Back
        </p>
      </motion.div>
    </div>
  );
}

export default DriverLogin;
