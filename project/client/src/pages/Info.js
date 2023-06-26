import React from "react";
import Navigation from "../components/Navigation.js";
import { Container, Alert, Row, Col } from "react-bootstrap"; //component

const Info = () => {
  return (
    <>
      <Navigation />

      <Container style={{ paddingTop: "10px" }}>
        <Row>Info</Row>
      </Container>
    </>
  );
};

export default Info;
