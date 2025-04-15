import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import BuySellModal from '../trade/BuySellModal';
import './HorizontalStockCard.css';

const HorizontalStockCard = ({ data, isWatched, toggleWatch, onClick }) => {
  const { user, updateBalance } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState('buy');

  const handleBuyClick = (e) => {
    e.stopPropagation();
    setTransactionType('buy');
    setIsModalOpen(true);
  };

  const handleSellClick = (e) => {
    e.stopPropagation();
    setTransactionType('sell');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleTransactionSuccess = (newBalance) => {
    updateBalance(newBalance);
  };

  const isPositive = data?.change >= 0;
  const changeColor = isPositive ? 'positive' : 'negative';
  const formattedChange = `${isPositive ? '+' : ''}${Number(data?.change || 0).toFixed(2)}`;
  const formattedPercent = `${isPositive ? '+' : ''}${Number(data?.percent || 0).toFixed(2)}%`;

  return (
    <div className="horizontal-card">
      <div className="stock-left" onClick={onClick}>
        <h3>{data.symbol}</h3>
        <p>${Number(data.price || 0).toFixed(2)}</p>
      </div>

      <div className="stock-center" onClick={onClick}>
        <h4>{data.name || "Company Name"}</h4>
        <p className={changeColor}>
          {formattedPercent} ({formattedChange})
        </p>
      </div>

      <div className="stock-right">
        <span
          className={`watch-icon ${isWatched ? 'watched' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWatch();
          }}
        >
          {isWatched ? '★' : '☆'}
        </span>
        <div className="action-buttons">
          <button className="buy-btn" onClick={handleBuyClick}>B</button>
          <button className="sell-btn" onClick={handleSellClick}>S</button>
        </div>
      </div>

      {isModalOpen && (
        <BuySellModal 
          stockSymbol={data?.symbol} 
          stockPrice={data?.price} 
          closeModal={closeModal} 
          userBalance={user?.balance || 0} 
          transactionType={transactionType}
          onTransactionSuccess={handleTransactionSuccess}
        />
      )}
    </div>
  );
};

export default HorizontalStockCard;