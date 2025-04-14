import mongoose from 'mongoose';

const holdingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
  },
  avgPrice: {
    type: Number,
    required: true,
  },
  currentPrice: {
    type: Number,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Holding = mongoose.model('Holding', holdingSchema);
export default Holding;