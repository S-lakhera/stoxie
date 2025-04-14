// SingleStock.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

const SingleStockPage = () => {
  const { symbol } = useParams();
  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h1>📊 {symbol} Stock Details</h1>
      <p>More info coming soon...</p>
    </div>
  );
};

export default SingleStockPage;
