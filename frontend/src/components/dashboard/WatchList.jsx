import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WatchList.css';
import StockCard from './StockCard';

const defaultWatchlist = [
  "AAPL", "MSFT", "AMZN", "GOOGL", "META", "TSLA", "NVDA", "NFLX"
];

const WatchList = ({ onSelect, selectedSymbol }) => {
  const [watchlists, setWatchlists] = useState({
    default: defaultWatchlist,
    'Watchlist 1': [],
  });
  const [stocksData, setStocksData] = useState([]);
  const [selectedList, setSelectedList] = useState('default');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const symbols = watchlists[selectedList] || [];
      const responses = await Promise.all(
        symbols.map(async (symbol) => {
          const encoded = encodeURIComponent(symbol);
          const res = await fetch(`http://localhost:5000/api/stocks/price/${encoded}`);
          const data = await res.json();
          return {
            symbol,
            price: data.current,
            change: Number((Math.random() * 10 - 5).toFixed(2)),
            percent: Number((Math.random() * 2 - 1).toFixed(2)),
          };
        })
      );
      setStocksData(responses);
    } catch (err) {
      console.error('Failed to load watchlist data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedList, watchlists]);

  const handleSelectList = (value) => {
    setDropdownOpen(false);
    if (value === 'create') {
      const newName = prompt('Enter name for new Watchlist');
      if (newName && !watchlists[newName]) {
        setWatchlists(prev => ({ ...prev, [newName]: [] }));
        setSelectedList(newName);
      }
    } else {
      setSelectedList(value);
    }
  };

  return (
    <div className="watchlist-container">
      <div className="watchlist-header-wrapper">
        <div className="watchlist-header">
          <h2>{selectedList === 'default' ? 'Default Watchlist' : selectedList}</h2>
          <div className="dropdown-wrapper">
            <button className="dropdown-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
              ▼
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <div onClick={() => handleSelectList('default')}>Default Watchlist</div>
                {Object.keys(watchlists).filter(key => key !== 'default').map(key => (
                  <div key={key} onClick={() => handleSelectList(key)}>
                    {key}
                  </div>
                ))}
                <div onClick={() => handleSelectList('create')}>➕ Create New Watchlist</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="watchlist-cards">
        {stocksData.map((stock) => (
          <StockCard
            key={stock.symbol}
            data={stock}
            isWatched={watchlists[selectedList]?.includes(stock.symbol)}
            toggleWatch={() => {
              setWatchlists(prev => {
                const currentList = prev[selectedList] || [];
                const exists = currentList.includes(stock.symbol);
                const updatedList = exists
                  ? currentList.filter(sym => sym !== stock.symbol)
                  : [...currentList, stock.symbol];
                return { ...prev, [selectedList]: updatedList };
              });
            }}
            selected={stock.symbol === selectedSymbol}
            onClick={() => onSelect(stock.symbol)}
          />
        ))}
      </div>

      {/* ✅ Fixed "All Stocks" button at bottom */}
      <div className="see-all-stocks-fixed" onClick={() => navigate('/dashboard/stocks')}>
        All Stocks
      </div>
    </div>
  );
};

export default WatchList;
