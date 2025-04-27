import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { FaWallet, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { LuArrowUpRight } from "react-icons/lu";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext"; // 👈 Make sure this path is correct
import API from "../../api/axios";
import { showSuccess, showError } from '../../utils/toastHandler';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // 👈 using login function from context

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try { 
      const res = await API.post("/api/auth/login", formData);
 
      const { user, token } = res.data; // ✅ token bhi destructure kar

      localStorage.setItem("stoxieUser", JSON.stringify({ ...user, token })); // ✅ token bhi save ho raha
      login({ ...user, token }); // ✅ context me bhi bhej token
      

      showSuccess("Login successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      const serverMessage = err.response?.data?.message?.toLowerCase();

      if (serverMessage?.includes("not found") || serverMessage?.includes("no such")) {
        showError("No account found with this email.");
      } else if (
        serverMessage?.includes("incorrect") ||
        serverMessage?.includes("wrong") ||
        serverMessage?.includes("invalid")
      ) {
        showError("Incorrect password. Please try again.");
      } else if (serverMessage) {
        showError(serverMessage);
      } else {
        showError("Login failed. Please try again.");
      }
    }
  };
 
  return (
    <div className="login-container">
      <div className="login-left">
        <div className="stoxie-brand">
          <h1 className="stoxie-name">Stoxie</h1>
        </div>
        <h2>
          Your Journey to Smart <span className="highlight">Stock Trading</span> Starts Here
        </h2>
        <ul>
          <li>
            <FaWallet className="icon" />
            <div>
              <strong>Smart Portfolio Management</strong>
              <p>Track and manage your investments with advanced tools</p>
            </div>
          </li>
          <li>
            <LuArrowUpRight className="icon" />
            <div>
              <strong>Real-time Analytics</strong>
              <p>Get instant insights and market analysis</p>
            </div>
          </li>
          <li>
            <FaLock className="icon" />
            <div>
              <strong>Secure Trading</strong>
              <p>Bank-grade security for your investments</p>
            </div>
          </li>
        </ul>
      </div>

      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Welcome back</h2>
          <p>Enter your credentials to access your account</p>

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span className="toggle-password" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit">Sign In</button>

          <p className="account-switch">
            Don't have an account? <a href="/signup">Create one</a>
          </p>
        </form>
      </div>
      <ToastContainer position="bottom-center" autoClose={3000} />
    </div>
  );
};

export default Login;
