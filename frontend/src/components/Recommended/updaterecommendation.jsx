import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export const UpdateRecommendation = () => {
    const [recommendation, setRecommendation] = useState({
        book_id: "",
        reason: ""
    });
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchRecommendation = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/recommendations/${id}`);
                setRecommendation(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchRecommendation();

        const fetchBooks = async () => {
            try {
                const res = await axios.get("http://localhost:3001/books");
                setBooks(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchBooks();
    }, [id]);

    const handleChange = (e) => {
        setRecommendation((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3001/recommendations/${id}`, recommendation);
            navigate("/recommendations");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="form">
            <h1>Update Recommendation</h1>
            <select name="book_id" onChange={handleChange} value={recommendation.book_id}>
                {books.map((book) => (
                    <option key={book.id} value={book.id}>{book.title}</option>
                ))}
            </select>
            <input type="text" placeholder="Reason" name="reason" value={recommendation.reason} onChange={handleChange} />
            <button className="formButton" onClick={handleClick}>Update</button>
        </div>
    );
};

export default UpdateRecommendation;