import { useRef, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import useEth from "../contexts/EthContext/useEth";
import React from "react";

function CLogin() {
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  // User Login info
  const database = [
    {
      username: "user1",
      password: "pass1",
    },
    {
      username: "user2",
      password: "pass2",
    },
  ];

  const errors = {
    uname: "invalid username",
    pass: "invalid password",
  };

  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();

    var { uname, pass } = document.forms[0];

    // Find user login info
    const userData = database.find((user) => user.username === uname.value);

    // Compare user info
    if (userData) {
      if (userData.password !== pass.value) {
        // Invalid password
        setErrorMessages({ name: "pass", message: errors.pass });
      } else {
        setIsSubmitted(true);
        navigate("/project"); // Redirect to "/other-page" on successful login
      }
    } else {
      // Username not found
      setErrorMessages({ name: "uname", message: errors.uname });
    }
  };

  return (
    <div className="container">
      <div className="app-wrapper">
        <div>
          <h2 className="title">Login</h2>
        </div>
        <form className="form-wrapper">
          <div className="uname">
            <label className="label">Username</label>
            <input
              className="input"
              type="text"
              name="uname"
              placeholder="Username"
            />
            {renderErrorMessage("uname")}
          </div>
          <div className="pass">
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              name="pass"
              placeholder="Password"
            />
            {renderErrorMessage("pass")}
          </div>
          <div>
            <button className="submit" onClick={handleSubmit}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CLogin;
