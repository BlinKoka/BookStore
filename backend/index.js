import express from "express";
import mysql from "mysql";
import cors from "cors";
import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";

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
app.use("/IMG", express.static("IMG"));

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "IMG");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
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
        req.file ? `//${req.file.filename}` : null,
    ];

    db.query(query, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(201).json({ message: "Book created successfully" });
    });
});

// Update a book, including cover
app.put("/books/:id", upload.single("cover"), (req, res) => {
    const { id } = req.params;
    const { title, desc, price } = req.body;
    const cover = req.file ? `/IMG/${req.file.filename}` : req.body.cover;

    const query = `UPDATE books SET title = ?, \`desc\` = ?, price = ?, cover = ? WHERE id = ?`;
    const values = [title, desc, price, cover, id];

    db.query(query, values, (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Book updated successfully");
    });
});

// Delete a book
app.delete("/books/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM books WHERE id = ?";

    db.query(query, [id], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows === 0) return res.status(404).json({ message: "Book not found" });
        return res.status(200).json({ message: "Book deleted successfully" });
    });
});

// User routes
app.get("/users", (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err) return res.status(500).send("Error getting users");
        res.send(result);
    });
});

app.post("/registerUser", (req, res) => {
    const { username, email, password } = req.body;
    const role = "user";

    db.query("SELECT * FROM users WHERE username = ?", [username], (err, result) => {
        if (err) return res.status(500).send("Error checking username");
        if (result.length > 0) return res.send("Username already taken");

        db.query("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)", [username, email, password, role], (err) => {
            if (err) return res.status(500).send("Error registering user");
            res.send("User registered successfully");
        });
    });
});

app.put("/updateUser/:idusers", (req, res) => {
    const id = req.params.idusers;
    const { email, username } = req.body;

    db.query("UPDATE users SET email = ?, username = ? WHERE idusers = ?", [email, username, id], (err, result) => {
        if (err) return res.status(500).send("Error updating user");
        if (result.affectedRows > 0) res.send("User updated successfully");
        else res.send("User not found");
    });
});

app.delete("/delete/:idusers", (req, res) => {
    const id = req.params.idusers;

    db.query("DELETE FROM users WHERE idusers = ?", [id], (err, result) => {
        if (err) return res.status(500).send("Error deleting user");
        if (result.affectedRows > 0) res.send("User deleted successfully");
        else res.send("User not found");
    });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, result) => {
        if (err) return res.status(500).send("Error logging in");
        if (result.length === 0) return res.status(401).send("Wrong username or password");

        const token = jwt.sign({ idusers: result[0].id, role: result[0].role }, "jwtkey");
        const { password, ...others } = result[0];
        res.cookie("accessToken", token, { httpOnly: false }).status(200).json({ ...others, role: result[0].role });
    });
});

// Start the server
app.listen(3001, () => {
    console.log("Connected to backend!");
});
