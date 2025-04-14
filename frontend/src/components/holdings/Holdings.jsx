import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Holdings.css';
import { useAuth } from '../../context/AuthContext';

const Holdings = () => {
  const { user } = useAuth();
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`http://localhost:5000/api/holdings/${user._id}`);
        console.log('Holdings data:', response.data);

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid holdings data format');
        }

        const holdingsWithPL = response.data.map(holding => ({
          ...holding,
          profitLoss: (holding.currentPrice - holding.avgPrice) * holding.quantity
        }));
        
        setHoldings(holdingsWithPL);
      } catch (err) {
        console.error("Failed to fetch holdings:", err);
        setError(err.response?.data?.message || err.message || 'Failed to load holdings');
      } finally {
        setLoading(false);
      }
    };
  
    if (user?._id) {
      fetchHoldings();
    } else {
      setLoading(false);
    }
  }, [user?._id]);

  if (loading) {
    return (
      <div className="holdings-container">
        <h2>Your Holdings</h2>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="holdings-container">
        <h2>Your Holdings</h2>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="holdings-container">
      <h2>Your Holdings</h2>
      <div className="holdings-table">
        <div className="table-header">
          <span>Symbol</span>
          <span>Company</span>
          <span>Qty</span>
          <span>Avg Price</span>
          <span>Current Price</span>
          <span>Profit/Loss</span>
        </div>
        {holdings.length > 0 ? (
          holdings.map((item, index) => {
            const profitLoss = ((item.currentPrice - item.avgPrice) * item.quantity).toFixed(2);
            const profitClass = profitLoss >= 0 ? 'profit' : 'loss';

            return (
              <div className="table-row" key={`${item.symbol}-${index}`}>
                <span>{item.symbol}</span>
                <span>{item.name || item.symbol}</span>
                <span>{item.quantity}</span>
                <span>${item.avgPrice.toFixed(2)}</span>
                <span>${item.currentPrice.toFixed(2)}</span>
                <span className={profitClass}>${profitLoss}</span>
              </div>
            );
          })
        ) : (
          <div className="no-holdings-message">
            You don't have any holdings yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Holdings;