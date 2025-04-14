import express from 'express';

const router = express.Router();

// Simple GET route
router.get('/', (req, res) => {
  res.json({ message: 'GET route working! ✅' });
});

// Simple POST route
router.post('/', (req, res) => {
  const { name, age } = req.body;
  res.json({
    message: 'POST route working! ✅',
    received: { name, age }
  });
});

export default router;
