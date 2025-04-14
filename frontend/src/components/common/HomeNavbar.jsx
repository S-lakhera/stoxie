// HomeNavbar.jsx
import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./HomeNavbar.css";
import logo from "../../assets/logo.png";
import { FaChartLine } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
// adjust path if needed

const HomeNavbar = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const getInitials = (first, last) => {
    return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
  };

  return (
    <nav className="home-navbar">
      <div className="navbar-left">
      <NavLink to={"/home"}><img src={logo} alt="Logo" className="navbar-logo" /></NavLink>
      </div>
      <div className="navbar-right">
        <FaChartLine
          className="nav-icon"
          title="Dashboard"
          onClick={() => navigate("/dashboard")}
        />
        <div
          className="profile-circle"
          title="Profile"
          onClick={() => navigate("/profile")}
        >
          {getInitials(user?.firstName, user?.lastName)}
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;
