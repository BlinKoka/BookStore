import React from "react";
import { useCart } from "../../CartContext";
import "./cart.css";

const Cart = () => {
    const { cartItems, getTotalCartAmount, removeFromCart } = useCart();

    return (
        <div className="cart">
            <h1>Your Cart</h1>
            {cartItems.length === 0 ? (
                <p>{/* Your cart is empty. */}</p>
            ) : (
                <div>
                    <div className="cart-header">
                        <p>{/* Title */}</p>
                        <p>{/* Price */}</p>
                        <p>{/* Quantity */}</p>
                        <p>{/* Total */}</p>
                        <p>{/* Action */}</p>
                    </div>
                    <hr />
                    {cartItems.map((item) => (
                        <div className="cart-item" key={item.id}>
                            <p>{item.title}</p>
                            <p>${item.price}</p>
                            <p>{item.quantity}</p>
                            <p>${(item.price * item.quantity).toFixed(2)}</p>
                            <button onClick={() => removeFromCart(item.id)}>Remove</button>
                        </div>
                    ))}
                    <hr />
                    <div className="cart-total">
                        <h2>Cart Total: ${getTotalCartAmount()}</h2>
                    </div>
                    <button>Proceed to Checkout</button>
                </div>
            )}
        </div>
    );
};

export default Cart;
