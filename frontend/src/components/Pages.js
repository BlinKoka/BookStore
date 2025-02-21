import React from 'react';
import { Route, Routes } from "react-router";
import Home from './home/home';
import Add from "./addbooks/Add";
import Books from './addbooks/Books';
import Update from './addbooks/Update';
import Book from './addbooks/book'; 
import Cart from './cart/cart';
import Login from './loginsignup/LoginSignup';
import Userlist from './users/userlist';
import Checkout from "./Checkout";
import OrderHistory from './order/OrderHistory';
import OrderDetails from './order/OrderDetails';
import ChangePassword from './users/ChangePassword';
import OrderList from './order/OrderList';
import AddRecommendation from './Recommended/addrecommended';
import RecommendationList from './Recommended/RecommendationList';
import UpdateRecommendation from './Recommended/updaterecommendation';

const Pages = () => {
    const userId = 1;

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<Book />} /> 
            <Route path="/booklist" element={<Books />} />
            <Route path="/userlist" element={<Userlist />} />
            <Route path="/add" element={<Add />} />
            <Route path="/update/:id" element={<Update />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-history" element={<OrderHistory userId={userId} />} />
            <Route path="/order-items/:orderId" element={<OrderDetails />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/add-recommendation" element={<AddRecommendation />} />
            <Route path="/recommendations" element={<RecommendationList />} />
            <Route path="/update-recommendation/:id" element={<UpdateRecommendation />} />
        </Routes>
    );
}

export default Pages;
