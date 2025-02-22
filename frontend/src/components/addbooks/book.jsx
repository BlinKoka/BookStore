import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../CartContext";
import "./book.css";

const Book = () => {
    const [books, setBooks] = useState([]);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3001/books")
            .then(res => setBooks(res.data))
            .catch(err => console.log(err));
    }, []);

    // Handle book selection
    const handleBookClick = (book) => {
        navigate(`/books/${book.id}`, { state: { book } }); // Navigate to the new page with book data
    };

    return (
        <div>
            <h1>Books</h1>
            <div className="books">
                {books.map((book) => (
                    <div className="book" key={book.id} onClick={() => handleBookClick(book)}>
                        {book.cover && <img src={`http://localhost:3001${book.cover}`} alt={book.title} />}
                        <h2>{book.title}</h2>
                        <p>{book.desc}</p>
                        <span>${book.price}</span>
                        <button className="add-to-cart" onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the book click
                            addToCart(book);
                        }}>
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>

            <button className="go-to-cart" onClick={() => navigate("/cart")}>
                View Cart
            </button>
        </div>
    );
};

export default Book;