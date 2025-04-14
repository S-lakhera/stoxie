// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import HomeLayout from './components/common/HomeLayout'; // NEW layout for logged-in users on landing
import DashboardLayout from './components/common/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';

import LandingPage from './components/LandingPage/LandingPage';
import Login from './components/login/Login';
import Signup from './components/signup/Signup';
import About from './components/aboutPage/About';
import Support from './components/supportPage/Support';
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/profile/Profile'; // profile page
import Positions from './components/positions/Positions';
import Orders from './components/orders/Orders';
import Holdings from './components/holdings/Holdings'
import AddFunds from './components/funds/AddFunds';
import AllStocks from './components/stocks/AllStocks';
import SingleStockPage from './components/stocks/SingleStock';




function App() {
  return (
    <Router>
      <Routes>

        {/* Public layout with default landing navbar */}
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="about" element={<About />} />
          <Route path="support" element={<Support />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        {/* Logged-in Home layout with HomeNavbar (new third navbar) */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomeLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<LandingPage />} />
        </Route>


        {/* Protected Dashboard layout */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="positions" element={<Positions />} />
          <Route path="orders" element={<Orders />} />
          <Route path="holdings" element={<Holdings />} />
          <Route path="holdings" element={<Holdings />} />
          <Route path="funds" element={<AddFunds />} />
          <Route path="stocks" element={<AllStocks />} />
          <Route path="stock/:symbol" element={<SingleStockPage />} />  // dummy for now


        </Route>


        {/* Profile page (can reuse HomeNavbar or none for now) */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

          
      </Routes>
    </Router>
  );
}

export default App;
