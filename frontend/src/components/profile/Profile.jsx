import React, { useState } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/");
  };
 
  return (
    <div className="profile-container">
      <h1>Your Profile</h1>
      <div className="profile-card">
        <h2>{user?.firstName} {user?.lastName}</h2>
        <p><strong>Username:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        {user?.altEmail && <p><strong>Alternate Email:</strong> {user.altEmail}</p>}
        <p><strong>Contact:</strong> {user?.contact}</p>
        <p><strong>Date of Birth:</strong> {user?.dob}</p>
        <button className="logout-btn" onClick={() => setShowModal(true)}>Logout</button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to logout?</p>
            <div className="modal-actions">
              <button onClick={handleLogout} className="confirm-btn">Yes, Logout</button>
              <button onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
