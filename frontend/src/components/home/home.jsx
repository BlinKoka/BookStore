import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./home.css";

const Home = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:3001/books");
        setBooks(res.data.slice(3, 8)); 
      } catch (err) {
        console.log(err);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <header className="hero">
        <h1>Welcome to BK Library</h1>
        <p>Discover the best books for every reader</p>
        <Link to="/book" className="explore-btn">Explore Books</Link>
      </header>

      {/* Featured Books Section */}
      <section className="featured-books">
        <h2>Featured Books</h2>
        <div className="books-container">
          {books.map((book) => (
            <div className="book-card" key={book.id}>
              <img src={`http://localhost:3001${book.cover}`} alt={book.title} />
              <h3>{book.title}</h3>
              <p>{book.desc.substring(0, 50)}...</p>
              <Link to={`/book`} className="view-btn">View Details</Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
