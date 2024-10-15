import express from "express"

const app = express()

app.listen(3306, ()=>{
    console.log("Connected to backend!")
})