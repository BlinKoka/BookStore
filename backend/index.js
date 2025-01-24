import express from "express";
import mysql from "mysql";
import cors from "cors";
import multer from "multer";
import path from "path";

const app = express();

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "bookstore",
});

// Middleware
app.use(express.json());
app.use(cors());
app.use("/IMG", express.static("IMG")); // Serve static files from the uploads directory

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "IMG"); // Directory to save uploaded images
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Add unique suffix to file name
    },
});

const upload = multer({ storage });

// Routes
app.get("/", (req, res) => {
    res.json("hello this is the backend");
});

// Get all books
app.get("/books", (req, res) => {
    const query = "SELECT * FROM books";
    db.query(query, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
});

// Get a specific book by id
app.get("/books/:id", (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM books WHERE id = ?";
    db.query(query, [id], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ message: "Book not found" });
        return res.status(200).json(data[0]);
    });
});

// Create a new book with image upload
app.post("/books", upload.single("cover"), (req, res) => {
    const query = "INSERT INTO books (`title`, `desc`, `price`, `cover`) VALUES (?)";
    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.file ? `//${req.file.filename}` : null, // Save file path
    ];

    db.query(query, [values], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        return res.status(201).json({ message: "Book created successfully" });
    });
});

// Update a book, including cover
app.put("/books/:id", upload.single("cover"), (req, res) => {
    const { id } = req.params;
    const { title, desc, price } = req.body;
    const cover = req.file ? `/IMG/${req.file.filename}` : req.body.cover;

    const query = `
        UPDATE books 
        SET title = ?, \`desc\` = ?, price = ?, cover = ?
        WHERE id = ?
    `;
    const values = [title, desc, price, cover, id];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Error updating book:", err);
            return res.status(500).json(err);
        }
        return res.status(200).json("Book updated successfully");
    });
});

// Delete a book
app.delete("/books/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM books WHERE id = ?";

    db.query(query, [id], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        if (data.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        return res.status(200).json({ message: "Book deleted successfully" });
    });
});

// Start the server
app.listen(3001, () => {
    console.log("Connected to backend!");
});
