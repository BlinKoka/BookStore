import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./booklist.css";

const Books = () => {
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

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/books/${id}`);
            setBooks(books.filter((book) => book.id !== id));
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="admin-books-container">
            <h2>Admin Book Management</h2>
            {books.length === 0 ? (
                <p className="no-books">No books found.</p>
            ) : (
                <table className="book-table">
                    <thead>
                        <tr>
                            <th>Book ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Cover</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book.id}>
                                <td>{book.id}</td>
                                <td>{book.title}</td>
                                <td>{book.desc}</td>
                                <td>${book.price.toFixed(2)}</td>
                                <td>
                                    {book.cover && (
                                        <img
                                            src={`http://localhost:3001${book.cover}`}
                                            alt={book.title}
                                            className="book-cover"
                                        />
                                    )}
                                </td>
                                <td>
                                    <button className="delete" onClick={() => handleDelete(book.id)}>Delete</button>
                                    <button className="update">
                                        <Link to={`/update/${book.id}`}>Update</Link>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <button className="add">
                <Link to="/add">Add New Book</Link>
            </button>
        </div>
    );
};

export default Books;
