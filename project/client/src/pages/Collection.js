import React from "react";
import Navigation from "../components/Navigation.js";
import { Container, Alert, Row, Col } from "react-bootstrap"; //component

const Collection = () => {
  return (
    <>
      <Navigation />

      <Container style={{ paddingTop: "10px" }}>
        <Row>Collection</Row>
      </Container>
    </>
  );
};

export default Collection;