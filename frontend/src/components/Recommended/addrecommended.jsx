import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./rec.css";

// Add Recommendation Page
export const AddRecommendation = () => {
    const [recommendation, setRecommendation] = useState({
        book_id: "",
        reason: ""
    });
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await axios.get("http://localhost:3001/books");
                setBooks(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchBooks();
    }, []);

    const handleChange = (e) => {
        setRecommendation((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3001/recommendations", recommendation);
            navigate("/recommendations");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="form">
            <h1>Add Recommendation</h1>
            <select name="book_id" onChange={handleChange}>
                <option value="">Select a Book</option>
                {books.map((book) => (
                    <option key={book.id} value={book.id}>{book.title}</option>
                ))}
            </select>
            <input type="text" placeholder="Reason" name="reason" onChange={handleChange} />
            <button className="formButton" onClick={handleClick}>Add</button>
        </div>
    );
};

export default AddRecommendation;
