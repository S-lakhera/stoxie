// components/dashboard/StockGraph.jsx
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import API from '../../api/axios'; // Importing the API instance for backend calls
import './StockGraph.css';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

const intervals = {
  '5min': { interval: '5min', outputsize: 28 },
  '1h': { interval: '1h', outputsize: 20 },
  '1day': { interval: '1day', outputsize: 30 },
  '1week': { interval: '1week', outputsize: 52 },
};

const StockGraph = ({ symbol }) => {
  const [timeframe, setTimeframe] = useState('1h');
  const [chartData, setChartData] = useState(null);

  const fetchData = async () => {
    try {
      const res = await API.get(`/api/stockgraph/${symbol}/${timeframe}`); // Backend API call
      setChartData(res.data);
    } catch (err) {
      console.error("Error loading chart data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [symbol, timeframe]);

  return (
    <div className="stock-graph-wrapper">
      <div className="interval-buttons">
        {Object.keys(intervals).map(intvl => (
          <button
            key={intvl}
            className={`interval-btn ${timeframe === intvl ? 'active' : ''}`}
            onClick={() => setTimeframe(intvl)}
          >
            {intvl}
          </button>
        ))}
      </div>
      {chartData ? (
        <Line data={chartData} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default StockGraph;
