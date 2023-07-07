import React from "react";
import Navigation from "../components/Navigation.js";
import { Container, Alert, Row, Col } from "react-bootstrap"; //component
import SellNFT from "../components/SellNFT1.jsx";

const Project = () => {
  return (
    <>
      <Container style={{ paddingTop: "10px" }}>
        <SellNFT />
      </Container>
    </>
  );
};

export default Project;
