import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrderHistory.css";
import { Link } from "react-router-dom";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const userId = localStorage.getItem("idusers"); // ✅ Get userId directly from localStorage

    useEffect(() => {
        if (!userId) return;

        axios.get(`http://localhost:3001/orders/${userId}`)
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => {
                console.error("Error fetching orders:", error);
            });
    }, [userId]);

    return (
        <div className="order-history-container">
            <h2>Order History</h2>
            {orders.length === 0 ? (
                <p className="no-orders">No orders found.</p>
            ) : (
                <ul className="order-list">
                    {orders.map(order => (
                        <li key={order.id} className="order-item">
                            <div className="order-info">
                                <p><strong>Order ID:</strong> {order.id}</p>
                                <p><strong>Total Price:</strong> ${order.total_price.toFixed(2)}</p>
                                <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <Link to={`/order-items/${order.idorder}`} className="view-details">
                                View Details
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OrderHistory;
