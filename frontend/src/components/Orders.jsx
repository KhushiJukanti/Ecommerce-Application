
import React, { useEffect, useState } from 'react';
import { fetchOrders } from '../api';

const Orders = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchOrders(userId);
        setOrders(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching orders: {error}</p>;

  return (
    <div className="container mt-5">
      <h2>Your Orders</h2>
      <div className="row">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="col-md-4">
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Order ID: {order._id}</h5>
                  <p className="card-text">Total Amount: ${order.totalAmount}</p>
                  <p className="card-text">
                    Created At: {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <h6>Items:</h6>
                  {order.cartItems.length === 0 ? (
                    <p>No items in this order.</p>
                  ) : (
                    <ul>
                      {order.cartItems.map((item) => (
                        <li key={item.product}>
                          Product ID: {item.product} - Quantity: {item.quantity}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
