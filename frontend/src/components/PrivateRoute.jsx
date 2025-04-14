// components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('stoxieUser'); // You can change the key based on how you're storing user data

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
