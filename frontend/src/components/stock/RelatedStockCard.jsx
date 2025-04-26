import React from 'react';
import './RelatedStockCard.css';
import { motion } from 'framer-motion';

const RelatedStockCard = ({ data, onClick, selected }) => {
  const isPositive = data?.change > 0;
  const color = isPositive ? 'limegreen' : data?.change < 0 ? 'tomato' : 'gray';
  const formattedChange = `${isPositive ? '+' : ''}${Number(data?.change || 0).toFixed(2)}`;
  const formattedPercent = `${isPositive ? '+' : ''}${Number(data?.percent || 0).toFixed(2)}%`;

  return (
    <motion.div
      className={`related-stock-card ${selected ? 'selected-stock' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 12 }}
    >
      <div className="stock-card-header">
        <span className="stock-symbol">{data?.symbol}</span>
      </div>
      <div className="stock-bottom">
        <span className="stock-price">${Number(data?.price || 0).toFixed(2)}</span>
        <span className="stock-change" style={{ color }}>
          {formattedChange} ({formattedPercent})
        </span>
      </div>
    </motion.div>
  );
};

export default RelatedStockCard;
