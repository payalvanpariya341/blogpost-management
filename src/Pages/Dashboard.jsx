import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authData");
    navigate("/login");
  };

  return (
    <div>
      <h2>Dashboard</h2>

      <p>Welcome! You are logged in successfully.</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;