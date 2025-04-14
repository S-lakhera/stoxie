// components/stocks/HorizontalStockCard.jsx
import React from 'react';
import './HorizontalStockCard.css';

const HorizontalStockCard = ({ data, isWatched, toggleWatch, onClick }) => {
  return (
    <div className="horizontal-card" /*onClick={onClick}*/>
      <div className="stock-left">
        <h3>{data.symbol}</h3>
        <p>${data.price}</p>
      </div>

      <div className="stock-center">
        <h4>{data.name || "Company Name"}</h4>
        <p className={data.change >= 0 ? 'positive' : 'negative'}>
          {data.percent > 0 ? '+' : ''}{data.percent}% ({data.change > 0 ? '+' : ''}{data.change})
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
          <button className="buy-btn">B</button>
          <button className="sell-btn">S</button>
        </div>
      </div>
    </div>
  );
};

export default HorizontalStockCard;
