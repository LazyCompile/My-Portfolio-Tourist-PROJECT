import React, { useState } from "react";
import axios from "axios";
import AddQuestionForm from "./FeedbackForm";
import EditQuestionForm from "./EditFeedbackForm";
import "../App.css";
import { ReactComponent as Logo } from "../dyflexis.svg";
import { Link } from "react-router-dom";

const AdminLogin = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/adminlogin", {
        email,
        password,
      });
      console.log(response.data.success);

      const isAdminLoggedIn = true;

      if (!isAdminLoggedIn) {
        console.log("Unauthorized access");
        return;
      }

      setLoggedIn(true);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.error);
      } else {
        console.log(error.message);
      }
    }
  };

  const handleLogout = () => {
    window.location.href = "http://localhost:3000/";
    setLoggedIn(false);
  };

  if (loggedIn) {
    return (
      <div className="admin-login-container">
        <Logo className="logo" />
        <div className="welcome-container">
          <h1>Welcome {email}</h1>
          <button className="login-button" onClick={handleLogout}>
            Logout
          </button>
          <Link to="/answers" className="login-button answers-button">
            View answers
          </Link>
        </div>
        <div className="form-container">
          <AddQuestionForm />
          <EditQuestionForm />
        </div>
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

export default AdminLogin;
