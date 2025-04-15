import React, { useState, useEffect } from 'react';
import './AddFunds.css';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FiArrowUp, FiArrowDown, FiDollarSign, FiClock } from 'react-icons/fi';

const AddFunds = () => {
  const { user, setUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch user balance
  useEffect(() => {
    if (!user?._id) return;
    
    const fetchBalance = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/balance/${user._id}`);
        setBalance(res.data.balance);
        const updatedUser = { ...user, walletBalance: res.data.balance };
        setUser(updatedUser);
        localStorage.setItem("stoxieUser", JSON.stringify(updatedUser));
      } catch (err) {
        console.error('Failed to fetch balance:', err);
      }
    };

    fetchBalance();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);

    if (!amt || amt <= 0) {
      setMessage({ text: 'Please enter a valid amount', type: 'error' });
      return;
    }

    setIsProcessing(true);
    
    try {
      const response = await axios.patch(`http://localhost:5000/api/user/balance/${user._id}`, {
        type: mode,
        amount: amt,
      });

      const newBalance = response.data.balance;
      setBalance(newBalance);
      const updatedUser = { ...user, walletBalance: newBalance };
      setUser(updatedUser);
      localStorage.setItem("stoxieUser", JSON.stringify(updatedUser));

      setMessage({ 
        text: `${mode === 'add' ? 'Deposit' : 'Withdrawal'} successful!`, 
        type: 'success' 
      });
    } catch (err) {
      setMessage({ 
        text: err.response?.data?.message || "Transaction failed", 
        type: 'error' 
      });
    } finally {
      setIsProcessing(false);
      setAmount('');
      setMode(null);
    }
  };

  return (
    <div className="wallet-container">
      <div className="wallet-header">
        <h2><FiDollarSign /> Wallet</h2>
        <div className="balance-card">
          <div>Available Balance</div>
          <div>${balance.toFixed(2)}</div>
        </div>
      </div>

      <div className="wallet-actions">
        <button 
          onClick={() => setMode('add')}
          disabled={isProcessing}
        >
          <FiArrowDown /> Deposit
        </button>
        <button
          onClick={() => setMode('withdraw')}
          disabled={isProcessing}
        >
          <FiArrowUp /> Withdraw
        </button>
      </div>

      {mode && (
        <div className="transaction-form">
          <h3>{mode === 'add' ? 'Deposit Funds' : 'Withdraw Funds'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Amount (USD)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                min="0"
                disabled={isProcessing}
              />
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className={`submit-btn ${isProcessing ? 'processing' : ''}`}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="processing-indicator">
                    <span className="spinner">↻</span> Processing...
                  </span>
                ) : (
                  mode === 'add' ? 'Deposit' : 'Withdraw'
                )}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setMode(null);
                  setAmount('');
                }}
                disabled={isProcessing}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {message.text && (
        <div className={`notification ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* <div className="transaction-history">
        <h3><FiClock /> Transaction History</h3>
        {transactions.length === 0 ? (
          <div className="empty-state">No transactions yet</div>
        ) : (
          <div className="transactions-list">
            {transactions.map((txn) => (
              <div key={txn._id} className="transaction-item">
                <div className={`txn-icon ${txn.type}`}>
                  {txn.type === 'add' ? <FiArrowDown /> : <FiArrowUp />}
                </div>
                <div className="txn-details">
                  <div>${txn.amount.toFixed(2)}</div>
                  <small>{new Date(txn.date).toLocaleString()}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div> */}
    </div>
  );
};

export default AddFunds;