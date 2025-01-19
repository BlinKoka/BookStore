import React from 'react';
import { Route, Routes } from "react-router";
import Add from "./addbooks/Add";
import Books from './addbooks/Books';
import Update from './addbooks/Update';

const Pages = () =>{
    return(
        <>
        <Routes>
        <Route path="/booklist" element={<Books />} />
        <Route path="/add" element={<Add />} />
        <Route path="/update" element={<Update />} />
        </Routes>
        </>
    );
}


export default Pages