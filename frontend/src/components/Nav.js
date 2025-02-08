import React, { useEffect, useState } from "react";
import { Navbar, Nav as BootstrapNav, NavDropdown, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./nav.css";

function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // ✅ Function to get cart count from localStorage
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
  };

  // ✅ Check auth & update cart count on load
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
      setRole(localStorage.getItem("role"));
    } else {
      setIsLoggedIn(false);
      setRole(null);
    }
    updateCartCount(); // Update cart count on page load

    // ✅ Listen for cart updates across different components/tabs
    window.addEventListener("storage", updateCartCount);
    return () => {
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  // ✅ Handle Logout - Clear everything and force UI update
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("idusers");
    localStorage.removeItem("cart");

    setIsLoggedIn(false);
    setRole(null);
    setCartCount(0); // ✅ Immediately reset cart count

    navigate("/login");
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        {/* Left - Brand */}
        <Navbar.Brand href="/">BK Library</Navbar.Brand>

        {/* Center - Links */}
        <div className="navbar-nav">
          <LinkContainer to="/">
            <BootstrapNav.Link>Home</BootstrapNav.Link>
          </LinkContainer>
          <LinkContainer to="/book">
            <BootstrapNav.Link>Books</BootstrapNav.Link>
          </LinkContainer>

          {/* Admin Dashboard (Only if logged in as Admin) */}
          {role === "admin" && (
            <NavDropdown title="Admin Dashboard" id="basic-nav-dropdown">
              <LinkContainer to="/booklist">
                <NavDropdown.Item>Book List</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
          )}
        </div>

        {/* Right - Cart & Auth Options */}
        <div className="cart-container">
          <LinkContainer to="/cart">
            <BootstrapNav.Link className="cart-link">
              <FontAwesomeIcon icon={faShoppingCart} />
              <span className="cart-badge">{cartCount}</span>
            </BootstrapNav.Link>
          </LinkContainer>

          {/* Show Login/Logout Based on Authentication */}
          {isLoggedIn ? (
            <button className="auth-button logout" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <LinkContainer to="/login">
              <button className="auth-button login">Login</button>
            </LinkContainer>
          )}
        </div>
      </Container>
    </Navbar>
  );
}

export default Navigation;
