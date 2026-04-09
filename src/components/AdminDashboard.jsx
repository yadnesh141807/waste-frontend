import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./AdminDashboard.css";
import API from "../api";

function AdminDashboard({ wasteList, setWasteList, setPage }) {

  console.log("ADMIN DASHBOARD MOUNTED");

  const [pickupDates, setPickupDates] = useState({});
  const [selectedDriver, setSelectedDriver] = useState({});
  const [drivers, setDrivers] = useState([]);

  const [dName, setDName] = useState("");
  const [dEmail, setDEmail] = useState("");
  const [dPassword, setDPassword] = useState("");

  // ✅ LOAD WASTE
  useEffect(() => {
    API.get("/api/waste")
      .then((res) => setWasteList(res.data))
      .catch((err) => console.error(err));
  }, [setWasteList]);

  // ✅ LOAD DRIVERS
  useEffect(() => {
    API.get("/admin/drivers")
      .then((res) => {
        console.log("Drivers Response:", res.data);

        if (Array.isArray(res.data)) {
          setDrivers(res.data);
        } else if (Array.isArray(res.data.drivers)) {
          setDrivers(res.data.drivers);
        } else {
          setDrivers([]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  console.log("Drivers State:", drivers);

  // ✅ ACCEPT / REJECT
  const updateStatus = async (index, status) => {
    const waste = wasteList[index];

    const pickupDate =
      status === "Accepted"
        ? pickupDates[index] || "Not Scheduled"
        : waste.pickupDate;

    try {
      await API.put(`/api/waste/${waste._id}`, {
        status,
        pickupDate,
      });

      const res = await API.get("/api/waste");
      setWasteList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔴🔴 DELETE WASTE
  const deleteWaste = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this waste?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/api/waste/${id}`);

      const res = await API.get("/api/waste");
      setWasteList(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to delete waste");
    }
  };

  // ✅ CREATE DRIVER
  const createDriver = async () => {
    try {
      await API.post("/admin/create-driver", {
        name: dName,
        email: dEmail,
        password: dPassword,
      });

      alert("Driver created successfully 🚚");

      setDName("");
      setDEmail("");
      setDPassword("");

      const res = await API.get("/admin/drivers");

      if (Array.isArray(res.data)) {
        setDrivers(res.data);
      } else if (Array.isArray(res.data.drivers)) {
        setDrivers(res.data.drivers);
      } else {
        setDrivers([]);
      }

    } catch (err) {
      alert("Driver already exists or error");
    }
  };

  return (
    <motion.div
      className="admin-dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >

      <motion.header
        className="admin-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Admin Dashboard</h2>
        <button onClick={() => setPage("home")}>Logout</button>
      </motion.header>

      <motion.div
        className="create-driver-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.4 }}
      >
        <div className="create-driver-header">
          <h3>🧑‍✈️ Create Driver</h3>
        </div>

        <div className="create-driver-form">
          <input
            placeholder="Driver Name"
            value={dName}
            onChange={(e) => setDName(e.target.value)}
          />
          <input
            placeholder="Driver Email"
            value={dEmail}
            onChange={(e) => setDEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={dPassword}
            onChange={(e) => setDPassword(e.target.value)}
          />
          <button onClick={createDriver}>Create Driver</button>
        </div>
      </motion.div>

      <div className="analytics-cards">

        <motion.div
          className="card pending"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="card-icon">🗑️</div>
          <h4>Today’s Waste</h4>
          <p>{wasteList.reduce((sum, w) => sum + Number(w.weight || 0), 0)} kg</p>
        </motion.div>

        <motion.div
          className="card accepted"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card-icon">👥</div>
          <h4>Active Users</h4>
          <p>{new Set(wasteList.map(w => w.user?._id)).size || 0}</p>
        </motion.div>

        <motion.div
          className="card drivers"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="card-icon">🚚</div>
          <h4>Drivers Online</h4>
          <p>{drivers.length}</p>
        </motion.div>

        <motion.div
          className="card rejected"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="card-icon">⏱️</div>
          <h4>Pending Pickups</h4>
          <p>{wasteList.filter(w => !w.status || w.status === "Pending").length}</p>
        </motion.div>

      </div>

      <h3>User Submitted Waste</h3>

      {wasteList.length === 0 ? (
        <p className="no-data">No waste submitted yet</p>
      ) : (
        <motion.table
          className="admin-table"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>Location</th>
              <th>Weight</th>
              <th>Quantity</th>
              <th>Image</th>
              <th>Status</th>
              <th>Pickup Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {wasteList.map((waste, index) => (
              <motion.tr
                key={waste._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
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
                      width="80"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "6px"
                      }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>

                <td>
                  <span className={`status ${waste.status || "pending"}`}>
                    {waste.status === "Assigned"
                      ? "Accepted, Assigned"
                      : waste.status === "Collected"
                      ? "Collected"
                      : waste.status || "Pending"}
                  </span>
                </td>

                <td>
                  {waste.status === "Accepted" || waste.status === "Assigned" || waste.status === "Collected" ? (
                    <span>{waste.pickupDate}</span>
                  ) : (
                    <input
                      type="date"
                      onChange={(e) =>
                        setPickupDates({
                          ...pickupDates,
                          [index]: e.target.value,
                        })
                      }
                    />
                  )}
                </td>

                <td>
                  <button
                    className="accept"
                    onClick={() => updateStatus(index, "Accepted")}
                  >
                    Accept
                  </button>

                  <button
                    className="reject"
                    onClick={() => updateStatus(index, "Rejected")}
                  >
                    Reject
                  </button>

                  <select
                    onChange={(e) =>
                      setSelectedDriver({
                        ...selectedDriver,
                        [waste._id]: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Driver</option>
                    {drivers.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>

                  <button
                    className="assign-btn"
                    onClick={async () => {
                      const driverId = selectedDriver[waste._id];

                      if (!driverId) {
                        alert("Select driver first");
                        return;
                      }

                      const res = await API.put("/admin/assign-driver", {
                        wasteId: waste._id,
                        driverId: driverId,
                        pickupDate: waste.pickupDate,
                      });

                      console.log("API RESPONSE:", res.data);
                      alert("✅ Driver assigned successfully");

                      const updated = await API.get("/api/waste");
                      setWasteList(updated.data);
                    }}
                  >
                    Assign Driver
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteWaste(waste._id)}
                  >
                    Delete
                  </button>

                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      )}
    </motion.div>
  );
}

export default AdminDashboard;