import React from "react";
import { Navbar, Nav as BootstrapNav, NavDropdown, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import "./nav.css";

function Navigation() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">BK Library</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <BootstrapNav className="me-auto">
            <LinkContainer to="/">
              <BootstrapNav.Link>Home</BootstrapNav.Link>
            </LinkContainer>
            <LinkContainer to="./book">
              <BootstrapNav.Link>Books</BootstrapNav.Link>
            </LinkContainer>
            <LinkContainer to="./cart">
              <BootstrapNav.Link className="cart-link">
                <FontAwesomeIcon icon={faShoppingCart} />
                <span className="cart-badge">0</span>
              </BootstrapNav.Link>
            </LinkContainer>
            <NavDropdown title="Admin Dashboard" id="basic-nav-dropdown">
              <LinkContainer to="/booklist">
                <NavDropdown.Item>Book List</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
          </BootstrapNav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
