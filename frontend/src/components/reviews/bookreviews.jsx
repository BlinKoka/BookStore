import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BookReviews.css"; // Import the CSS file

const BookReviews = ({ bookId }) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/reviews/book/${bookId}`);
                setReviews(response.data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };
        fetchReviews();
    }, [bookId]);

    return (
        <div className="book-reviews"> {/* Add the CSS class here */}
            <h3>Reviews</h3>
            {reviews.length === 0 ? (
                <p className="no-reviews">No reviews yet. Be the first to review this book!</p>
            ) : (
                reviews.map((review) => (
                    <div key={review.id} className="review-item"> {/* Add the CSS class here */}
                        <p><strong>{review.username}</strong> - {review.rating} stars</p>
                        <p>{review.comment}</p>
                        <p><small>{new Date(review.created_at).toLocaleDateString()}</small></p>
                    </div>
                ))
            )}
        </div>
    );
};

export default BookReviews;