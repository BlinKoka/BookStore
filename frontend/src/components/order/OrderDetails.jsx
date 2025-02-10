import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./OrderDetails.css"; // Import CSS

const OrderDetails = () => {
    const { orderId } = useParams(); // Get order ID from URL
    const [orderItems, setOrderItems] = useState([]);

    useEffect(() => {
        console.log("Fetching order items for orderId:", orderId); // Log the orderId
        axios.get(`http://localhost:3001/order-items/${orderId}`)
            .then(response => {
                console.log("Order Items Response:", response.data); // Log the response
                setOrderItems(response.data);
            })
            .catch(error => console.error("Error fetching order items:", error));
    }, [orderId]);

    return (
        <div className="order-details-container">
            <h2>Order Details</h2>
            {orderItems.length === 0 ? (
                <p>No items found for this order.</p>
            ) : (
                <ul className="order-items-list">
                    {orderItems.map(item => (
                        <li key={item.id} className="order-item">
                            <img src={item.image} alt={item.title} className="order-item-img" />
                            <div className="order-item-info">
                                <h4>{item.title}</h4>
                                <p><strong>Quantity:</strong> {item.quantity}</p>
                                <p><strong>Price:</strong> ${item.price}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OrderDetails;