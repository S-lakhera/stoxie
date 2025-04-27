// routes/stockGraph.js
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // To access the API key securely
const router = express.Router();

const API_KEY = process.env.TWELVE_DATA_API_KEY;

const intervals = {
  '5min': { interval: '5min', outputsize: 28 },
  '1h': { interval: '1h', outputsize: 20 },
  '1day': { interval: '1day', outputsize: 30 },
  '1week': { interval: '1week', outputsize: 52 },
}; 

router.get('/:symbol/:timeframe', async (req, res) => {
  const { symbol, timeframe } = req.params;
  const { interval, outputsize } = intervals[timeframe] || intervals['1h'];
 
  try {
    const response = await axios.get(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${API_KEY}`);
    const values = response.data.values.reverse();

    const data = {
      labels: values.map(v => v.datetime),
      datasets: [{
        label: `${symbol} Price`,
        data: values.map(v => parseFloat(v.close)),
        borderColor: '#4cc9f0',
        tension: 0.3,
        fill: false,
      }],
    };

    res.json(data);
  } catch (error) {
    console.error("Error fetching stock graph data:", error.message);
    res.status(500).json({ message: 'Failed to fetch stock data', error: error.message });
  }
});

export default router;
