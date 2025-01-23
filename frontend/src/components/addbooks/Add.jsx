import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./book.css";

const Add = () => {
    const [book, setBook] = useState({
        title: "",
        desc: "",
        price: "",
    });
    const [cover, setCover] = useState(null); // Separate state for the cover image
    const navigate = useNavigate();

    const handleChange = (e) => {
        setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e) => {
        setCover(e.target.files[0]); // Capture the file from the input
    };

    const handleClick = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", book.title);
        formData.append("desc", book.desc);
        formData.append("price", book.price);
        formData.append("cover", cover); // Append the image file

        try {
            await axios.post("http://localhost:3001/books", formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Required for file upload
                },
            });
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="form">
            <h1>Add New Book</h1>
            <input
                type="text"
                placeholder="Title"
                onChange={handleChange}
                name="title"
            />
            <input
                type="text"
                placeholder="Description"
                onChange={handleChange}
                name="desc"
            />
            <input
                type="number"
                placeholder="Price"
                onChange={handleChange}
                name="price"
            />
            <input
                type="file"
                onChange={handleFileChange} // File input for the cover
            />
            <button className="formButton" onClick={handleClick}>
                Add
            </button>
        </div>
    );
};

export default Add;
