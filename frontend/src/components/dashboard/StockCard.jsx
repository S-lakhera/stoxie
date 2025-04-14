// src/components/Dashboard/StockCard.jsx
import React from 'react';
import './StockCard.css';

const StockCard = ({ data, onClick, selected }) => {
  const isPositive = data.change > 0;
  const color = isPositive ? 'limegreen' : data.change < 0 ? 'tomato' : 'gray';
  const formattedChange = `${isPositive ? '+' : ''}${Number(data.change).toFixed(2)}`;
  const formattedPercent = `${isPositive ? '+' : ''}${Number(data.percent).toFixed(2)}%`;

  return (
    <div className={`stock-card ${selected ? 'selected-stock' : ''}`} onClick={onClick}>
      <div className="stock-card-header">
        <span className="stock-symbol">{data.symbol}</span>
        <div className="stock-actions">
          <button className="buy-btn">B</button>
          <button className="sell-btn">S</button>
        </div>
      </div>

      <div className="stock-bottom">
        <span className="stock-price">${Number(data.price)}</span>
        <span className="stock-change" style={{ color }}>
          {formattedChange} &nbsp;&nbsp; ({formattedPercent})
        </span>
      </div>
    </div>
  );
};

export default StockCard;
