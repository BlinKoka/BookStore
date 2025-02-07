import "./LoginSignup.css";
import Axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [registerStatus, setRegisterStatus] = useState("");
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [, setIsLoggedIn] = useState(false); // Track login state

  const navigate = useNavigate();

  // Register Function
  const register = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:3001/registerUser", {
      email: email,
      username: username,
      password: password,
    })
      .then((response) => {
        if (response.data.message) {
          setRegisterStatus(response.data.message);
        } else {
          setRegisterStatus("Account created successfully");
        }
      })
      .catch((error) => {
        console.log(error);
        setRegisterStatus("An error occurred.");
      });
  };

  // Login Function
  const login = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:3001/login", {
      username: username,
      password: password,
    }).then((response) => {
      if (response.data.message) {
        setLoginStatus(response.data.message);
      } else {
        setLoginStatus("Login was successful");
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("role", response.data.role); // Set the role in localStorage
        localStorage.setItem("idusers", response.data.idusers);
        setIsLoggedIn(true); // Update login state
        navigate("/");
      }
    });
  };

  // Toggle between Register and Login Forms
  const toggleRegisterForm = () => {
    setShowRegisterForm(!showRegisterForm);
  };

  return (
    <div className="container app__bg" id="login">
      {showRegisterForm ? (
        <div className="registerForm">
          <form onSubmit={register}>
            <h4>Register Here</h4>
            <label htmlFor="email">Email: </label>
            <input
              className="textInput"
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
              value={email || ""}
            />
            <label htmlFor="username">Username: </label>
            <input
              className="textInput"
              type="text"
              name="username"
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              value={username || ""}
            />
            <label htmlFor="password">Password: </label>
            <input
              className="textInput"
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              required
              value={password || ""}
            />
            <input
              className="button"
              type="submit"
              value="Register"
            />
            <p>
              Already have an account?{" "}
              <b>
                <button
                  type="button"
                  style={{
                    textDecoration: "none",
                    color: "white",
                    backgroundColor: "#2c6e49",
                    fontSize: "14px",
                    borderRadius: "12px"
                  }}
                  onClick={toggleRegisterForm}
                >
                  Login here
                </button>
              </b>
            </p>
            <p
              style={{ color: registerStatus.includes("taken") ? "red" : "green" }}
            >
              {registerStatus}
            </p>
          </form>
        </div>
      ) : (
        <div className="loginForm">
          <form onSubmit={login}>
            <h4>Login Here</h4>
            <label htmlFor="username">Username: </label>
            <input
              className="textInput"
              type="text"
              name="username"
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              value={username || ""}
            />
            <label htmlFor="password">Password: </label>
            <input
              className="textInput"
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              required
              value={password || ""}
            />
            <input
              className="button"
              type="submit"
              value="Login"
            />
            <p>
              Don't have an account?{" "}
              <b>
                <button
                  type="button"
                  className="ahref"
                  onClick={toggleRegisterForm}
                >
                  Register here
                </button>
              </b>
            </p>
            <p style={{ color: "red" }} className="statusMessage">
              {loginStatus}
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

export default Login;
