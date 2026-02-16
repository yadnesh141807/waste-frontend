import { BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import UserDashboard from "./components/UserDashboard";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AboutUs from "./components/AboutUs";
import DriverLogin from "./components/DriverLogin";
import DriverDashboard from "./components/DriverDashboard";

function App() {
  const [page, setPage] = useState("home");

  // ❌ REMOVED unused wasteType (this was breaking Vercel build)

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

  // ✅ DRIVER PROTECTED ROUTE
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

        {page === "driverLogin" && <DriverLogin setPage={setPage} />}

        {page === "about" && <AboutUs setPage={setPage} />}

        {page === "dashboard" && (
          <UserDashboard
            setPage={setPage}
            wasteList={wasteList}
            setWasteList={setWasteList}
          />
        )}

        {page === "adminDashboard" && (
          <AdminDashboard
            setPage={setPage}
            wasteList={wasteList}
            setWasteList={setWasteList}
          />
        )}

        {page === "driverDashboard" && (
          <DriverDashboard setPage={setPage} />
        )}
      </>
    </BrowserRouter>
  );
}

export default App;
