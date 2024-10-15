import express from "express"
import mysql from "mysql"

const app = express()

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"admin",
    database: "bookstore"
})

app.use(express.json())

app.get("/", (req,res)=>{
    res.json("hello this is the backend")
})

app.get("/books", (req,res)=>{
    const query = "SELECT * FROM books"
    db.query(query,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post("/books", (req,res)=>{
    const query = "INSERT INTO books ('title','desc','cover') VALUES (?)"
    const values = [req.body.title,
                    req.body.desc,
                    req.body.cover]

    db.query(q,[values], (err,data)=>{
        if(err) return res.json(err);
        return res.json("Book has been created successfully");
    })
})

app.listen(3000, ()=>{
    console.log("Connected to backend!")
})