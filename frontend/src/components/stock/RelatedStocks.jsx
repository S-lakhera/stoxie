import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RelatedStockCard from './RelatedStockCard';
import './RelatedStocks.css';

const RelatedStocks = ({ symbol }) => {
  const [stocksData, setStocksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const cache = useRef({}); // 🧠 In-memory cache to avoid duplicate API calls

  useEffect(() => {
    const fetchPeers = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/stocks/peers/${symbol}`);
        const peers = res.data.peers || [];
 
        const stockDetails = [];
        for (let i = 0; i < peers.slice(0, 10).length; i++) {
          const peer = peers[i];

          // Use cache if available
          if (cache.current[peer]) {
            stockDetails.push(cache.current[peer]);
            continue;
          }

          try {
            const priceRes = await axios.get(`http://localhost:5000/api/stocks/price/${peer}`);
            const { current, previousClose } = priceRes.data;
            const change = current - previousClose;
 
            const stock = {
              symbol: peer,
              price: current,
              change,
              percent: (change / previousClose) * 100
            };

            cache.current[peer] = stock;
            stockDetails.push(stock);
          } catch (err) {
            console.warn(`Error fetching ${peer}: ${err.message}`);
            if (err.response?.status === 429) {
              console.warn('Too many requests - delaying...');
              await new Promise((res) => setTimeout(res, 1500)); // ⏳ Pause on 429
            }
          }

          // ⏱ Add a small delay to avoid spamming the API
          await new Promise((res) => setTimeout(res, 300));
        }

        setStocksData(stockDetails.filter(Boolean));
      } catch (err) {
        console.error('Error fetching related stocks:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPeers();
  }, [symbol]);

  if (loading) {
    return (
      <div className="related-stocks-loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!stocksData.length) {
    return <div className="related-stocks-empty">No related stocks found</div>;
  }

  return (
    <div className="related-stocks-container">
      <h3>Related Stocks</h3>
      <div className="related-stocks-grid">
        {stocksData.map((stock) => (
          <RelatedStockCard
            key={stock.symbol}
            data={stock}
            selected={stock.symbol === symbol}
            onClick={() => navigate(`/dashboard/stocks/${stock.symbol}`)}
          />
        ))}
      </div>
      
      {/* All Stocks button */}
      <div className="all-stocks-button-container">
        <button className="all-stocks-button" onClick={() => navigate('/dashboard/stocks')}>
          All Stocks
        </button>
      </div>
    </div>
  );
};

export default RelatedStocks;
