import { useEffect, useState } from "react";
import API from "../api";
import "./driverdashboard.css";
import { motion } from "framer-motion";

function DriverDashboard({ setPage }) {
  const [wastes, setWastes] = useState([]);
  const driver = JSON.parse(localStorage.getItem("driver"));

  useEffect(() => {
    if (!driver || !driver._id) return;

    API.get(`/driver/wastes/${driver._id}`)
      .then(res => setWastes(res.data))
      .catch(err => console.error(err));

  }, [driver]); // ✅ FIXED ESLint warning

  const markAsCollected = async (id) => {
    try {
      await API.put(`/driver/collect/${id}`);

      alert("✅ Marked as collected");

      const res = await API.get(`/driver/wastes/${driver._id}`);
      setWastes(res.data);

    } catch (err) {
      console.error("❌ Collect Error:", err.response?.data || err.message);
      alert("Failed to update status");
    }
  };

  return (
    <div className="driver-dashboard-page">

      <button
        className="logout-btn"
        onClick={() => {
          localStorage.clear();
          setPage("home");
        }}
      >
        Logout
      </button>

      <div className="driver-content">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          🚚 Assigned Wastes
        </motion.h2>

        {wastes.length === 0 ? (
          <p>No assigned waste</p>
        ) : (
          wastes.map((w) => (
            <motion.div
              key={w._id}
              className="waste-card"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4 }}
              whileHover={{ scale: 1.03 }}
            >
              <p><b>Type:</b> {w.type}</p>
              <p><b>Description:</b> {w.description}</p>
              <p><b>Location:</b> {w.location}</p>
              <p><b>Weight:</b> {w.weight} kg</p>
              <p><b>Quantity:</b> {w.quantity}</p>

              <p>
                <b>Image:</b><br />
                {w.image ? (
                  <img
                    src={`https://waste-backend-1-b1lj.onrender.com/uploads/${w.image}`}
                    alt="waste"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginTop: "5px"
                    }}
                  />
                ) : (
                  "No Image"
                )}
              </p>

              <p className="status">
                <b>Status:</b> {w.status}
              </p>

              <p>
                <b>Pickup Date:</b> {w.pickupDate || "-"}
              </p>

              {w.status === "Assigned" && (
                <button
                  className="collect-btn"
                  onClick={() => markAsCollected(w._id)}
                >
                  ✅ Mark as Collected
                </button>
              )}
            </motion.div>
          ))
        )}

        <motion.button
          className="back-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPage("home")}
        >
          ⬅ Back to Home
        </motion.button>
      </div>
    </div>
  );
}

export default DriverDashboard;
