import express from 'express';
import Holding from '../models/Holding.js';

const router = express.Router();

// Get all holdings for a user
router.get('/:userId', async (req, res) => { 
  try {
    const holdings = await Holding.find({ userId: req.params.userId });
    res.status(200).json(holdings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch holdings', error: err.message });
  }
}); 
// Get all holdings (for debugging)
router.get('/debug/holdings', async (req, res) => {
  try {
    const holdings = await Holding.find({});
    res.status(200).json(holdings);
  } catch (err) {
    res.status(500).json({ message: 'Debug failed', error: err.message });
  }
});

 

export default router;