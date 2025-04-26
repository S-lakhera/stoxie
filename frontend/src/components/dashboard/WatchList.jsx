// components/WatchList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WatchList.css';
import StockCard from './StockCard';

const WatchList = ({ onSelect, selectedSymbol }) => {
  const [watchlists, setWatchlists] = useState({
  default: ["AAPL", "MSFT", "AMZN", "GOOGL", "META", "TSLA", "NVDA", "NFLX"],
    'Watchlist 1': JSON.parse(localStorage.getItem('watchlist1')) || []
  });
  const [stocksData, setStocksData] = useState([]);
  const [selectedList, setSelectedList] = useState('default');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const symbols = watchlists[selectedList] || [];
      
      // Add small delay to prevent API flooding
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const responses = await Promise.all(
        symbols.map(async (symbol) => {
          try {
            const encoded = encodeURIComponent(symbol);
            const res = await fetch(`http://localhost:5000/api/stocks/price/${encoded}`);
            
            if (!res.ok) {
              throw new Error(`Failed to fetch ${symbol} (Status: ${res.status})`);
            }
            
            const data = await res.json();
            return {
              symbol,
              price: data.current,
              name: data.name || `${symbol} Stock`, // Fallback name
              change: Number((Math.random() * 10 - 5).toFixed(2)),
              percent: Number((Math.random() * 2 - 1).toFixed(2)),
            };
          } catch (error) {
            console.error(`Error fetching ${symbol}:`, error);
            return {
              symbol,
              price: 0,
              name: `${symbol} (Unavailable)`,
              change: 0,
              percent: 0,
              error: true
            };
          }
        })
      );
      
      setStocksData(responses.filter(stock => !stock.error));
    } catch (err) {
      console.error('Failed to load watchlist data:', err);
      // Optionally set some error state here
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

  const toggleWatch = (symbol) => {
    setWatchlists(prev => {
      const currentList = prev['Watchlist 1'] || [];
      const exists = currentList.includes(symbol);
      const updatedList = exists
        ? currentList.filter(s => s !== symbol)
        : [...currentList, symbol];
      
      localStorage.setItem('watchlist1', JSON.stringify(updatedList));
      
      return {
        ...prev,
        'Watchlist 1': updatedList
      };
    });
  };

  return (
    <div className="watchlist-container">
      <div className="watchlist-header-wrapper">
        <div className="watchlist-header">
          <h2>{selectedList === 'default' ? ' Watchlist' : selectedList}</h2>
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
            isWatched={watchlists['Watchlist 1'].includes(stock.symbol)}
            toggleWatch={() => toggleWatch(stock.symbol)}
            selected={stock.symbol === selectedSymbol}
            onClick={() => onSelect(stock.symbol)}
          />
        ))}
      </div>

      <div className="see-all-stocks-fixed" onClick={() => navigate('/dashboard/stocks')}>
        All Stocks
      </div>
    </div>
  );
};

export default WatchList;