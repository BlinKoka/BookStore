import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./book.css";

const Book = () => {
    const [books, setBooks] = useState([]);

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

    return (
        <div>
            <h1>Books</h1>
            <div className="books">
                {books.map((book) => (
                    <div className="book" key={book.id}>
                        {book.cover && <img src={`http://localhost:3001${book.cover}`} alt={book.title}/>}
                        <h2>{book.title}</h2>
                        <p>{book.desc}</p>
                        <span>${book.price}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Book;