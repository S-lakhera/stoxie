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

const fetchStockData = async (symbol, retries = 3) => {
  try {
    const encoded = encodeURIComponent(symbol);
    const response = await axios.get(`http://localhost:5000/api/stocks/price/${encoded}`);
    return {
      symbol,
      price: response.data.current,
      name: response.data.name || `${symbol} Inc.`,
      change: Number((Math.random() * 10 - 5).toFixed(2)),
      percent: Number((Math.random() * 2 - 1).toFixed(2)),
    };
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return fetchStockData(symbol, retries - 1);
    }
    console.error(`Failed to fetch ${symbol}:`, error);
    return null;
  }
};

const AllStocks = () => {
  const [search, setSearch] = useState('');
  const [stocksData, setStocksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [watchlists, setWatchlists] = useState({
    default: ["AAPL", "MSFT", "AMZN", "GOOGL", "META", "TSLA", "NVDA", "NFLX"],
    'Watchlist 1': JSON.parse(localStorage.getItem('watchlist1')) || []
  });
  const navigate = useNavigate();

  const loadStocks = async (start, count) => {
    const batch = stockSymbols.slice(start, start + count);
    const batchResults = await Promise.all(batch.map(fetchStockData));
    setStocksData(prev => [...prev, ...batchResults.filter(Boolean)]);
  };

  useEffect(() => {
    const initLoad = async () => {
      setLoading(true);
      await loadStocks(0, 6);
      setLoading(false);
    };
    initLoad();
  }, []);

  const handleLoadMore = async () => {
    setLoading(true);
    await loadStocks(stocksData.length, 6);
    setVisibleCount(prev => prev + 6);
    setLoading(false);
  };

  const filtered = stocksData.filter(stock =>
    stock?.symbol?.toLowerCase().includes(search.toLowerCase())
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

      {loading && stocksData.length === 0 ? (
        <div className="loading-spinner"></div>
      ) : (
        <>
          <div className="stock-list">
            {visibleStocks.map(stock => (
              <HorizontalStockCard
                key={stock.symbol}
                data={stock}
                isWatched={watchlists['Watchlist 1'].includes(stock.symbol)}
                toggleWatch={() => toggleWatchlist(stock.symbol)}
                onClick={() => navigate(`/dashboard/stocks/${stock.symbol}`)}
              />
            ))}
          </div>

          {visibleCount < filtered.length && (
            <div className="load-more-container">
              <button
                className="load-more-btn"
                onClick={handleLoadMore}
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllStocks;
