// src/components/BuySellModal/BuySellModal.jsx
import React, { useState, useEffect } from 'react';
import './BuySellModal.css';
import ReactDOM from 'react-dom';

const BuySellModal = ({ stockSymbol, stockPrice, closeModal, userBalance }) => {
  const [quantity, setQuantity] = useState('');
  const [transactionType, setTransactionType] = useState('buy');
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const q = parseFloat(quantity);
    setTotal(isNaN(q) ? 0 : (q * stockPrice));
  }, [quantity, stockPrice]);

  const handleTransaction = () => {
    const q = parseFloat(quantity);
    if (!q || q <= 0) {
      setError('Quantity must be greater than 0.');
      return;
    }

    if (transactionType === 'buy' && total > userBalance) {
      setError('Insufficient funds.');
      return;
    }

    console.log(`Transaction: ${transactionType} ${q} shares of ${stockSymbol} at ${stockPrice}`);

    // Later: Axios POST request to backend here

    closeModal();
  };

  return ReactDOM.createPortal(
    (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{transactionType === 'buy' ? 'Buy' : 'Sell'} {stockSymbol}</h2>
          <span className="close-btn" onClick={closeModal}>×</span>
        </div>

        <div className="modal-subinfo">
          <p><strong>Current Price:</strong> ${stockPrice}</p>
          <p><strong>Available Balance:</strong> ${userBalance.toFixed(2)}</p>
        </div>

        <div className="modal-content">
          <div className="transaction-toggle">
            <button 
              className={transactionType === 'buy' ? 'active' : ''}
              onClick={() => setTransactionType('buy')}
            >Buy</button>
            <button 
              className={transactionType === 'sell' ? 'active' : ''}
              onClick={() => setTransactionType('sell')}
            >Sell</button>
          </div>

          <div className="modal-field">
            <label>Quantity</label>
            <input 
              type="number" 
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              placeholder="Enter quantity"
            />
          </div>

          <div className="modal-summary">
            <p><strong>Total:</strong> ${total.toFixed(2)}</p>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="modal-actions">
            <button onClick={handleTransaction}>
              {transactionType === 'buy' ? 'Confirm Buy' : 'Confirm Sell'}
            </button>
            <button className="cancel-btn" onClick={closeModal}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  ),
  document.getElementById('modal-root') // make sure this div exists in index.html
);
};

export default BuySellModal;
