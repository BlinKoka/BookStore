import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Function to add an item to the cart
    const addToCart = (book) => {
        setCartItems((prevCartItems) => {
            const existingItem = prevCartItems.find((item) => item.id === book.id);
            if (existingItem) {
                return prevCartItems.map((item) =>
                    item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCartItems, { ...book, quantity: 1 }];
        });
    };

    // Function to calculate the total amount
    const getTotalCartAmount = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    // Function to remove an item from the cart
    const removeFromCart = (id) => {
        setCartItems((prevCartItems) => prevCartItems.filter((item) => item.id !== id));
    };

    const value = {
        cartItems,
        addToCart,
        getTotalCartAmount,
        removeFromCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    return useContext(CartContext);
};
