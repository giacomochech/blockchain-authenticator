import React from "react";
import Navigation from "../components/Navigation.js";
import { Container, Alert, Row, Col } from "react-bootstrap"; //component
import Marketplace from "../components/Marketplace.jsx";

const Info = () => {
  return (
    <>
      <Navigation />

      <Container style={{ paddingTop: "10px" }}>
        <Row>NFTMarketplace</Row>
      <div>
        <Marketplace />
      </div>
      </Container>
    </>
  );
};

export default Info;
