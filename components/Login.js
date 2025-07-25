import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { ReactComponent as Logo } from "../dyflexis.svg";

const Login = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (email === "anoniem@hr.nl") {
        navigate("/check");
        return;
      }
  
      const response = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });
      console.log(response.data.success);
      setLoggedIn(true);
      navigate(`/form/${email}`);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.error);
      } else {
        console.log(error.message);
      }
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  const toFeedbackForm = () => {
    console.log("logged in");
    navigate("/form");
    return (
      <button className="login-button" onClick={handleLogout}>
        Logout
      </button>
    );
  };

  if (loggedIn) {
    toFeedbackForm();
    return (
      <div className="login-container">
        <h1>Welcome {email}</h1>
        <button className="login-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <Logo className="logo" />
      <label className="login-label" htmlFor="email">
        Email:
      </label>
      <input
        type="email"
        id="email"
        className="login-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label className="login-label" htmlFor="password">
        Password:
      </label>
      <input
        type="password"
        id="password"
        className="login-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input type="submit" value="Login" className="login-button" />
    </form>
  );
};

export default Login;
