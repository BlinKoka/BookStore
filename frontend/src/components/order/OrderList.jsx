import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrderList.css";

const OrderList = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3001/orders")
            .then(response => {
                console.log("📦 Orders Fetched:", response.data); // Debugging log
                setOrders(response.data);
            })
            .catch(error => console.error("❌ Error fetching orders:", error));
    }, []);

    const updateOrderStatus = (idorder, newStatus) => {
        axios.put(`http://localhost:3001/orders/${idorder}`, { status: newStatus })
            .then(() => {
                setOrders(orders.map(order => 
                    order.idorder === idorder ? { ...order, status: newStatus } : order
                ));
            })
            .catch(error => console.error("❌ Error updating status:", error));
    };

    return (
        <div className="admin-orders-container">
            <h2>Admin Order Management</h2>
            {orders.length === 0 ? (
                <p className="no-orders">No orders found.</p>
            ) : (
                <table className="order-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Total Price</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Update Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.idorder}>
                                <td>{order.idorder}</td>
                                <td>{order.user_id}</td>  
                                <td>{order.username || "N/A"}</td>  
                                <td>{order.email || "N/A"}</td>  
                                <td>${order.total_price.toFixed(2)}</td>
                                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                <td className={`status-${order.status.toLowerCase()}`}>{order.status}</td>
                                <td>
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateOrderStatus(order.idorder, e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OrderList;