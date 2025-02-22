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

app.get("/books", (req, res) => {
    db.query("SELECT * FROM books", (err, data) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(data);
    });
});

// Get book by ID
app.get("/books/:id", (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM books WHERE id = ?", [id], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ message: "Book not found" });
        res.status(200).json(data[0]);
    });
});

// Add a new book
app.post("/books", upload.single("cover"), (req, res) => {
    const { title, desc, price } = req.body;
    const cover = req.file ? `/IMG/${req.file.filename}` : null;
    const query = "INSERT INTO books (title, `desc`, price, cover) VALUES (?, ?, ?, ?)";
    db.query(query, [title, desc, price, cover], (err) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: "Book added successfully" });
    });
});

// Update book
app.put("/books/:id", upload.single("cover"), (req, res) => {
    const { id } = req.params;
    const { title, desc, price } = req.body;
    const cover = req.file ? `/IMG/${req.file.filename}` : req.body.cover;
    db.query("UPDATE books SET title = ?, `desc` = ?, price = ?, cover = ? WHERE id = ?", [title, desc, price, cover, id], (err) => {
        if (err) return res.status(500).json(err);
        res.status(200).json("Book updated successfully");
    });
});

// Delete book
app.delete("/books/:id", (req, res) => {
    db.query("DELETE FROM books WHERE id = ?", [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows === 0) return res.status(404).json({ message: "Book not found" });
        res.status(200).json({ message: "Book deleted successfully" });
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

        const token = jwt.sign({ idusers: result[0].idusers, role: result[0].role }, "jwtkey");
        const { password: _, ...others } = result[0]; // Exclude password from the response
        res.cookie("accessToken", token, { httpOnly: false }).status(200).json({ ...others, token });
    });
});

app.post("/change-password", (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;

    // Verify current password
    db.query("SELECT * FROM users WHERE idusers = ? AND password = ?", [userId, currentPassword], (err, result) => {
        if (err) return res.status(500).send("Error verifying password");
        if (result.length === 0) return res.status(401).send("Current password is incorrect");

        // Update password
        db.query("UPDATE users SET password = ? WHERE idusers = ?", [newPassword, userId], (err, result) => {
            if (err) return res.status(500).send("Error updating password");
            res.send("Password updated successfully");
        });
    });
});

app.get("/cart/:userId", (req, res) => {
    db.query("SELECT cart.idcart, cart.quantity, books.id, books.title, books.price FROM cart JOIN books ON cart.book_id = books.id WHERE cart.user_id = ?", [req.params.userId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

app.post("/cart/add", (req, res) => {
    const { user_id, book_id, quantity } = req.body;
    db.query("INSERT INTO cart (user_id, book_id, quantity) VALUES (?, ?, ?)", [user_id, book_id, quantity], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Added to cart" });
    });
});


// ✅ Update cart quantity
app.put("/cart/update", (req, res) => {
    const { idcart, quantity } = req.body;
    const sql = "UPDATE cart SET quantity = ? WHERE idcart = ?";
    db.query(sql, [quantity, idcart], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Quantity updated" });
    });
});

// ✅ Remove item from cart
app.delete("/cart/remove/:idcart", (req, res) => {
    const { idcart } = req.params;
    const sql = "DELETE FROM cart WHERE idcart = ?";
    db.query(sql, [idcart], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Item removed" });
    });
});

// Clear cart on logout
app.delete("/cart/clear/:userId", (req, res) => {
    const { userId } = req.params;
    const sql = "DELETE FROM cart WHERE user_id = ?";
    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Cart cleared" });
    });
});

// Get all orders (Admin)
app.get("/orders", (req, res) => {
    const query = `
        SELECT 
            orders.idorder, 
            orders.user_id, 
            orders.total_price, 
            orders.created_at, 
            orders.status, 
            users.username, 
            users.email
        FROM 
            orders
        JOIN 
            users 
        ON 
            orders.user_id = users.idusers;
    `;

    db.query(query, (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(result);
    });
});
// Get orders by user (User Order History)
app.get("/orders/:userId", (req, res) => {
    const { userId } = req.params;
    const sql = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";
    
    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json(err);
        console.log("Orders:", result); 
        res.json(result);
    });
});

// Update order status
app.put("/orders/:orderId", async (req, res) => {
    const { orderId } = req.params;  
    const { status } = req.body;

    try {
        await db.query("UPDATE orders SET status = ? WHERE idorder = ?", [status, orderId]);
        res.json({ message: "Order status updated successfully" });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Failed to update order status" });
    }
});


