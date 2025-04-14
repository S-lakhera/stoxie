import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Orders.css';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/transaction/${user._id}`);
        setOrders(response.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError('Failed to load orders. Please try again.');
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?._id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      completed: 'status-filled',
      rejected: 'status-rejected'
    };
    return <span className={`status-badge ${statusClasses[status]}`}>{status}</span>;
  };

  const getTypeBadge = (type) => {
    return (
      <span className={`type-badge ${type}`}>
        {type.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="orders-container">
        <h2>Your Orders</h2>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container">
        <h2>Your Orders</h2>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2>Your Orders</h2>
      
      {orders.length === 0 ? (
        <p className="no-orders">You haven't placed any orders yet.</p>
      ) : (
        <div className="orders-table">
          <div className="table-header">
            <span>Date/Time</span>
            <span>Symbol</span>
            <span>Type</span>
            <span>Qty</span>
            <span>Price</span>
            <span>Total</span>
            <span>Status</span>
          </div>
          {orders.map(order => (
            <div className="table-row" key={order._id}>
              <span>{formatDate(order.date)}</span>
              <span className="symbol-cell">{order.stockSymbol}</span>
              <span>{getTypeBadge(order.type)}</span>
              <span>{order.quantity.toLocaleString()}</span>
              <span>{formatPrice(order.price)}</span>
              <span>{formatPrice(order.total)}</span>
              <span>{getStatusBadge(order.status)}</span>
            </div>
          ))} 
        </div>
      )}
    </div>
  );
};

export default Orders;