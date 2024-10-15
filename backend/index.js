import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "bookstore"
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json("hello this is the backend");
});

app.get("/books", (req, res) => {
    const query = "SELECT * FROM books";
    db.query(query, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.post("/books", (req, res) => {
    const query = "INSERT INTO books (`title`, `desc`, `price`, `cover`) VALUES (?)";
    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover,
    ];

    db.query(query, [values], (err, data) => {
        if (err) {
            console.error(err); // Log the error for debugging
            return res.status(500).json(err); // Return a 500 status code with the error
        }
        return res.status(201).json("Book has been created successfully"); // Return a 201 status code for successful creation
    });
});

app.listen(3001, () => {
    console.log("Connected to backend!");
});
