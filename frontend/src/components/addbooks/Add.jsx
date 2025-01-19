import React from 'react'
import axios from 'axios';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Add = () => {
    const [book,setBook] = useState({
        title: "",
        desc:"",
        price:null,
        cover:"",
    });

    const navigate = useNavigate();

    const handleChange = (e) =>{
        setBook(prev=>({...prev, [e.target.name]: e.target.value}));
    };

    const handleClick = e =>{
        e.preventDefault();
        try{
            axios.post("http://localhost:3001/books", book);
            navigate("/");
        }catch(err){
            console.log(err);
        }
    }

    console.log(book);
  return (
    <div className='form'>
        <h1>Add New Book</h1>
        <input type="text" placeholder="title" onChange={handleChange} name='title'/>
        <input type="text" placeholder="desc" onChange={handleChange} name='desc'/>
        <input type="number" placeholder="price"onChange={handleChange} name='price' />
        <input type="text" placeholder="cover" onChange={handleChange} name='cover'/>
        <button onClick={handleClick}>Add</button>
    </div>
  )
}

export default Add