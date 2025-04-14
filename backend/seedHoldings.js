import mongoose from 'mongoose';
import Holding from './models/Holding.js';
import dotenv from 'dotenv';

dotenv.config();

const seedHoldings = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const dummyHoldings = [
      {
        userId: 'user123',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        quantity: 10,
        avgPrice: 145.32,
        currentPrice: 172.88
      },
      {
        userId: 'user123',
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        quantity: 5,
        avgPrice: 620.15,
        currentPrice: 699.99
      },
      {
        userId: 'user123',
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        quantity: 8,
        avgPrice: 2100.5,
        currentPrice: 2255.3
      }
    ];

    await Holding.deleteMany({}); // Clear existing holdings
    await Holding.insertMany(dummyHoldings);
    
    console.log('Dummy holdings data seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding holdings data:', err);
    process.exit(1);
  }
};

seedHoldings();