import express from 'express';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import Holding from '../models/Holding.js';

const router = express.Router();

// Simplified updateHoldings function
async function updateHoldings(userId, symbol, quantity, price) {
  // Temporary solution - using purchase price as current price
  const currentPrice = price;
  const stockName = symbol; // Using symbol as name temporarily

  let holding = await Holding.findOne({ userId, symbol });
  
  if (holding) {
    const newQuantity = holding.quantity + quantity;
    const newAvgPrice = 
      ((holding.avgPrice * holding.quantity) + (price * quantity)) / 
      newQuantity;
    
    holding.quantity = newQuantity;
    holding.avgPrice = newAvgPrice;
    holding.currentPrice = currentPrice;
    holding.updatedAt = new Date();
  } else {
    holding = new Holding({
      userId,
      symbol,
      name: stockName,
      quantity,
      avgPrice: price,
      currentPrice,
      updatedAt: new Date()
    });
  }
  
  await holding.save();
  console.log(`Holdings updated for ${symbol}`);
}

// Create new transaction (order)
router.post('/', async (req, res) => {
  try { 
    const { userId, type, stockSymbol, quantity, price, total } = req.body;
    
    // Input validation
    if (!userId || !type || !stockSymbol || !quantity || !price || !total) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // For buy orders, check balance but don't deduct yet
    if (type === 'buy' && user.balance < total) {
      return res.status(400).json({ 
        message: 'Insufficient balance',
        currentBalance: user.balance,
        requiredAmount: total
      });
    }

    // Create transaction with pending status
    const transaction = await new Transaction({
      userId,
      type,
      stockSymbol,
      quantity,
      price,
      total,
      status: 'pending'
    }).save();

    // Schedule completion after 1 minute
    setTimeout(async () => {
      try {
        const updatedTransaction = await Transaction.findById(transaction._id);
        if (updatedTransaction && updatedTransaction.status === 'pending') {
          const user = await User.findById(userId);
          
          // Process the transaction
          if (type === 'buy') {
            user.balance -= total;
            await updateHoldings(userId, stockSymbol, quantity, price);
          } else if (type === 'sell') {
            user.balance += total;
          }
          
          await user.save();
          
          updatedTransaction.status = 'completed';
          updatedTransaction.completedAt = new Date();
          await updatedTransaction.save();
          
          console.log(`Transaction ${updatedTransaction._id} completed`);
          console.log('Updated user balance:', user.balance);
        }
      } catch (err) {
        console.error('Error completing transaction:', err);
      }
    }, 1 * 60 * 1000); // 1 minute for testing

    res.status(201).json({
      message: 'Transaction created successfully (pending)',
      transaction,
      newBalance: user.balance
    });

  } catch (err) {
    console.error('Transaction error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all transactions for a user
router.get('/:userId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId })
      .sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch transactions', error: err.message });
  }
});

export default router;