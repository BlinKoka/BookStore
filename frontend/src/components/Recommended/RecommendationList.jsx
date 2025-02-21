import React, { useEffect, useState } from "react";
import axios from "axios";


export const RecommendationList = () => {
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const res = await axios.get("http://localhost:3001/recommendations");
                setRecommendations(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchRecommendations();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/recommendations/${id}`);
            setRecommendations(recommendations.filter((rec) => rec.id !== id));
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="recommend-container">
            <h2>Recommended Books</h2>
            <table className="recommend-table">
                <thead>
                    <tr>
                        <th>Book Title</th>
                        <th>Reason</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {recommendations.map((rec) => (
                        <tr key={rec.id}>
                            <td>{rec.title}</td>
                            <td>{rec.reason}</td>
                            <td>
                                <button className="delete" onClick={() => handleDelete(rec.id)}>Delete</button>
                                <button className="update">
                                    <a href={`/update-recommendation/${rec.id}`}>Update</a>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="add">
                <a href="/add-recommendation">Add New Recommendation</a>
            </button>
        </div>
    );
};
export default RecommendationList;