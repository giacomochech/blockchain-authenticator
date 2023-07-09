import React from "react";
import Navigation from "../components/Navigation.js";
import { Container, Alert, Row, Col } from "react-bootstrap"; //component
import TransferCard from "../components/TransferCard.jsx";
import YourCollection from "../components/YourCollection.jsx";
import Card from "../components/ContractBtns.jsx";

const Project = () => {
  return (
    <>
      <Container style={{ paddingTop: "10px" }}>
        <Navigation />
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "purple" }}>
            STEP 1. Insert the data of the graded card
          </h1>
          <Card />
        </div>
        <hr />
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "purple" }}>
            STEP 2. Send the graded card to the customer account
          </h1>
          <TransferCard />
        </div>
        <hr />
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "green" }}>
            Graded cards to assign to the customer
          </h1>
          <YourCollection />
        </div>
      </Container>
    </>
  );
};


export default Project;
