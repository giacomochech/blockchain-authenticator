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
    <div
      className="flex justify-center items-center h-screen bg-gray-100"
      style={{ alignItems: "center", paddingLeft: "20rem" }}
    >
      <div className="w-50 h-55 bg-white rounded-full flex justify-center items-center shadow-lg">
        <div className="max-w-md w-full p-8">
          <h2 className="text-2xl text-center font-bold mb-8">Login</h2>
          <form>
            <div className="mb-6 text-center">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="uname"
              >
                Username
              </label>
              <div className="flex justify-end" style={{ paddingLeft: "1rem" }}>
                <input
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  id="uname"
                  name="uname"
                  placeholder="Username"
                />
                {renderErrorMessage("uname")}
              </div>
            </div>
            <div className="mb-6 text-center" style={{ marginTop: "1rem" }}>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="pass"
              >
                Password
              </label>
              <div className="flex justify-end" style={{ paddingLeft: "1rem" }}>
                <input
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="password"
                  id="pass"
                  name="pass"
                  placeholder="Password"
                />
                {renderErrorMessage("pass")}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              <button
                className="bg-purple-500 hover:bg-purple-700 text-black font-bold py-2 px-4 rounded w-full text-center"
                onClick={handleSubmit}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CLogin;
