import React from "react";
import { useCart } from "../../CartContext";
import "./cart.css";

const Cart = () => {
    const { cartItems, updateCartQuantity, removeFromCart } = useCart();

    return (
        <div className="cart">
            <h1>Your Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    {cartItems.map((item) => (
                        <div className="cart-item" key={item.idcart}>
                            <p>{item.title}</p>
                            <p>${item.price}</p>
                            <input
                                type="number"
                                value={item.quantity}
                                min="1"
                                onChange={(e) => updateCartQuantity(item.idcart, Number(e.target.value))}
                            />
                            <p>${(item.price * item.quantity).toFixed(2)}</p>
                            <button onClick={() => removeFromCart(item.idcart)}>Remove</button>
                        </div>
                    ))}
                    <hr />
                    <button>Proceed to Checkout</button>
                </div>
            )}
        </div>
    );
};

export default Cart;
