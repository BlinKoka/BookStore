import React from 'react';
import { Route, Routes } from "react-router";
import Home from './home/home';
import Add from "./addbooks/Add";
import Books from './addbooks/Books';
import Update from './addbooks/Update';
import Book from './addbooks/book'; 
import Cart from './cart/cart';
import Login from './loginsignup/LoginSignup';

const Pages = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<Book />} /> 
            <Route path="/booklist" element={<Books />} />
            <Route path="/add" element={<Add />} />
            <Route path="/update/:id" element={<Update />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default Pages;
