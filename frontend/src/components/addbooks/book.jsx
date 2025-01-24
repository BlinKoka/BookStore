import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../CartContext"; // Import the custom hook
import "./book.css";

const Book = () => {
    const [books, setBooks] = useState([]);
    const { addToCart } = useCart(); // Use context
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const res = await axios.get("http://localhost:3001/books");
                setBooks(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllBooks();
    }, []);

    
    const goToCart = () => {
        navigate("/cart");
    };

    return (
        <div>
            <h1>Books</h1>
            <div className="books">
                {books.map((book) => (
                    <div className="book" key={book.id}>
                        {book.cover && <img src={`http://localhost:3001${book.cover}`} alt={book.title} />}
                        <h2>{book.title}</h2>
                        <p>{book.desc}</p>
                        <span>${book.price}</span>
                        <button className="add-to-cart" onClick={() => addToCart(book)}>
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
            <button className="go-to-cart" onClick={goToCart}>
                View Cart
            </button>
        </div>
    );
};

export default Book;
