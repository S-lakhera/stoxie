import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Orders.css'


const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user?._id) return;
  
    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/orders/${user._id}`);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };
  
    fetchOrders();
  }, [user?._id]);
  
  return (
    <div className="orders-page">
      <h2>Your Orders</h2>
      {orders.length === 0 ? <p>No orders yet</p> : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Date</th><th>Symbol</th><th>Type</th><th>Qty</th><th>Price</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td>{order.symbol}</td>
                <td>{order.type}</td>
                <td>{order.quantity}</td>
                <td>${order.price}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders