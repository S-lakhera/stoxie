// jobs/stockPriceUpdater.js
import axios from 'axios';
import { setCache } from '../utils/cache.js';

const API_KEY = 'cvrscjpr01qnpem9e2rgcvrscjpr01qnpem9e2s0';
const popularSymbols = ['AAPL', 'AMZN', 'TSLA', 'GOOGL', 'MSFT'];

export const updatePopularStockPrices = async () => {
//   console.log('🔄 Updating cached stock prices...');
  for (const symbol of popularSymbols) {
    try {
      const res = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
      const { c, o, h, l, pc } = res.data;

      const formatted = {
        current: c,
        open: o,
        high: h,
        low: l,
        previousClose: pc
      };

      setCache(`price:${symbol}`, formatted, 60); // cache TTL still applies
    //   console.log(`✅ Updated cache for ${symbol}`);
    } catch (err) {
      console.error(`❌ Failed to update ${symbol}:`, err.message);
    }
  }
};
