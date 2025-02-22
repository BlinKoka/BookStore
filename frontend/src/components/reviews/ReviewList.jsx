import React, { useEffect, useState } from "react";
import axios from "axios";
import "../users/userlist.css"; // Reuse the same CSS file

const ReviewList = () => {
    const [reviews, setReviews] = useState([]); // State to store reviews
    const [editedReview, setEditedReview] = useState({}); // State for editing a review
    const [deletedReviewId, setDeletedReviewId] = useState(null); // State for deleting a review

    // Fetch all reviews from the backend
    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = () => {
        axios.get("http://localhost:3001/reviews")
            .then((response) => {
                setReviews(response.data);
            })
            .catch((error) => {
                console.error("Error fetching reviews:", error);
            });
    };

    // Handle deleting a review
    const handleDeleteReview = (reviewId) => {
        setDeletedReviewId(reviewId);
    };

    // Handle editing a review
    const handleEditReview = (review) => {
        setEditedReview(review);
    };

    const handleSaveReview = () => {
        const { idreviews, rating, comment } = editedReview;
    
        axios.put(`http://localhost:3001/reviews/${idreviews}`, { rating, comment })
            .then(() => {
                setReviews(reviews.map((review) => (review.idreviews === editedReview.idreviews ? editedReview : review)));
                setEditedReview({});
                alert("Review updated successfully!");
            })
            .catch((error) => {
                console.error("Error updating review:", error);
                alert("Failed to update review.");
            });
    };
    
    const handleConfirmDeleteReview = () => {
        if (deletedReviewId) {
            axios.delete(`http://localhost:3001/reviews/${deletedReviewId}`)
                .then(() => {
                    setReviews(reviews.filter((review) => review.idreviews !== deletedReviewId));
                    setDeletedReviewId(null);
                    alert("Review deleted successfully!");
                })
                .catch((error) => {
                    console.error("Error deleting review:", error);
                    alert("Failed to delete review.");
                });
        }
    };

    return (
        <div className="app__bg">
            <h2>Admin Review Management</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Book ID</th>
                        <th>User ID</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map((review) => (
                        <tr key={review.idreviews}>
                            <td>{review.idreviews}</td>
                            <td>{review.book_id}</td>
                            <td>{review.user_id}</td>
                            <td>{review.rating}</td>
                            <td>{review.comment}</td>
                            <td>
                                <div className="btn-group" role="group" aria-label="Review Actions">
                                    <button type="button" className="btn btn-primary" onClick={() => handleEditReview(review)}>Edit</button>
                                    <button type="button" className="btn btn-danger" onClick={() => handleDeleteReview(review.idreviews)}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit Review Form */}
            {editedReview.idreviews && (
                <div className="edit-form">
                    <h3>Edit Review</h3>
                    <input
                        type="number"
                        value={editedReview.rating}
                        onChange={(e) => setEditedReview({ ...editedReview, rating: e.target.value })}
                        placeholder="Rating (1-5)"
                        min="1"
                        max="5"
                    />
                    <input
                        type="text"
                        value={editedReview.comment}
                        onChange={(e) => setEditedReview({ ...editedReview, comment: e.target.value })}
                        placeholder="Comment"
                    />
                    <button className="btn btn-success" onClick={handleSaveReview}>Save</button>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {deletedReviewId && (
                <div className="delete-confirmation">
                    <p>Are you sure you want to delete this review?</p>
                    <div className="buttons">
                        <button className="btn btn-danger" onClick={handleConfirmDeleteReview}>Yes</button>
                        <button className="btn btn-secondary" onClick={() => setDeletedReviewId(null)}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewList;