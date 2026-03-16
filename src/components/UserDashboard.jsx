import "./UserDashboard.css";
import WasteForm from "./WasteForm";
import { useState, useEffect } from "react";
import API from "../api";
import BhangarMenu from "./BhangarMenu";

/* 🔥 ANALYTICS IMPORTS */
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

/* 🔥 MOTION */
import { motion } from "framer-motion";

function UserDashboard({ setPage }) {
  const [selectedType, setSelectedType] = useState("");
  const [wasteList, setWasteList] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showBhangarMenu, setShowBhangarMenu] = useState(false);

  const loadMyWaste = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await API.get("/api/waste/my", {
        headers: { Authorization: token },
      });
      setWasteList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadMyWaste();
  }, []);

  const deleteWaste = async (id) => {
    const token = localStorage.getItem("token");
    await API.delete(`/api/waste/${id}`, {
      headers: { Authorization: token },
    });
    loadMyWaste();
  };

  if (showBhangarMenu) {
    return (
      <BhangarMenu
        setSelectedType={(type) => {
          setSelectedType(type);
          setShowBhangarMenu(false);
        }}
      />
    );
  }

  if (selectedType) {
    return (
      <WasteForm
        type={selectedType}
        setSelectedType={setSelectedType}
        wasteList={wasteList}
        setWasteList={setWasteList}
        refreshWaste={loadMyWaste}
          setShowBhangarMenu={setShowBhangarMenu}
      />
    );
  }

  /* 🔥 ANALYTICS DATA */
  const pieData = [
    { name: "Dry", value: wasteList.filter(w => w.type === "Dry").length },
    { name: "Wet", value: wasteList.filter(w => w.type === "Wet").length },
    { name: "Bhangar", value: wasteList.filter(w => w.type && w.type.includes("Bhangar")).length },
  ];

  const monthMap = {};
  wasteList.forEach(w => {
    if (!w.createdAt) return;
    const month = new Date(w.createdAt).toLocaleString("default", { month: "short" });
    monthMap[month] = (monthMap[month] || 0) + 1;
  });

  const lineData = Object.keys(monthMap).map(m => ({
    month: m,
    count: monthMap[m]
  }));

  const formatStatus = (status) => {
    if (status === "Assigned") return "Accepted, Assigned";
    if (status === "Collected") return "Collected";
    if (status === "Accepted") return "Accepted";
    return "Pending";
  };

  return (
    <motion.div
      className="dashboard-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="dashboard-layout">

        {/* ================= SIDE MENU ================= */}
        <motion.aside
          className="side-menu"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3>Menu</h3>

          <button onClick={() => {
            setShowReport(false);
            setShowProfile(false);
          }}>🏠 Dashboard</button>

          <button onClick={() => {
            setShowReport(true);
            setShowProfile(false);
          }}>📊 Reports</button>

          <button onClick={() => {
            setShowProfile(true);
            setShowReport(false);
          }}>👤 Profile</button>

          <button onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setPage("home");
          }}>↩ Logout</button>
        </motion.aside>

        {/* ================= MAIN DASHBOARD ================= */}
        <div className="dashboard">

          <motion.header
            className="dash-header"
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h2>👤 User Dashboard</h2>
          </motion.header>

          {!showReport && !showProfile && (
            <>
              {/* SUMMARY CARDS */}
              <motion.div
                className="summary-cards"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.15 } }
                }}
              >
                <motion.div className="summary-card" variants={{ hidden:{opacity:0,y:20}, visible:{opacity:1,y:0} }}>
                  <h4>Total Waste</h4>
                  <p>{wasteList.length}</p>
                </motion.div>

                <motion.div className="summary-card pending" variants={{ hidden:{opacity:0,y:20}, visible:{opacity:1,y:0} }}>
                  <h4>Pending Pickups</h4>
                  <p>{wasteList.filter(w => !w.status || w.status === "Pending").length}</p>
                </motion.div>

                <motion.div className="summary-card collected" variants={{ hidden:{opacity:0,y:20}, visible:{opacity:1,y:0} }}>
                  <h4>Collected</h4>
                  <p>{wasteList.filter(w => w.status === "Collected").length}</p>
                </motion.div>

                <motion.div className="summary-card date" variants={{ hidden:{opacity:0,y:20}, visible:{opacity:1,y:0} }}>
                  <h4>Last Submitted</h4>
                  <p>
                    {wasteList.length
                      ? wasteList[wasteList.length - 1].createdAt?.slice(0, 10)
                      : "—"}
                  </p>
                </motion.div>
              </motion.div>

              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <h3 className="select-heading">Select Type of Waste</h3>
                <div className="select-heading-underline"></div>
              </div>

              <motion.div
                className="waste-types"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.2 } }
                }}
              >
                <motion.div className="waste-card" whileHover={{ scale: 1.05 }} onClick={() => setSelectedType("Dry")}
                  variants={{ hidden:{opacity:0,y:30}, visible:{opacity:1,y:0} }}>
                  <span>Dry Waste</span>
                  <div className="emoji-box">🚮</div>
                </motion.div>

                <motion.div className="waste-card" whileHover={{ scale: 1.05 }} onClick={() => setSelectedType("Wet")}
                  variants={{ hidden:{opacity:0,y:30}, visible:{opacity:1,y:0} }}>
                  <span>Wet Waste</span>
                  <div className="emoji-box">♻️</div>
                </motion.div>

                <motion.div className="waste-card" whileHover={{ scale: 1.05 }} onClick={() => setShowBhangarMenu(true)}
                  variants={{ hidden:{opacity:0,y:30}, visible:{opacity:1,y:0} }}>
                  <span>Bhangar</span>
                  <div className="emoji-box">🔄</div>
                </motion.div>
              </motion.div>

              {/* ANALYTICS */}
              <div style={{ textAlign: "center", margin: "60px 0 30px" }}>
                <h3 className="select-heading">Waste Analysis</h3>
                <div className="select-heading-underline"></div>
              </div>

              <motion.div
                className="analytics-section"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="analytics-card">
                  <h3>Waste Distribution</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" innerRadius={70}>
                        <Cell fill="#facc15" />
                        <Cell fill="#22c55e" />
                        <Cell fill="#38bdf8" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="analytics-card">
                  <h3>Monthly Waste</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={lineData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </>
          )}

          {/* ================= PROFILE VIEW ================= */}
          {showProfile && (
            <motion.div className="profile-wrapper" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
              <div className="profile-glass">
                <div className="profile-avatar">👤</div>

                <div className="profile-info">
                  <h3>Dhruv</h3>
                  <p>xyz@gmail.com</p>

                  <div className="profile-stats">
                    <div className="profile-stat">
                      <h4>{wasteList.length}</h4>
                      <span>Total Submissions</span>
                    </div>
                    <div className="profile-stat">
                      <h4>{wasteList.filter(w => w.status === "Collected").length}</h4>
                      <span>Collected</span>
                    </div>
                    <div className="profile-stat">
                      <h4>{wasteList.filter(w => !w.status || w.status === "Pending").length}</h4>
                      <span>Pending</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="activity-card">
                <h3>Recent Activity</h3>
                <div className="timeline">
                  {wasteList.slice(-4).reverse().map((w, i) => (
                    <div className="timeline-item" key={i}>
                      <span className={`timeline-dot ${
                        w.status === "Collected"
                          ? "dot-green"
                          : w.status === "Assigned"
                          ? "dot-blue"
                          : "dot-yellow"
                      }`}></span>
                      {w.type} Waste — {formatStatus(w.status)}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= REPORTS ================= */}
          {showReport && (
            <motion.div className="table-section" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
              <h3>Your Submitted Waste</h3>

              {wasteList.length === 0 ? (
                <p>No waste submitted yet.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Location</th>
                      <th>Weight</th>
                      <th>Qty</th>
                      <th>Image</th>
                      <th>Status</th>
                      <th>Pickup Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wasteList.map(waste => (
                      <tr key={waste._id}>
                        <td>{waste.type}</td>
                        <td>{waste.description}</td>
                        <td>{waste.location}</td>
                        <td>{waste.weight} kg</td>
                        <td>{waste.quantity}</td>
                        <td>
                          {waste.image ? (
                            <img
                              src={`http://localhost:5000/uploads/${waste.image}`}
                              alt="waste"
                              width="70"
                              height="70"
                              style={{ borderRadius: "6px", objectFit: "cover" }}
                            />
                          ) : "No Image"}
                        </td>
                        <td>{formatStatus(waste.status)}</td>
                        <td>{waste.pickupDate || "Not Scheduled"}</td>
                        <td>
                          <button onClick={() => deleteWaste(waste._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </motion.div>
          )}

        </div>
      </div>
    </motion.div>
  );
}

export default UserDashboard;
