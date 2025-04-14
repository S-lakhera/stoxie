import express from 'express';
import axios from 'axios';

const router = express.Router();
const API_KEY = 'cvrscjpr01qnpem9e2rgcvrscjpr01qnpem9e2s0';

// 1. Get current price
router.get('/price/:symbol', async (req, res) => {
  const { symbol } = req.params;

  try {
    const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
    if (response.data && response.data.c) {
      res.status(200).json({
        current: response.data.c,
        open: response.data.o,
        high: response.data.h,
        low: response.data.l,
        previousClose: response.data.pc,
      });
    } else {
      res.status(400).json({ message: "No price data found" });
    }
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
