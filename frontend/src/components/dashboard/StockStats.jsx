import React from 'react';
import './StockStats.css';

const StockStats = ({ quote }) => {
  if (!quote) return <p>Loading stats...</p>;

  const data = [
    { label: "Current", value: quote.c },
    { label: "Open", value: quote.o },
    { label: "High", value: quote.h },
    { label: "Low", value: quote.l },
    { label: "Prev Close", value: quote.pc },
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
