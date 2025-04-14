import React from 'react';
import './Orders.css'; // optional CSS

const Orders = () => {
  // Dummy data
  const orders = [
    {
      id: 1,
      symbol: 'AAPL',
      type: 'Buy',
      quantity: 10,
      price: 175.5,
      status: 'Executed',
      date: '2025-04-11',
    },
    {
      id: 2,
      symbol: 'GOOGL',
      type: 'Sell',
      quantity: 5,
      price: 2850.75,
      status: 'Pending',
      date: '2025-04-10',
    },
  ];

  return (
    <div className="orders-page">
      <h2>Orders</h2>
      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Symbol</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.date}</td>
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

export default Orders;
