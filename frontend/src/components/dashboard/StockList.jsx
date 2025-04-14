import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StockList.css';
import StockCard from './StockCard';

const stockSymbols = [
  "AAPL", "MSFT", "AMZN", "GOOGL", "META", "TSLA", "NVDA","NFLX"
];

const StockList = ({ onSelect }) => {
  const [search, setSearch] = useState('');
  const [stocksData, setStocksData] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const responses = await Promise.all(
          stockSymbols.map(async (symbol) => {
            const encodedSymbol = encodeURIComponent(symbol); // handle BRK.B
            const res = await axios.get(`http://localhost:5000/api/stocks/price/${encodedSymbol}`);
            return {
              symbol,
              price: res.data.current,
              // Dummy change % for now
              change: Number((Math.random() * 10 - 5).toFixed(2)),
              percent: Number((Math.random() * 2 - 1).toFixed(2)),
            };
          })
        );
        setStocksData(responses);
      } catch (err) {
        console.error('Error fetching stock data', err);
      }
    };
 
    fetchStocks();
  }, []);

  const filtered = stocksData.filter(stock =>
    stock.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const toggleWatchlist = (symbol) => {
    setWatchlist(prev =>
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  return (
    <div className="stock-list-container">
      <input
        type="text"
        placeholder="🔍 Search stocks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="stock-search-input"
      />

      {filtered.map((stock) => (
        <StockCard 
          key={stock.symbol}
          data={stock}
          isWatched={watchlist.includes(stock.symbol)}
          onClick={() => onSelect(stock.symbol)}
          toggleWatch={() => toggleWatchlist(stock.symbol)}
        />
      ))}

    </div>
  );
};

export default StockList;
