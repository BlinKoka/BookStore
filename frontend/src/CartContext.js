import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const userId = localStorage.getItem("idusers");

    // ✅ Load cart from database when the user logs in
    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:3001/cart/${userId}`)
                .then(res => {
                    setCartItems(res.data.map(item => ({
                        ...item,
                        idcart: item.idcart, // Keep track of the cart item ID
                        quantity: item.quantity
                    })));
                })
                .catch(err => console.error("Error fetching cart:", err));
        } else {
            setCartItems([]); // If no user, reset cart
        }
    }, [userId]);  // Runs when the userId changes

    // ✅ Add to cart
    const addToCart = async (book) => {
        if (!userId) return alert("Please log in first!");

        try {
            const res = await axios.post("http://localhost:3001/cart/add", {
                user_id: userId,
                book_id: book.id,
                quantity: 1
            });

            if (res.status === 200) {
                setCartItems(prev => [...prev, { ...book, quantity: 1, idcart: res.data.idcart }]);
            }
        } catch (err) {
            console.error("Error adding to cart:", err);
        }
    };

    // ✅ Remove from cart
    const removeFromCart = async (idcart) => {
        try {
            await axios.delete(`http://localhost:3001/cart/remove/${idcart}`);
            setCartItems(prev => prev.filter(item => item.idcart !== idcart));
        } catch (err) {
            console.error("Error removing from cart:", err);
        }
    };

    // ✅ Update cart quantity
    const updateCartQuantity = async (idcart, quantity) => {
        try {
            await axios.put("http://localhost:3001/cart/update", { idcart, quantity });
            setCartItems(prev =>
                prev.map(item => item.idcart === idcart ? { ...item, quantity } : item)
            );
        } catch (err) {
            console.error("Error updating quantity:", err);
        }
    };

    // ✅ Clear cart when user logs out
    const clearCart = async () => {
        try {
            await axios.delete(`http://localhost:3001/cart/clear/${userId}`);
            setCartItems([]);
        } catch (err) {
            console.error("Error clearing cart:", err);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
