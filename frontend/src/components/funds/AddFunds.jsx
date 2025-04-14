import React, { useState, useEffect } from 'react';
import './AddFunds.css';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const AddFunds = () => {
  const { user, setUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState(null); // 'add' or 'withdraw'
  const [success, setSuccess] = useState('');
  const [balance, setBalance] = useState(0);

  // Fetch latest balance on load
  useEffect(() => {
    if (user?._id) {
      axios.get(`http://localhost:5000/api/user/balance/${user._id}`)
        .then((res) => {
          setBalance(res.data.balance);
          const updatedUser = { ...user, walletBalance: res.data.balance };
          setUser(updatedUser);
          localStorage.setItem("stoxieUser", JSON.stringify(updatedUser));
        })
        .catch((err) => console.error('Failed to fetch balance', err));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);

    if (!amt || amt <= 0) return;

    try {
      const response = await axios.patch(`http://localhost:5000/api/user/balance/${user._id}`, {
        type: mode,
        amount: amt,
      });
 
      const newBalance = response.data.balance;
      setBalance(newBalance);

      // update context + localStorage
      const updatedUser = { ...user, walletBalance: newBalance };
      setUser(updatedUser);
      localStorage.setItem("stoxieUser", JSON.stringify(updatedUser));

      setSuccess(
        mode === 'add'
          ? `💸 $${amt} added successfully!`
          : `💰 $${amt} withdrawn successfully!`
      );
    } catch (err) {
      if (err.response?.data?.message === "Insufficient funds") {
        setSuccess("❌ Insufficient funds.");
      } else {
        setSuccess("⚠️ Something went wrong.");
      }
    }

    setAmount('');
    setMode(null);
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="add-funds-container">
      <h2>Wallet</h2>
      <p className="wallet-balance">Current Balance: ${balance}</p>

      <div className="wallet-actions">
        <button className="wallet-btn add" onClick={() => setMode('add')}>Add Funds</button>
        <button className="wallet-btn withdraw" onClick={() => setMode('withdraw')}>Withdraw Funds</button>
      </div>

      {mode && (
        <form className="wallet-form" onSubmit={handleSubmit}>
          <h4>{mode === 'add' ? 'Add Funds' : 'Withdraw Funds'}</h4>
          <input
            type="number"
            value={amount}
            placeholder="Enter amount (USD)"
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="wallet-form-buttons">
            <button type="submit">{mode === 'add' ? 'Add' : 'Withdraw'}</button>
            <button type="button" className="cancel-btn" onClick={() => setMode(null)}>Cancel</button>
          </div>
        </form>
      )}

      {success && <p className="success-msg">{success}</p>}
    </div>
  );
};

export default AddFunds;
