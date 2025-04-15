// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import StockChart from './StockChart';
import WatchList from './WatchList';


const Dashboard = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const stored = JSON.parse(localStorage.getItem('stoxieUser'));
      const token = user?.token || stored?.token;

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/api/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(prev => ({ ...prev, ...res.data }));
      } catch (err) {
        console.error('Error fetching user data:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading || !user?.firstName) return <div className="loading-text">Loading dashboard...</div>; 

  return (
    <div className="dashboard-wrapper">
       {/* 📈 Revamped Chart + Stock List Section */}
       <section className="market-section">
        <div className="chart-container">
          <StockChart symbol={selectedStock} />
        </div>
        <div className="stocklist-container">
          {/* <StockList onSelect={setSelectedStock} /> */}
          <WatchList onSelect={setSelectedStock} selectedSymbol={selectedStock} />

        </div>
      </section>
      {/* 👋 Full View Welcome Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome, {user.firstName} </h1>
          <p>Your personalized stock dashboard awaits.</p>
          <div className="hero-user-details">
            <span>Email: {user.email}</span>
            <span>Username: {user.username}</span>
            <span>Funds: ${user.balance}</span>
          </div>
        </div>
      </section>
    </div> 
  );
};

export default Dashboard;
