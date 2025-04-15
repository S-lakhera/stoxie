import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Holdings.css';
import { useAuth } from '../../context/AuthContext';
import BuySellModal from '../trade/BuySellModal';

const Holdings = () => {
  const { user, updateBalance } = useAuth();
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [transactionType, setTransactionType] = useState('sell');

  // Move fetchHoldings outside useEffect
  const fetchHoldings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/holdings/${user._id}`);
      
      const holdingsWithPL = response.data.map(holding => ({
        ...holding,
        profitLoss: (holding.currentPrice - holding.avgPrice) * holding.quantity
      }));
      
      setHoldings(holdingsWithPL);
    } catch (err) {
      setError('Failed to load holdings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchHoldings();
    }
  }, [user?._id]);

  const handleSellClick = (stock) => {
    setSelectedStock(stock);
    setTransactionType('sell');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStock(null);
  };

  const handleTransactionSuccess = (newBalance) => {
    updateBalance(newBalance);
    // Now we can call fetchHoldings directly
    fetchHoldings();
  };

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
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
          <span>Action</span> {/* New column for Sell button */}
        </div>
        {holdings.map((item, index) => {
          const profitLoss = ((item.currentPrice - item.avgPrice) * item.quantity).toFixed(2);
          const profitClass = profitLoss >= 0 ? 'profit' : 'loss';

          return (
            <div className="table-row" key={index}>
              <span>{item.symbol}</span>
              <span>{item.name}</span>
              <span>{item.quantity}</span>
              <span>${item.avgPrice.toFixed(2)}</span>
              <span>${item.currentPrice.toFixed(2)}</span>
              <span className={profitClass}>${profitLoss}</span>
              <span>
                <button 
                  className="sell-btn"
                  onClick={() => handleSellClick(item)}
                >
                  S
                </button>
              </span>
            </div>
          );
        })}
      </div>

      {/* Sell Modal */}
      {isModalOpen && selectedStock && (
        <BuySellModal
          stockSymbol={selectedStock.symbol}
          stockPrice={selectedStock.currentPrice}
          closeModal={closeModal}
          userBalance={user?.balance || 0}
          transactionType={transactionType}
          maxQuantity={selectedStock.quantity}
          onTransactionSuccess={handleTransactionSuccess}
        />
      )}
    </div>
  );
};

export default Holdings;