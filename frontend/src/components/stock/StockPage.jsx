import React from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import StockChart from '../dashboard/StockChart';
import RelatedStocks from './RelatedStocks';
import useScrollToTop from '../../hooks/useScrollToTop'
import './StockPage.css';

const StockPage = () => {
  const { symbol } = useParams();
  useScrollToTop();
  return (
    <div className="stock-page-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={symbol}
          className="stock-page-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <div className="stock-chart-fullview">
            <StockChart symbol={symbol} />
          </div>
          <div className="related-stocks-section">
            <RelatedStocks key={symbol} symbol={symbol} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  ); 
};

export default StockPage;
