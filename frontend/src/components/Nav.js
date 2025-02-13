import React, { useEffect, useState } from "react";
import { Navbar, Nav as BootstrapNav, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import "./nav.css";

function Navigation() {
    const [,setUsers] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState(null);
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();

    // Extract the token into a variable
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        console.log("Token from localStorage:", token);
        console.log("Username from localStorage:", localStorage.getItem("username"));
        console.log("Role from localStorage:", localStorage.getItem("role"));

        if (!token) {
            navigate("/login"); // Redirect to login if no token is found
            return;
        }

        setIsLoggedIn(true);
        setRole(localStorage.getItem("role"));

        const userData = {
            username: localStorage.getItem("username"),
            idusers: localStorage.getItem("idusers"),
            role: localStorage.getItem("role"),
        };
        setUsers(userData);
    }, [token, navigate]);

    const handleLogout = () => {
        try {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("role");
            localStorage.removeItem("idusers");
            localStorage.removeItem("username");

            clearCart();
            setIsLoggedIn(false);
            setRole(null);
            setUsers({});
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/">BK Library</Navbar.Brand>

            <div className="navbar-nav">
                <LinkContainer to="/">
                    <BootstrapNav.Link>Home</BootstrapNav.Link>
                </LinkContainer>
                <LinkContainer to="/book">
                    <BootstrapNav.Link>Books</BootstrapNav.Link>
                </LinkContainer>

                {role === "user" && (
                    <NavDropdown
                        title={`Welcome, User`}
                        id="user-dropdown"
                        className="nav-dropdown"
                        aria-label="User Menu"
                        aria-expanded={false}
                    >
                        <LinkContainer to="/order-history">
                            <NavDropdown.Item>Order History</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/change-password">
                            <NavDropdown.Item>Change Password</NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                    </NavDropdown>
                )}

                {role === "admin" && (
                    <NavDropdown title="Admin Dashboard" id="basic-nav-dropdown" className="nav-dropdown">
                        <LinkContainer to="/booklist">
                            <NavDropdown.Item className="no-text-decoration">Book List</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/userlist">
                            <NavDropdown.Item className="no-text-decoration">User List</NavDropdown.Item>
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
        </Navbar>
    );
}

export default Navigation;