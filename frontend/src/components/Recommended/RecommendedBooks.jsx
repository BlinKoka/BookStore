import React, { useState, useEffect } from "react";
import axios from "axios";
import './rebook.css';

const RecommendedBooks = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchRecommendedBooks = async () => {
            try {
                const res = await axios.get("http://localhost:3001/recommendations");
                setBooks(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchRecommendedBooks();
    }, []);

    return (
        <div className="recommended-container">
            <h2>Recommended Books 📚</h2>
            {books.length === 0 ? (
                <p>No recommendations available.</p>
            ) : (
                <ul className="recommended-list">
                    {books.map((book) => (
                        <li key={book.id} className="recommended-item">
                            <img src={`http://localhost:3001${book.cover}`} alt={book.title} className="book-cover" />
                            <h3>{book.title}</h3>
                            <p>{book.desc}</p>
                            <p><strong>Reason:</strong> {book.reason}</p>
                            <p><strong>Price:</strong> ${book.price}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RecommendedBooks;
