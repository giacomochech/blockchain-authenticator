import React from "react";
import Navigation from "../components/Navigation.js";
import { Container, Alert, Row, Col } from "react-bootstrap"; //component
import Search from "../components/Home.jsx";

const Collection = () => {
  return (
    <>
      <Navigation />

      <Container style={{ paddingTop: "10px" }}>
        {/* <Row>Collection</Row> */}
        <Search />
      </Container>
    </>
  );
};

export default Collection;
