import express from 'express';
import axios from 'axios';
import { getCache, setCache } from '../utils/cache.js';
const router = express.Router();
const API_KEY = 'cvrscjpr01qnpem9e2rgcvrscjpr01qnpem9e2s0';

// Price route with caching
router.get('/price/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const cacheKey = `price:${symbol}`;

  const cachedData = getCache(cacheKey);
  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  try {
    const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
    const { c, o, h, l, pc } = response.data;

    const formatted = {
      current: c,
      open: o,
      high: h,
      low: l,
      previousClose: pc
    };

    setCache(cacheKey, formatted, 60); // cache for 60 seconds
    res.status(200).json(formatted);
  } catch (err) {
    console.error('Error fetching stock price:', err.message);
    res.status(500).json({ message: "Error fetching price", error: err.message });
  }
});

// 2. Get company profile
router.get('/profile/:symbol', async (req, res) => {
  const { symbol } = req.params;

  try {
    const response = await axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${API_KEY}`);
    res.status(200).json(response.data);
  } catch (err) {
    console.error('Error fetching company profile:', err.message);
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
});
  
// 3. Get stock peers
router.get('/peers/:symbol', async (req, res) => {
  const { symbol } = req.params;

  try {
    const response = await axios.get(`https://finnhub.io/api/v1/stock/peers?symbol=${symbol}&token=${API_KEY}`);
    res.status(200).json({ peers: response.data });
  } catch (err) {
    console.error('Error fetching peers:', err.message);
    res.status(500).json({ message: "Error fetching peers", error: err.message });
  }
});

export default router;
