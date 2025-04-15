import express from 'express';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import Holding from '../models/Holding.js';

const router = express.Router();

// Simplified updateHoldings function
async function updateHoldings(userId, symbol, quantity, price, isBuy) {
  // Temporary solution - using purchase price as current price
  const currentPrice = price;
  const stockName = symbol; // Using symbol as name temporarily

  let holding = await Holding.findOne({ userId, symbol });
  
  if (holding) {
    if (isBuy) {
      // For buy orders, increase quantity and recalculate average price
      const newQuantity = holding.quantity + quantity;
      const newAvgPrice = 
        ((holding.avgPrice * holding.quantity) + (price * quantity)) / 
        newQuantity;
      
      holding.quantity = newQuantity;
      holding.avgPrice = newAvgPrice;
    } else {
      // For sell orders, decrease quantity
      holding.quantity -= quantity;
      
      // If quantity reaches zero, delete the holding
      if (holding.quantity <= 0) {
        await Holding.deleteOne({ _id: holding._id });
        console.log(`Deleted holding for ${symbol}`);
        return;
      }
    }
    
    holding.currentPrice = currentPrice;
    holding.updatedAt = new Date();
    await holding.save();
  } else if (isBuy) {
    // Create new holding only for buy orders
    holding = new Holding({
      userId,
      symbol,
      name: stockName,
      quantity,
      avgPrice: price,
      currentPrice,
      updatedAt: new Date()
    });
    await holding.save();
  }
  
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

    // For sell orders, validate holdings first
    if (type === 'sell') {
      const holdings = await Holding.find({ userId, symbol: stockSymbol });
      const totalHolding = holdings.reduce((sum, h) => sum + h.quantity, 0);
      
      if (holdings.length === 0) {
        // Create rejected transaction
        const rejectedTransaction = await new Transaction({
          userId,
          type,
          stockSymbol,
          quantity,
          price,
          total,
          status: 'rejected',
          rejectionReason: 'Stock not in holdings'
        }).save();
        
        return res.status(400).json({ 
          message: 'Stock not in holdings',
          transaction: rejectedTransaction
        });
      }
      
      if (quantity > totalHolding) {
        // Create rejected transaction
        const rejectedTransaction = await new Transaction({
          userId,
          type,
          stockSymbol,
          quantity,
          price,
          total,
          status: 'rejected',
          rejectionReason: 'Insufficient quantity in holdings'
        }).save();
        
        return res.status(400).json({ 
          message: `Insufficient quantity (available: ${totalHolding})`,
          transaction: rejectedTransaction
        });
      }
    }

    // For buy orders, check balance
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

    // Schedule completion after 1 minute (simulating market execution)
    setTimeout(async () => {
      try {
        const updatedTransaction = await Transaction.findById(transaction._id);
        if (!updatedTransaction || updatedTransaction.status !== 'pending') {
          return;
        }

        const user = await User.findById(userId);
        if (!user) {
          updatedTransaction.status = 'rejected';
          updatedTransaction.rejectionReason = 'User not found';
          await updatedTransaction.save();
          return;
        }
          
        // Process the transaction
        if (type === 'buy') {
          // Final balance check (in case balance changed)
          if (user.balance < total) {
            updatedTransaction.status = 'rejected';
            updatedTransaction.rejectionReason = 'Insufficient balance at execution time';
            await updatedTransaction.save();
            return;
          }
          
          user.balance -= total;
          await updateHoldings(userId, stockSymbol, quantity, price, true);
        } else if (type === 'sell') {
          // Final holdings check (in case holdings changed)
          const holdings = await Holding.find({ userId, symbol: stockSymbol });
          const totalHolding = holdings.reduce((sum, h) => sum + h.quantity, 0);
          
          if (quantity > totalHolding) {
            updatedTransaction.status = 'rejected';
            updatedTransaction.rejectionReason = 'Insufficient quantity at execution time';
            await updatedTransaction.save();
            return;
          }
          
          user.balance += total;
          await updateHoldings(userId, stockSymbol, quantity, price, false);
        }
        
        await user.save();
        
        updatedTransaction.status = 'completed';
        updatedTransaction.completedAt = new Date();
        await updatedTransaction.save();
        
        console.log(`Transaction ${updatedTransaction._id} completed`);
        console.log('Updated user balance:', user.balance);
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const totalOrders = await Transaction.countDocuments({ userId: req.params.userId });
    const totalPages = Math.ceil(totalOrders / limit);

    const transactions = await Transaction.find({ userId: req.params.userId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      orders: transactions,
      totalPages,
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch transactions', error: err.message });
  }
});

export default router;