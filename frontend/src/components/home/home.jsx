import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import heroImage from "../Assets/hero.png";
import "./home.css";

const Home = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:3001/books");
        setBooks(res.data.slice(3, 8)); // Get books from index 3 to 7
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <header className="hero">
        <div>
          <h1>Welcome to BK Library</h1>
          <p>Discover the best books for every reader</p>
          <Link to="/book" className="explore-btn">
            Explore Books
          </Link>
        </div>
        <img src={heroImage} alt="Hero" />
      </header>

      {/* Featured Books Section */}
      <section className="featured-books">
        <h2>Featured Books</h2>
        <div className="books-container">
          {books.map((book) => (
            <div className="book-card" key={book.id}>
              <img
                src={`http://localhost:3001${book.cover}`}
                alt={book.title}
                onError={(e) => {
                  e.target.src = "path/to/fallback/image.jpg"; // Fallback image if the cover fails to load
                }}
              />
              <h3>{book.title}</h3>
              <p>{book.desc ? `${book.desc.substring(0, 50)}...` : "No description available."}</p>
              <Link to={`/book`} className="view-btn">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;