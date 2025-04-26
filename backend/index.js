import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import testRoutes from './routes/test.js'; // Add this line
import userRoutes from './routes/userRoutes.js'
import stockRoutes from './routes/stockRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import holdingRoutes from './routes/holdingRoutes.js'
import { clearCache } from './utils/cache.js';
import { updatePopularStockPrices } from './jobs/stockPriceUpdater.js';



clearCache();
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes); 
app.use("/api/user", userRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/holdings', holdingRoutes);
 

setInterval(updatePopularStockPrices, 30 * 1000); // update every 30s
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
