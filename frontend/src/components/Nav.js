import React, { useState, useEffect } from "react";
import { Navbar, Nav as BootstrapNav, NavDropdown, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import logo from '../components/Assets/logo.PNG';
import "./nav.css";

function Navigation() {
    const [, setUsers] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState(null);
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();

    const token = localStorage.getItem("accessToken");

    // State for managing dropdown toggles
    const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    useEffect(() => {
        if (token) {
            setIsLoggedIn(true);
            setRole(localStorage.getItem("role"));
        }

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

    const toggleDropdown = (dropdownType) => {
        if (dropdownType === "admin") {
            setAdminDropdownOpen(!adminDropdownOpen);
            setUserDropdownOpen(false);
        } else if (dropdownType === "user") {
            setUserDropdownOpen(!userDropdownOpen);
            setAdminDropdownOpen(false);
        }
    };

    return (
        <Navbar  expand="lg">
            <Container fluid>
            <Navbar.Brand href="/">
                <img src={logo} alt="Brand Logo" className="navbar-logo" />
            </Navbar.Brand>

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
                        show={userDropdownOpen}
                        onClick={() => toggleDropdown("user")}
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
                    <NavDropdown
                        title="Admin Dashboard"
                        id="basic-nav-dropdown"
                        className="nav-dropdown"
                        show={adminDropdownOpen}
                        onClick={() => toggleDropdown("admin")}
                    >
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
            </Container>
        </Navbar>
    );
}

export default Navigation;
