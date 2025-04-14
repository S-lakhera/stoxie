import React from 'react';
import './Holdings.css';

const dummyHoldings = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    quantity: 10,
    avgPrice: 145.32,
    currentPrice: 172.88,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    quantity: 5,
    avgPrice: 620.15,
    currentPrice: 699.99,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    quantity: 8,
    avgPrice: 2100.5,
    currentPrice: 2255.3,
  },
];

const Holdings = () => {
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
        {dummyHoldings.map((item, index) => {
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Holdings;
