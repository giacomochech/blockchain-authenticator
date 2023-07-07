import { useRef, useEffect } from "react";
import { useState } from "react";
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
     password: "pass1"
   },
   {
     username: "user2",
     password: "pass2"
   }
 ];
 
 const errors = {
   uname: "invalid username",
   pass: "invalid password"
 };
 
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
     }
   } else {
     // Username not found
     setErrorMessages({ name: "uname", message: errors.uname });
   }
 };