app.get("/order-items/:orderId", (req, res) => {
    const orderId = req.params.orderId;
    console.log("Fetching order items for orderId:", orderId);

    if (!orderId) {
        return res.status(400).json({ error: "Invalid order ID" });
    }

    const query = `
        SELECT oi.*, b.title, b.cover AS image, b.price
        FROM order_items oi
        JOIN books b ON oi.book_id = b.id
        WHERE oi.order_id = ?`; // ✅ FIXED: Now uses the dynamic orderId

    db.query(query, [orderId], (err, results) => {
        if (err) {
            console.error("❌ Database Error:", err.sqlMessage);
            return res.status(500).json({ error: "Failed to retrieve order items" });
        }

        if (results.length === 0) {
            console.log("ℹ️ No items found for orderId:", orderId);
            return res.status(404).json({ error: "No items found for this order" });
        }

        console.log("✅ Order Items Retrieved:", results);
        res.json(results);
    });
});


app.post("/checkout", (req, res) => {
    const { user_id } = req.body;
    db.query("SELECT cart.book_id, cart.quantity, books.price FROM cart JOIN books ON cart.book_id = books.id WHERE cart.user_id = ?", [user_id], (err, cartItems) => {
        if (err) return res.status(500).json(err);
        if (cartItems.length === 0) return res.status(400).json({ message: "Cart is empty" });
        const totalPrice = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
        db.query("INSERT INTO orders (user_id, total_price) VALUES (?, ?)", [user_id, totalPrice], (err, orderResult) => {
            if (err) return res.status(500).json(err);
            const orderId = orderResult.insertId;
            const orderItems = cartItems.map(item => [orderId, item.book_id, item.quantity, item.price]);
            db.query("INSERT INTO order_items (order_id, book_id, quantity, price) VALUES ?", [orderItems], (err) => {
                if (err) return res.status(500).json(err);
                db.query("DELETE FROM cart WHERE user_id = ?", [user_id], () => res.json({ message: "Order placed successfully" }));
            });
        });
    });
});

app.get("/recommendations", (req, res) => {
    const query = `
        SELECT r.id, r.reason, b.id AS book_id, b.title, b.cover, b.desc, b.price 
        FROM recommendations r
        JOIN books b ON r.book_id = b.id
    `;

    db.query(query, (err, data) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(data);
    });
});


app.post("/recommendations", (req, res) => {
    const { book_id, reason } = req.body;

    db.query("SELECT * FROM books WHERE id = ?", [book_id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ message: "Book not found" });

        db.query("INSERT INTO recommendations (book_id, reason) VALUES (?, ?)", [book_id, reason], (err) => {
            if (err) return res.status(500).json(err);
            res.status(201).json({ message: "Recommendation added successfully" });
        });
    });
});

app.put("/recommendations/:id", (req, res) => {
    const { id } = req.params;
    const { book_id, reason } = req.body;

    console.log("Received Data:", req.body); // Debugging log

    db.query("SELECT * FROM books WHERE id = ?", [book_id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ message: "Book not found" });

        db.query("UPDATE recommendations SET book_id = ?, reason = ? WHERE id = ?", 
            [book_id, reason, id], 
            (err, updateResult) => {
                if (err) return res.status(500).json(err);
                console.log("Update Result:", updateResult); // Debugging log
                res.status(200).json({ message: "Recommendation updated successfully" });
            }
        );
    });
});
app.delete("/recommendations/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM recommendations WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json(err);
        res.status(200).json({ message: "Recommendation deleted successfully" });
    });
});
app.post("/reviews", (req, res) => {
    const { book_id, user_id, rating, comment } = req.body;

    // Validate rating
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const query = "INSERT INTO reviews (book_id, user_id, rating, comment) VALUES (?, ?, ?, ?)";
    db.query(query, [book_id, user_id, rating, comment], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: "Review added successfully", reviewId: result.insertId });
    });
});
app.get("/reviews/book/:bookId", (req, res) => {
    const { bookId } = req.params;

    const query = `
        SELECT reviews.*, users.username 
        FROM reviews 
        JOIN users ON reviews.user_id = users.idusers 
        WHERE reviews.book_id = ?
    `;

    db.query(query, [bookId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(results);
    });
});
app.put("/reviews/:reviewId", (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    // Validate rating
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const query = "UPDATE reviews SET rating = ?, comment = ? WHERE id = ?";
    db.query(query, [rating, comment, reviewId], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Review not found" });
        res.status(200).json({ message: "Review updated successfully" });
    });
});
app.delete("/reviews/:reviewId", (req, res) => {
    const { reviewId } = req.params;

    const query = "DELETE FROM reviews WHERE id = ?";
    db.query(query, [reviewId], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Review not found" });
        res.status(200).json({ message: "Review deleted successfully" });
    });
});

// Start the server
app.listen(3001, () => {
    console.log("Connected to backend!");
});
