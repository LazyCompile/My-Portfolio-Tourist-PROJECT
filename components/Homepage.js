import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Importeer het CSS-bestand
import { ReactComponent as Logo } from "../dyflexis.svg";

const Homepage = () => {
  const navigate = useNavigate();

  const handleOverviewButtonClick = () => {
    console.log("Overview button clicked");
    navigate("/Overview");
  };

  const handleLoginButtonClick = () => {
    console.log("login button clicked");
    navigate("/Login");
  };

  const handleAdminLoginButtonClick = () => {
    console.log("login button clicked");
    navigate("/admin/login");
  };


  return (
    <div className="homepage-container">
      <Logo className="logo" />
      <button className="homepage-button" onClick={handleAdminLoginButtonClick}>
        Admin login
      </button>
      <button className="homepage-button" onClick={handleLoginButtonClick}>
        Teamlid login
      </button>
      <button className="homepage-button" onClick={handleOverviewButtonClick}>
        Overview
      </button>
    </div>
  );
};

export default Homepage;
