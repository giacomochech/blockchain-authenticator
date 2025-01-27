import React from "react";
import Navigation from "../components/Navigation.js";
import { Container, Alert, Row, Col } from "react-bootstrap"; //component
import Login from "../components/Login.jsx";

const Info = () => {
  return (
    <>
      <Navigation />

      <Container style={{ paddingTop: "100px" }}>
        <div>
          <Login />
        </div>
      </Container>
    </>
  );
};

export default Info;
