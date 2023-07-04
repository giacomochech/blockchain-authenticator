import React from "react";
import Navigation from "../components/Navigation.js";
import { Container, Alert, Row, Col } from "react-bootstrap"; //component
import gradingImage from "../media/grading.jpg";
import AuthForm from "../components";
import { EthProvider } from "../contexts/EthContext";

const Home = () => {
  return (
    <>
      <EthProvider>
        <Navigation />

        <Container style={{ paddingTop: "10px" }}>
          <div id="Auth">
            <div className="container">
              <AuthForm />
              <hr />
            </div>
          </div>
          <img
            src={gradingImage}
            alt="image"
            style={{ width: "1300px", paddingTop: "50px", paddingLeft: "0px" }}
          />
        </Container>
      </EthProvider>
    </>
  );
};

export default Home;
