import { BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import UserDashboard from "./components/UserDashboard";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AboutUs from "./components/AboutUs";
import DriverLogin from "./components/DriverLogin";          // 🔥 ADDED
import DriverDashboard from "./components/DriverDashboard";  // 🔥 ADDED

function App() {
  const [page, setPage] = useState("home");
  const [wasteType, setWasteType] = useState("");

  const [wasteList, setWasteList] = useState([]);

  // ✅ USER PROTECTED ROUTE
  useEffect(() => {
    if (page === "dashboard") {
      const token = localStorage.getItem("token");
      if (!token) {
        setPage("login");
      }
    }
  }, [page]);

  // ✅ ADMIN PROTECTED ROUTE
  useEffect(() => {
    if (page === "adminDashboard") {
      const role = localStorage.getItem("role");
      if (role !== "admin") {
        setPage("adminLogin");
      }
    }
  }, [page]);

  // ✅ DRIVER PROTECTED ROUTE (🔥 NEW)
  useEffect(() => {
    if (page === "driverDashboard") {
      const driver = localStorage.getItem("driver");
      if (!driver) {
        setPage("driverLogin");
      }
    }
  }, [page]);

  return (
    <BrowserRouter>
      <>
        {page === "home" && <Home setPage={setPage} />}

        {page === "login" && <Login setPage={setPage} />}

        {page === "register" && <Register setPage={setPage} />}

        {page === "adminLogin" && <AdminLogin setPage={setPage} />}

        {/* 🔥 DRIVER LOGIN */}
        {page === "driverLogin" && <DriverLogin setPage={setPage} />}

        {/* ✅ ABOUT US PAGE */}
        {page === "about" && <AboutUs setPage={setPage} />}

        {/* ✅ USER DASHBOARD */}
        {page === "dashboard" && (
          <UserDashboard
            setPage={setPage}
            setWasteType={setWasteType}
            wasteList={wasteList}
            setWasteList={setWasteList}
          />
        )}

        {/* ✅ ADMIN DASHBOARD */}
        {page === "adminDashboard" && (
          <AdminDashboard
            setPage={setPage}
            wasteList={wasteList}
            setWasteList={setWasteList}
          />
        )}

        {/* 🚚 DRIVER DASHBOARD */}
        {page === "driverDashboard" && <DriverDashboard setPage={setPage} />}

      </>
    </BrowserRouter>
  );
}

export default App;
