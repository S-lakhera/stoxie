import React, { useEffect, useState } from 'react';
import './Navbar.css';
import logo from '../../assets/logo.png';
import { FaHome, FaInfoCircle, FaHeadset, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let timeoutId = null;

    const handleScroll = () => { 
      const currentScroll = window.scrollY;

      if (Math.abs(currentScroll - lastScrollY) < 5) return;

      if (currentScroll > lastScrollY) {
        setShowNavbar(false); // down
      } else {
        setShowNavbar(true); // up
      }

      setLastScrollY(currentScroll);

      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setLastScrollY(currentScroll), 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={`navbar ${showNavbar ? 'visible' : 'hidden'}`}>
      <div className="navbar-content">
        <div className="navbar-logo">
          <NavLink to='/' ><img src={logo} alt="Stoxie Logo" /></NavLink>
        </div>
        <div className="navbar-links">
          <NavLink to="/" className="navbar-link" title="Home"><FaHome /></NavLink>
          <NavLink to="/about" className="navbar-link" title="About"><FaInfoCircle /></NavLink>
          <NavLink to="/support" className="navbar-link" title="Support"><FaHeadset /></NavLink>
          <NavLink to="/login" className="navbar-link" title="Login"><FaSignInAlt /></NavLink>
          <NavLink to="/signup" className="navbar-link" title="Signup"><FaUserPlus /></NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
