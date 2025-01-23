import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./book.css";

const Update = () => {
    const [book, setBook] = useState({
        title: "",
        desc: "",
        price: "",
    });
    const [cover, setCover] = useState(null); // Separate state for the cover image
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/books/${id}`);
                setBook({
                    title: res.data.title,
                    desc: res.data.desc,
                    price: res.data.price,
                });
            } catch (err) {
                console.log(err);
            }
        };
        fetchBook();
    }, [id]);

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
        if (cover) formData.append("cover", cover); // Append the image file if updated

        try {
            await axios.put(`http://localhost:3001/books/${id}`, formData, {
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
            <h1>Update Book</h1>
            <input
                type="text"
                placeholder="Title"
                value={book.title}
                onChange={handleChange}
                name="title"
            />
            <input
                type="text"
                placeholder="Description"
                value={book.desc}
                onChange={handleChange}
                name="desc"
            />
            <input
                type="number"
                placeholder="Price"
                value={book.price}
                onChange={handleChange}
                name="price"
            />
            <input
                type="file"
                onChange={handleFileChange} // File input for the cover
            />
            <button className="formButton" onClick={handleClick}>
                Update
            </button>
        </div>
    );
};

export default Update;
