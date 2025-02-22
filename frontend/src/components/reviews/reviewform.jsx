import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../UserContext"; // Import UserContext
import "./ReviewForm.css";

const ReviewForm = ({ bookId }) => {
    const { user } = useContext(UserContext); // Get logged-in user
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("You must be logged in to submit a review.");
            return;
        }
    
        try {
            const response = await axios.post("http://localhost:3001/reviews", {
                book_id: bookId,
                user_id: user.id, // Use the logged-in user's ID
                rating,
                comment,
            });

            console.log("Review submitted successfully:", response.data);
            alert("Review submitted successfully!");
    

            setRating(5);
            setComment("");
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Failed to submit review.");
        }
    };

    if (!user) {
        return <p>Please <a href="/login">log in</a> to leave a review.</p>;
    }

    return (
        <div className="review-form">
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