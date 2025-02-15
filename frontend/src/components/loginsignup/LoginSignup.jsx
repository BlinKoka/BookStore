import "./LoginSignup.css";
import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [registerStatus, setRegisterStatus] = useState("");
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [, setIsLoggedIn] = useState(false);
  const [welcomeText, setWelcomeText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();
  const welcomeMessage = "Welcome to BK Library!";

  // Animate welcome text
  useEffect(() => {
    if (currentIndex < welcomeMessage.length) {
      const timeout = setTimeout(() => {
        setWelcomeText((prev) => prev + welcomeMessage[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, welcomeMessage]);

  // Register Function
  const register = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:3001/registerUser", {
      email: email,
      username: username,
      password: password,
    })
      .then((response) => {
        setRegisterStatus(response.data.message || "Account created successfully");
      })
      .catch(() => setRegisterStatus("An error occurred."));
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
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("idusers", response.data.idusers);
        setIsLoggedIn(true);
        navigate("/");
      }
    });
  };

  return (
    <div className="container">
      {/* Left Side: Welcome Text */}
      <div className="welcome-container">
        <div className="static-welcome-message">
          <div className="welcome-text">
            <h1>{welcomeText}</h1>
          </div>
          <h2>Welcome to BK Library – Your Gateway to Infinite Knowledge!</h2>
          <p>Dive into a world of endless stories, timeless classics, and cutting-edge insights.</p>
          <p>📚 <strong>Discover</strong> a vast collection of eBooks across genres.</p>
          <p>🌟 <strong>Explore</strong> new worlds, ideas, and perspectives.</p>
          <p>💡 <strong>Learn</strong> something new every day.</p>
        </div>
      </div>

      {/* Right Side: Login/Register Form */}
      <div className="form-container">
        {showRegisterForm ? (
          <div className="registerForm">
            <form onSubmit={register}>
              <h4>Register Here</h4>
              <input type="email" name="email" placeholder="Enter email" required value={email} onChange={(e) => setEmail(e.target.value)} className="textInput" />
              <input type="text" name="username" placeholder="Enter username" required value={username} onChange={(e) => setUsername(e.target.value)} className="textInput" />
              <input type="password" name="password" placeholder="Enter password" required value={password} onChange={(e) => setPassword(e.target.value)} className="textInput" />
              <input type="submit" value="Register" className="button" />
              <p>Already have an account? <button type="button" className="switch-btn" onClick={() => setShowRegisterForm(false)}>Login here</button></p>
              <p className="statusMessage">{registerStatus}</p>
            </form>
          </div>
        ) : (
          <div className="loginForm">
            <form onSubmit={login}>
              <h4>Login Here</h4>
              <input type="text" name="username" placeholder="Enter username" required value={username} onChange={(e) => setUsername(e.target.value)} className="textInput" />
              <input type="password" name="password" placeholder="Enter password" required value={password} onChange={(e) => setPassword(e.target.value)} className="textInput" />
              <input type="submit" value="Login" className="button" />
              <p>Don't have an account? <button type="button" className="switch-btn" onClick={() => setShowRegisterForm(true)}>Register here</button></p>
              <p className="statusMessage">{loginStatus}</p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
