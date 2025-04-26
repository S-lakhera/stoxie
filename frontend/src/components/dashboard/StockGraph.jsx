//components/dashboard/StockGraph.jsx
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import './StockGraph.css';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip
} from 'chart.js';
 
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

const intervals = {
    '5min': { interval: '5min', outputsize: 28 }, // roughly 6.5 hours of trading
    '1h': { interval: '1h', outputsize: 20 },
    '1day': { interval: '1day', outputsize: 30 },
    '1week': { interval: '1week', outputsize: 52 },
  };
  

const StockGraph = ({ symbol }) => {
  const [timeframe, setTimeframe] = useState('1h');
  const [chartData, setChartData] = useState(null);

  const fetchData = async () => {
    try {
        const { interval, outputsize } = intervals[timeframe];
        const res = await axios.get(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=3401d60216d14de88b4c6a7d17f8bc65`);
      const values = res.data.values.reverse(); // earliest to latest
      const data = {
        labels: values.map(v => v.datetime),
        datasets: [{
          label: `${symbol} Price`,
          data: values.map(v => parseFloat(v.close)),
          borderColor: '#4cc9f0',
          tension: 0.3,
          fill: false, 
        }]
      };
      setChartData(data);
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
