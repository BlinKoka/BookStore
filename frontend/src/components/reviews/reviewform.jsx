import React, { useState } from "react";
import axios from "axios";
import "./ReviewForm.css"; // Import the CSS file

const ReviewForm = ({ bookId, userId }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/reviews", {
                book_id: bookId,
                user_id: userId,
                rating,
                comment,
            });
            alert("Review submitted successfully!");
            setRating(5);
            setComment("");
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Failed to submit review.");
        }
    };

    return (
        <div className="review-form"> {/* Add the CSS class here */}
            <h3>Leave a Review</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Rating:</label>
                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                    </select>
                </div>
                <div>
                    <label>Comment:</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit Review</button>
            </form>
        </div>
    );
};

export default ReviewForm;