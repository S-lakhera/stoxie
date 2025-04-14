import React from 'react';
import './Positions.css'; // optional CSS

const Positions = () => {
  const positions = [
    {
      id: 1,
      symbol: 'AAPL',
      quantity: 20,
      avgPrice: 170.2,
      currentPrice: 175.5,
      pnl: 106, // profit & loss
    },
    {
      id: 2,
      symbol: 'TSLA',
      quantity: 15,
      avgPrice: 640.0,
      currentPrice: 620.0,
      pnl: -300,
    },
  ];

  return (
    <div className="positions-page">
      <h2>Positions</h2>
      {positions.length === 0 ? (
        <p>You have no open positions.</p>
      ) : (
        <table className="positions-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Quantity</th>
              <th>Avg. Price</th>
              <th>Current Price</th>
              <th>P&L</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos) => (
              <tr key={pos.id}>
                <td>{pos.symbol}</td>
                <td>{pos.quantity}</td>
                <td>${pos.avgPrice}</td>
                <td>${pos.currentPrice}</td>
                <td style={{ color: pos.pnl >= 0 ? 'limegreen' : 'tomato' }}>
                  ${pos.pnl}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Positions;
