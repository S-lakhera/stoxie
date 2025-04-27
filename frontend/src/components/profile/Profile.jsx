import React, { useState } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { showSuccess, showError } from '../../utils/toastHandler'; 
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);  // To toggle between edit and view mode
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
    altEmail: user?.altEmail || '',
    contact: user?.contact || '',
    dob: user?.dob || ''
  });

  const handleLogout = () => {
    logout();
    showSuccess("Logged out successfully!");
    navigate("/");
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = () => {
    // Here you would make an API call to save the updated data
    // Currently just showing a success toast
    showSuccess("Profile updated successfully!");
    setIsEditing(false); // Exit edit mode
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: user?.username || '',
      email: user?.email || '',
      altEmail: user?.altEmail || '',
      contact: user?.contact || '',
      dob: user?.dob || ''
    });
    setIsEditing(false); // Exit edit mode and discard changes
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">
          {user?.firstName?.charAt(0)}
        </div>
        <h2>{user?.firstName} {user?.lastName}</h2>
        
        {/* Editable fields */}
        <p><strong>Username:</strong> {isEditing ? 
          <input type="text" name="username" value={formData.username} onChange={handleInputChange} /> 
          : formData.username}
        </p>
        <p><strong>Email:</strong> {isEditing ? 
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
          : formData.email}
        </p>
        {user?.altEmail && <p><strong>Alternate Email:</strong> {isEditing ? 
          <input type="email" name="altEmail" value={formData.altEmail} onChange={handleInputChange} />
          : formData.altEmail}
        </p>}
        <p><strong>Contact:</strong> {isEditing ? 
          <input type="text" name="contact" value={formData.contact} onChange={handleInputChange} />
          : formData.contact}
        </p>
        <p><strong>Date of Birth:</strong> {isEditing ? 
          <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} />
          : formData.dob}
        </p>

        {/* Edit/Save/Cancel Buttons */}
        {isEditing ? (
          <div className="edit-actions">
            <button onClick={handleSave} className="save-btn">Save</button>
            <button onClick={handleCancel} className="cancel-btn">Cancel</button>
          </div>
        ) : (
          <button onClick={handleEditToggle} className="edit-btn">Edit Profile</button>
        )}

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
      <ToastContainer position="bottom-center" autoClose={3000} />
    </div>
  );
};

export default Profile;