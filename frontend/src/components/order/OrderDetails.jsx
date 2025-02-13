import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./OrderDetails.css"; // Import CSS

const OrderDetails = () => {
    const { orderId } = useParams(); // Get order ID from URL
    const navigate = useNavigate();
    const [orderItems, setOrderItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0); // ✅ Track total price
    

    useEffect(() => {
        console.log("🔍 Order ID from URL:", orderId);
        
        if (!orderId) {
            console.error("❌ Order ID is missing. Redirecting...");
            navigate("/order-history"); // Redirect user back to order history
            return;
        }

        axios.get(`http://localhost:3001/order-items/${orderId}`)
            .then(response => {
                console.log("✅ Order Items Response:", response.data);
                setOrderItems(response.data);

                // ✅ Calculate total price dynamically
                const total = response.data.reduce((sum, item) => sum + item.price * item.quantity, 0);
                setTotalPrice(total);
            })
            .catch(error => console.error("❌ Error fetching order items:", error));
    }, [orderId, navigate]);

    return (
        <div className="order-details-container">
            <h2>Order Details</h2>
            {orderItems.length === 0 ? (
                <p>No items found for this order.</p>
            ) : (
                <div>
                    <ul className="order-items-list">
                        {orderItems.map(item => (
                            <li key={item.id} className="order-item">
                                <img src={`http://localhost:3001${item.image}`} alt={item.title} className="order-item-img" />
                                <div className="order-item-info">
                                    <h4>{item.title}</h4>
                                    <p><strong>Quantity:</strong> {item.quantity}</p>
                                    <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
                                    <p><strong>Subtotal:</strong> ${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="total-price">
                        <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetails;
