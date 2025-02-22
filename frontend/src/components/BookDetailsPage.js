import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ReviewForm from "../components/reviews/reviewform"; // Import ReviewForm
import BookReviews from "../components/reviews/bookreviews"; // Import BookReviews
import { UserContext } from "../UserContext"; // Import UserContext
import "../components/CSS/bdetails.css";

const BookDetailsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { book } = location.state || {}; // Get the selected book from state
    const [, setReviews] = useState([]);
    const { user } = useContext(UserContext); // Get logged-in user

    // Fetch reviews for the selected book
    useEffect(() => {
        if (book) {
            axios.get(`http://localhost:3001/reviews/book/${book.id}`)
                .then(res => setReviews(res.data))
                .catch(err => console.error("Error fetching reviews:", err));
        }
    }, [book]);

    if (!book) {
        return <p>No book selected. Please go back to the book list.</p>;
    }

    return (
        <div>
            <button className="go-back-button" onClick={() => navigate(-1)}>
                Go Back
            </button>
            <div className="book-details">
                {book.cover && <img src={`http://localhost:3001${book.cover}`} alt={book.title} />}
                <h2>{book.title}</h2>
                <p>{book.desc}</p>
                <span>${book.price}</span>
            </div>

            <div className="review-section">
                <h2>Reviews for {book.title}</h2>
                {user ? (
                    <ReviewForm bookId={book.id} /> // Only show if user is logged in
                ) : (
                    <p>Please <a href="/login">log in</a> to leave a review.</p>
                )}
                <BookReviews bookId={book.id} />
            </div>
        </div>
    );
};

export default BookDetailsPage;