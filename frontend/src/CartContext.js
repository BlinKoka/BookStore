import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const user_id = 1; // Replace with actual logged-in user ID

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/cart/${user_id}`);
                setCartItems(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchCart();
    }, []);

    const addToCart = async (book) => {
        try {
            await axios.post("http://localhost:3001/cart", {
                user_id,
                book_id: book.id,
                quantity: 1,
            });
            setCartItems((prev) => {
                const existingItem = prev.find((item) => item.book_id === book.id);
                if (existingItem) {
                    return prev.map((item) =>
                        item.book_id === book.id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                }
                return [...prev, { ...book, quantity: 1 }];
            });
        } catch (err) {
            console.log(err);
        }
    };

    const updateCartQuantity = async (idcart, quantity) => {
        try {
            await axios.put(`http://localhost:3001/cart/${idcart}`, { quantity });
            setCartItems((prev) =>
                prev.map((item) => (item.idcart === idcart ? { ...item, quantity } : item))
            );
        } catch (err) {
            console.log(err);
        }
    };

    const removeFromCart = async (idcart) => {
        try {
            await axios.delete(`http://localhost:3001/cart/${idcart}`);
            setCartItems((prev) => prev.filter((item) => item.idcart !== idcart)); // ✅ Use idcart
        } catch (err) {
            console.log(err);
        }
    };
    
    const clearCart = async () => {
        try {
            await axios.delete(`http://localhost:3001/cart/user/${user_id}`);
            setCartItems([]);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateCartQuantity, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
