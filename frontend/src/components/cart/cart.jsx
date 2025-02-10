import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../../CartContext";
import "./cart.css";

const Cart = () => {
    const { cartItems, updateCartQuantity, removeFromCart } = useCart();
    const navigate = useNavigate();
    const [loggedInUserId, setLoggedInUserId] = useState(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem("idusers");
        if (storedUserId) setLoggedInUserId(Number(storedUserId));
    }, []);

    const handleCheckout = async () => {
        if (!loggedInUserId) {
            alert("Please log in to proceed.");
            return navigate("/login");
        }

        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3001/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: loggedInUserId }),
            });

            const data = await response.json();
            if (data.success) {
                alert("Order placed successfully!");
                navigate("/orders");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Something went wrong.");
        }
    };
    
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
                    <button onClick={handleCheckout}>Proceed to Checkout</button>
                </div>
            )}
        </div>
    );
};

export default Cart;
