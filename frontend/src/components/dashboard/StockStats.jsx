import React from 'react';
import './StockStats.css';

const StockStats = ({ quote }) => {
  if (!quote) {
    return (
      <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const data = [
    { label: "Current", value: quote.current },
    { label: "Open", value: quote.open },
    { label: "High", value: quote.high },
    { label: "Low", value: quote.low },
    { label: "Prev Close", value: quote.previousClose },
  ];

  return (
    <div className="stock-stats-container">
      {data.map((item, idx) => (
        <div key={idx} className="stat-card">
          <h4>{item.label}</h4>
          <p>${Number(item.value).toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
};

export default StockStats;
