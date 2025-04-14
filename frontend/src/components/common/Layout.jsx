// Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar'; // your basic public navbar
import HomeNavbar from './HomeNavbar'; // your navbar for logged in user
import { useAuth } from '../../context/AuthContext';

const Layout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{paddingTop:"60px"}}>
      {isAuthenticated ? <HomeNavbar /> : <Navbar />}
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
