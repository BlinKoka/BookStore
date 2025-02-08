import React, { useEffect, useState } from "react";
import { Navbar, Nav as BootstrapNav, NavDropdown, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext"; // ✅ Import Cart Context
import "./nav.css";

function Navigation() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState(null);
    const { cartItems, clearCart } = useCart(); // ✅ Use cart context
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setIsLoggedIn(true);
            setRole(localStorage.getItem("role"));
        } else {
            setIsLoggedIn(false);
            setRole(null);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        localStorage.removeItem("idusers");

        clearCart(); // ✅ Clear cart from both state & localStorage
        setIsLoggedIn(false);
        setRole(null);
        navigate("/login");
    };

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/">BK Library</Navbar.Brand>

                <div className="navbar-nav">
                    <LinkContainer to="/">
                        <BootstrapNav.Link>Home</BootstrapNav.Link>
                    </LinkContainer>
                    <LinkContainer to="/book">
                        <BootstrapNav.Link>Books</BootstrapNav.Link>
                    </LinkContainer>

                    {role === "admin" && (
                        <NavDropdown title="Admin Dashboard" id="basic-nav-dropdown" className="nav-dropdown">
                            <LinkContainer to="/booklist">
                                <NavDropdown.Item className="no-text-decoration">Book List</NavDropdown.Item>
                            </LinkContainer>
                        </NavDropdown>
                    )}
                </div>

                <div className="cart-container">
                    <LinkContainer to="/cart">
                        <BootstrapNav.Link className="cart-link">
                            <FontAwesomeIcon icon={faShoppingCart} />
                            <span className="cart-badge">{cartItems.length}</span>
                        </BootstrapNav.Link>
                    </LinkContainer>

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
