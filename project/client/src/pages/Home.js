import React from "react";
import Navigation from "../components/Navigation.js";
import { Container, Alert, Row, Col } from "react-bootstrap"; //component
import gradingImage from "../media/grading.jpg";

const Home = () => {
  return (
    <>
      <Navigation />

      <Container style={{ paddingTop: "10px" }}>
        <Row>Home</Row>
        <img
          src={gradingImage}
          alt="image"
          style={{ width: "1300px", paddingTop: "50px", paddingLeft: "0px" }}
        />
      </Container>
    </>
  );
};

export default Home;
