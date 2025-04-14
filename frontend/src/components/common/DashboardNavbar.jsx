// components/common/DashboardNavbar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./DashboardNavbar.css";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";

const DashboardNavbar = () => {
  const { user } = useAuth(); 
  const navigate = useNavigate();

  const getInitials = (first = "", last = "") => {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <nav className="dashboard-navbar">
      <div className="navbar-left">
        <NavLink to={"/home"}>
          <img src={logo} alt="Logo" className="navbar-logo" />
        </NavLink>
      </div>

      <div className="navbar-right">
        <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
        <NavLink to="/dashboard/orders" className="nav-link">Orders</NavLink>
        <NavLink to="/dashboard/positions" className="nav-link">Positions</NavLink>
        <NavLink to="/dashboard/holdings" className="nav-link">Holdings</NavLink>
        <NavLink to="/dashboard/funds" className="nav-link" title="Wallet">
          <i className="fas fa-wallet"></i>
        </NavLink>

        {/* 👇 Show Funds Here */}
        <div className="navbar-funds" title="Available Balance">
          ${user?.balance?.toLocaleString() || "0"}
        </div>

        {/* Profile Icon */}
        <div className="profile-circle" onClick={handleProfileClick} title="Profile">
          {getInitials(user?.firstName, user?.lastName) || "U"}
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
