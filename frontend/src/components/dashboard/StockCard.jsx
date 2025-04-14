// src/components/Dashboard/StockCard.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Import AuthContext for user data
import BuySellModal from '../trade/BuySellModal'; // Import BuySellModal
import './StockCard.css';

const StockCard = ({ data, onClick, selected }) => {
  const { user } = useAuth(); // Get user data from AuthContext
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const isPositive = data?.change > 0;
  const color = isPositive ? 'limegreen' : data?.change < 0 ? 'tomato' : 'gray';
  const formattedChange = `${isPositive ? '+' : ''}${Number(data?.change || 0).toFixed(2)}`;
  const formattedPercent = `${isPositive ? '+' : ''}${Number(data?.percent || 0).toFixed(2)}%`;
 
  const handleBuyClick = () => {
    console.log("CLicked Buy");
    setIsModalOpen(true); // Open modal for buying
  };
  
  const handleSellClick = () => {
    console.log("CLicked Sell");
    setIsModalOpen(true); // Open modal for selling
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close modal
  };

  return (
    <div className={`stock-card ${selected ? 'selected-stock' : ''}`} onClick={onClick}>
      <div className="stock-card-header stock-top">
        <span className="stock-symbol">{data?.symbol}</span>
        <div className="stock-actions">
          <button className="buy-btn" onClick={handleBuyClick}>B</button> {/* Buy button */}
          <button className="sell-btn" onClick={handleSellClick}>S</button> {/* Sell button */}
        </div>
      </div>

      <div className="stock-bottom">
        <span className="stock-price">${Number(data?.price || 0).toFixed(2)}</span>
        <span className="stock-change" style={{ color }}>
          {formattedChange} &nbsp;&nbsp;&nbsp;&nbsp; ({formattedPercent})
        </span>
      </div>

      {/* BuySellModal trigger */}
      {isModalOpen && (
        <BuySellModal 
          stockSymbol={data?.symbol} 
          stockPrice={data?.price} 
          closeModal={closeModal} 
          userBalance={user?.balance || 0} 
        />
      )}
    </div>
  );
};

export default StockCard;
