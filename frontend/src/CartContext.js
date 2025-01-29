import React, { createContext, useContext, useState, useEffect } from "react";

// Create CartContext to share cart state across components
const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Initialize cartItems from localStorage or default to an empty array
    const [cartItems, setCartItems] = useState(() => {
        const savedCartItems = localStorage.getItem("cartItems");
        return savedCartItems ? JSON.parse(savedCartItems) : [];
    });

    // Save cartItems to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

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

    // Optional function to clear the entire cart
    const clearCart = () => {
        setCartItems([]);
    };

    // Context value to pass to components
    const value = {
        cartItems,
        addToCart,
        getTotalCartAmount,
        removeFromCart,
        clearCart,  // Optional: add clear cart functionality
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook to access cart context
export const useCart = () => {
    return useContext(CartContext);
};
