import React, { useState } from 'react';
import { FaUserShield, FaChartLine, FaLock } from 'react-icons/fa';
import './signup.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // ✅
import { showSuccess, showError } from '../../utils/toastHandler';
import API from '../../api/axios'; // ✅ Import the API instance

const Signup = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dob: '',
    contact: '',
    altEmail: '',
  });
 
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleNext = () => {
    const { username, email, password } = formData;
    if (!username || !email || !password) {
      showError('Please fill in all required fields before continuing.');
      return;
    }
    setStep(2);
  };

  const handlePrev = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use the API instance to send the POST request
      const res = await API.post('/api/auth/signup', formData);

      const { user, token } = res.data; // ✅ token bhi destructure kar

      localStorage.setItem("stoxieUser", JSON.stringify({ ...user, token })); // ✅ token bhi save ho raha
      login({ ...user, token }); // ✅ context me bhi bhej token

      showSuccess("Signup successful!");

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      const serverMessage = error.response?.data?.message?.toLowerCase();

      if (serverMessage?.includes('already') || serverMessage?.includes('exists')) {
        showError("This email is already registered.");
      } else if (serverMessage) {
        showError(serverMessage);
      } else {
        showError("Signup failed. Please try again.");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && step === 1) {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="logo-row">
          <h1 className="stoxie-name">Stoxie</h1>
        </div>
        <h2>Join the future of investing</h2>
        <ul>
          <li>
            <FaUserShield className="icon" />
            <div>
              <strong>Secure Signup</strong>
              <p>Your data is safe with us.</p>
            </div>
          </li>
          <li>
            <FaChartLine className="icon" />
            <div>
              <strong>Real-Time Simulations</strong>
              <p>Learn trading without risks.</p>
            </div>
          </li>
          <li>
            <FaLock className="icon" />
            <div>
              <strong>Private & Encrypted</strong>
              <p>We value your privacy.</p>
            </div>
          </li>
        </ul>
      </div>

      <div className="signup-right">
        <form
          className={`signup-form fade-${step}`}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
        >
          {step === 1 && (
            <>
              <h2>Account Details</h2>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="button" onClick={handleNext}>Next</button>
            </>
          )}

          {step === 2 && (
            <>
              <h2>Personal Information</h2>
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <label htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
              <label htmlFor="contact">Contact Number</label>
              <input
                type="tel"
                name="contact"
                placeholder="Enter contact number"
                value={formData.contact}
                onChange={handleChange}
                required
              />
              <div className="form-actions">
                <button type="button" onClick={handlePrev}>Back</button>
                <button type="submit">Sign Up</button>
              </div>
            </>
          )}
        </form>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Signup;
