import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StockStats from './StockStats';
import StockGraph from './StockGraph';

const StockChart = ({ symbol = "AAPL" }) => {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/stocks/price/${symbol}`);
        setQuote(res.data); 
      } catch (err) {
        console.error('Error fetching quote:', err.message);
      }
    };

    fetchQuote();
    const interval = setInterval(fetchQuote, 10000); // poll every 10 sec (10000ms)

    return () => clearInterval(interval);
  }, [symbol]);

  return (
    <div className="stock-chart-wrapper">
      <StockStats quote={quote} />
      <StockGraph symbol={symbol} />
    </div>
  );
};

export default StockChart;
