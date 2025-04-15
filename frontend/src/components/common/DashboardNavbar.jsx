// components/common/DashboardNavbar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./DashboardNavbar.css";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const DashboardNavbar = () => {
  const { user, setUser } = useAuth(); 
  const navigate = useNavigate();
  const [balance, setBalance] = useState(user?.balance || 0);

  // Fetch latest balance on component mount and when user changes
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (user?._id) {
          const response = await axios.get(`http://localhost:5000/api/user/balance/${user._id}`);
          const updatedBalance = response.data.balance;
          setBalance(updatedBalance);
          
          // Update auth context
          const updatedUser = { ...user, balance: updatedBalance };
          setUser(updatedUser);
          localStorage.setItem("stoxieUser", JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    };

    fetchBalance();

    // Optional: Set up interval for real-time updates (every 30 seconds)
    const intervalId = setInterval(fetchBalance, 30000);
    
    return () => clearInterval(intervalId);
  }, [user?._id]);

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
        <NavLink to="/dashboard/holdings" className="nav-link">Holdings</NavLink>
        <NavLink to="/dashboard/positions" className="nav-link">Positions</NavLink>
        <NavLink to="/dashboard/funds" className="nav-link" title="Wallet">
          <i className="fas fa-wallet"></i>
        </NavLink>

        {/* Updated Balance Display */}
        <div className="navbar-funds" title="Available Balance">
          ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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