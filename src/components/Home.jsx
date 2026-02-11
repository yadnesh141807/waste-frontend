import "./Home.css";
import { motion } from "framer-motion";

function Home({ setPage }) {
  return (
    <div className="app-layout">

      {/* ===== HEADER ===== */}
      <motion.header
        className="header"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2>🗑️ Daily Waste Collection System</h2>
      </motion.header>

      {/* ===== BODY ===== */}
      <div className="body-area">

        {/* LEFT SIDEBAR */}
        <motion.aside
          className="sidebar"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h3>Menu</h3>
          <ul>
            <li>🏠 Home</li>

            {/* USER LOGIN CLICK */}
            <li onClick={() => setPage("login")}>👤 User Login</li>

            {/* ADMIN LOGIN CLICK */}
            <li onClick={() => setPage("adminLogin")}>🛠️ Admin Login</li>

            {/* 🚚 DRIVER LOGIN CLICK (🔥 ADDED) */}
            <li onClick={() => setPage("driverLogin")}>🚚 Driver Login</li>

            {/* ABOUT US */}
            <li onClick={() => setPage("about")}>ℹ️ About Us</li>
          </ul>
        </motion.aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
          <motion.div
            className="login-cards"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >

            {/* USER LOGIN CARD */}
            <motion.div
              className="login-box"
              onClick={() => setPage("login")}
              whileHover={{ scale: 1.08, y: -8 }}
              whileTap={{ scale: 0.96 }}
            >
              <div className="icon">👤</div>
              <h3>User Login</h3>
              <p>Login as a user</p>
            </motion.div>

            {/* ADMIN LOGIN CARD */}
            <motion.div
              className="login-box admin"
              onClick={() => setPage("adminLogin")}
              whileHover={{ scale: 1.08, y: -8 }}
              whileTap={{ scale: 0.96 }}
            >
              <div className="icon">🛠️</div>
              <h3>Admin Login</h3>
              <p>Login as admin</p>
            </motion.div>

            {/* 🚚 DRIVER LOGIN CARD (🔥 ADDED) */}
            <motion.div
              className="login-box driver"
              onClick={() => setPage("driverLogin")}
              whileHover={{ scale: 1.08, y: -8 }}
              whileTap={{ scale: 0.96 }}
            >
              <div className="icon">🚚</div>
              <h3>Driver Login</h3>
              <p>Login as waste collector</p>
            </motion.div>

          </motion.div>
        </main>

      </div>

      {/* ===== FOOTER ===== */}
      <motion.footer
        className="footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p>© 2025 Daily Waste Collection | Clean City 🌱 Green Future</p>
      </motion.footer>

    </div>
  );
}

export default Home;
