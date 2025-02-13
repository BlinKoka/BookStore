import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import "./ChangePassword.css"; // Import the CSS file

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem("idusers");
            const response = await axios.post("/api/change-password", {
                userId,
                currentPassword,
                newPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setMessage(response.data);
        } catch (error) {
            setMessage("Failed to change password. Please try again.");
        }
    };

    return (
        <div className="change-password-container">
            <h2>Change Password</h2>
            {message && (
                <Alert variant={message.includes("successfully") ? "info" : "error"} className="alert">
                    {message}
                </Alert>
            )}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="currentPassword" className="form-group">
                    <label>Current Password</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="newPassword" className="form-group">
                    <label>New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button type="submit" className="submit-button">
                    Change Password
                </Button>
            </Form>
        </div>
    );
}

export default ChangePassword;