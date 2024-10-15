import express from "express"
import mysql from "mysql"

const app = express()

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"admin",
    database: "bookstore"
})

app.listen(3000, ()=>{
    console.log("Connected to backend!")
})