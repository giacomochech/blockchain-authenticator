import React from "react";
import Navigation from "../components/Navigation.js";
import { Container, Alert, Row, Col } from "react-bootstrap"; //component
import gradingImage from "../media/grading.jpg";
import AuthForm from "../components";
import { EthProvider } from "../contexts/EthContext";
import SellNFT from "../components/SellNFT1.jsx";
import YourCollection from "../components/YourCollection.jsx";
import TransferCard from "../components/TransferCard.jsx";

const Home = () => {
  return (
    <>
      <EthProvider>
        <Navigation />

        <Container>
          <div id="Auth">
            <div className="d-flex justify-content-between">
              <SellNFT />
              <YourCollection />
            </div>
            <hr />
            <TransferCard />
          </div>
          {/* <img
            src={gradingImage}
            alt="image"
            style={{ width: "1300px", paddingTop: "50px", paddingLeft: "0px" }}
          /> */}
        </Container>
      </EthProvider>
    </>
  );
};

export default Home;
