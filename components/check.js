import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { ReactComponent as Logo } from "../dyflexis.svg";

const Check = () => {
  return (
    <div className="check-container">
      <div className="check-content">
        <Logo className="logo" />
          <p>If this questionnaire is not anonymous, please log in using your own email address. Otherwise, click on 'Proceed'.</p>
          <div className="button-container">
            <Link to="/login" className="back-to">back to login</Link>
            <Link to="/form/anoniem@hr.nl" className="proceed">proceed</Link>
          </div>
      </div>
    </div>
  );
};

export default Check;
