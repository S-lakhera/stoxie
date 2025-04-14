// components/stocks/AllStocks.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllStocks.css';
import { useNavigate } from 'react-router-dom';
import HorizontalStockCard from './HorizontalStockCard';

const stockSymbols = [
  "AAPL", "MSFT", "AMZN", "GOOGL", "META", "TSLA", "NVDA", "BRK.B", "JPM", "NFLX", "LLY",
  "V", "XOM", "UNH", "MA", "COST", "WMT", "HD", "PG", "PEP", "BAC", "AVGO", "KO", "MRK",
  "ADBE", "PFE", "INTC", "T", "ORCL", "DIS", "CVX"
];

const AllStocks = () => {
  const [search, setSearch] = useState('');
  const [stocksData, setStocksData] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const responses = await Promise.all(
          stockSymbols.map(async (symbol) => {
            const encoded = encodeURIComponent(symbol);
            const res = await axios.get(`http://localhost:5000/api/stocks/price/${encoded}`);
            return {
              symbol,
              price: res.data.current,
              name: symbol + " Inc.",
              change: Number((Math.random() * 10 - 5).toFixed(2)),
              percent: Number((Math.random() * 2 - 1).toFixed(2)),
            };
          })
        );
        setStocksData(responses);

        // 🆕 Load Watchlist 1 from localStorage
        const saved = JSON.parse(localStorage.getItem('watchlist1')) || [];
        setWatchlist(saved);
      } catch (err) {
        console.error("Error fetching stock data", err);
      }
    };

    fetchStocks();
  }, []);

  // 🆕 Add or remove from Watchlist 1
  const toggleWatchlist = (symbol) => {
    const stored = JSON.parse(localStorage.getItem('watchlist1')) || [];

    let updated;
    if (stored.includes(symbol)) {
      updated = stored.filter(s => s !== symbol);
    } else {
      updated = [...stored, symbol];
    }

    localStorage.setItem('watchlist1', JSON.stringify(updated));
    setWatchlist(updated);
  };

  const filtered = stocksData.filter(stock =>
    stock.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const visibleStocks = filtered.slice(0, visibleCount);

  return (
    <div className="all-stocks-wrapper">
      <div className="all-stocks-header">
        <h1 className="all-stocks-title">Explore Top US Stocks</h1>
        <div className="stock-search-wrapper">
          <i className="fas fa-search search-icon" />
          <input
            type="text"
            className="stock-search-input"
            placeholder="Search stocks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>


      <div className="stock-list">
        {visibleStocks.map(stock => (
          <HorizontalStockCard
            key={stock.symbol}
            data={stock}
            isWatched={watchlist.includes(stock.symbol)}
            toggleWatch={() => toggleWatchlist(stock.symbol)}
            onClick={() => navigate(`/stock/${stock.symbol}`)}
          />
        ))}
      </div>

      {visibleCount < filtered.length && (
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button
            style={{
              padding: '0.7rem 1.5rem',
              fontSize: '1rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#5535a7',
              color: 'white',
              cursor: 'pointer'
            }}
            onClick={() => setVisibleCount(prev => prev + 6)}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default AllStocks;
