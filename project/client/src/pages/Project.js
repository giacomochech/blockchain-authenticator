import React from "react";
import Navigation from "../components/Navigation.js";
import { Container, Alert, Row, Col } from "react-bootstrap"; //component
import SellNFT from "../components/SellNFT1.jsx";
import Card from "../components/ContractBtns.jsx";

const Project = () => {
  return (
    <>
      <Container style={{ paddingTop: "10px" }}>
        <Navigation />
        <Card />
      </Container>
    </>
  );
};

export default Project;
