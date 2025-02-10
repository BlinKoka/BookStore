import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrderHistory.css";
import { Link } from "react-router-dom";

const OrderHistory = ({ userId }) => {
    const [orders, setOrders] = useState([]);

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
                            <p><strong>Order ID:</strong> {order.id}</p>
                            <p><strong>Total Price:</strong> ${order.total_price}</p>
                            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                            <Link to={`/order-details/${order.id}`} className="view-details">
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