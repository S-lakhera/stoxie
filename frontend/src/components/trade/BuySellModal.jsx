// src/components/BuySellModal/BuySellModal.jsx
import React, { useState, useEffect } from 'react';
import './BuySellModal.css';
import ReactDOM from 'react-dom';
import { showSuccess, showError } from '../../utils/toastHandler';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import API from '../../api/axios';


const BuySellModal = ({ stockSymbol, stockPrice, closeModal, userBalance, transactionType: initialType,onTransactionSuccess }) => {
  const [quantity, setQuantity] = useState('');
  const [transactionType, setTransactionType] = useState(initialType); // Use incoming type
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);


  useEffect(() => {
    const q = parseFloat(quantity);
    setTotal(isNaN(q) ? 0 : (q * stockPrice));
  }, [quantity, stockPrice]);

  const handleTransaction = async () => {
    const q = parseFloat(quantity);
    if (!q || q <= 0) {
      setError('Quantity must be greater than 0.');
      return;
    }
  
    if (transactionType === 'buy' && total > userBalance) {
      setError('Insufficient funds.');
      return;
    }
  
    const storedUser = JSON.parse(localStorage.getItem('stoxieUser'));
    const userId = storedUser?.id;
  
    if (!userId) {
      showError('User not authenticated. Please log in again.');
      return;
    }
  
    try {
      // First check holdings if it's a sell order
      if (transactionType === 'sell') {
        const holdingsResponse = await API.get(`/api/holdings/${userId}`);
        const stockHolding = holdingsResponse.data.find(h => h.symbol === stockSymbol);
        
        if (!stockHolding) {
          // Create a rejected order
          await API.post('/api/transaction', {
            userId,
            type: 'sell',
            stockSymbol,
            quantity: q,
            price: stockPrice,
            total,
            status: 'rejected',
            rejectionReason: 'Stock not in holdings'
          });
          showError(`You don't own ${stockSymbol} in your holdings`);
          closeModal();
          return;
        }
        
        if (q > stockHolding.quantity) {
          // Create a rejected order
          await API.post('/api/transaction', {
            userId,
            type: 'sell',
            stockSymbol,
            quantity: q,
            price: stockPrice,
            total,
            status: 'rejected',
            rejectionReason: 'Insufficient quantity'
          });
          showError(`You only have ${stockHolding.quantity} shares of ${stockSymbol}`);
          closeModal();
          return;
        }
      }
  
      // Proceed with normal transaction if validation passes
      const response = await API.post('/api/transaction', {
        userId,
        type: transactionType,
        stockSymbol,
        quantity: q,
        price: stockPrice,
        total,
        status: "pending" // Will be updated to completed by backend if successful
      });
      
      // Buy Order placed for 1 share of Amzn at 

      showSuccess(`${transactionType === 'buy' ? 'Buy' : 'Sell'} order placed for ${q} share of ${stockSymbol} at $${stockPrice}!`);
      // showSuccess(`Successfully ${transactionType === 'buy' ? 'bought' : 'sold'} ${q} ${stockSymbol} shares!`);
  
      if (onTransactionSuccess) {
        const updatedBalance = response.data.newBalance ?? 
          (transactionType === 'buy' 
            ? userBalance - total 
            : userBalance + total);
        
        onTransactionSuccess(updatedBalance);
      }
      
      setTimeout(() => {
        closeModal();
      }, 3000);
    } catch (err) {
      console.error('Transaction error:', err.response?.data || err.message);
      showError(err.response?.data?.message || 'Transaction failed. Try again.');
      closeModal()
    }
  };
  



  return ReactDOM.createPortal(
    (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2 style={{ color: transactionType === 'buy' ? 'limegreen' : 'tomato' }}>
              {transactionType === 'buy' ? 'Buy' : 'Sell'} {stockSymbol}
            </h2>

            <span className="close-btn" onClick={closeModal}>×</span>
          </div>

          <div className="modal-subinfo">
            <p style={{marginBottom:"20px"}} ><strong>Current Price:</strong> ${stockPrice}</p> 
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
              <label  >Quantity</label><br /><br />
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
              <button
                onClick={handleTransaction}
                style={{ backgroundColor: transactionType === 'buy' ? 'green' : 'tomato' }}
              >
                {transactionType === 'buy' ? 'Confirm Buy' : 'Confirm Sell'}
              </button>

              <button className="cancel-btn" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        <ToastContainer position="bottom-center" autoClose={3000} />
        </div>
      </div>
    ),
    document.getElementById('modal-root') // make sure this div exists in index.html
  );
};

export default BuySellModal;
