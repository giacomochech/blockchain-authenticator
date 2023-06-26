import React from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import { useHistory } from "react-router-dom";
import logo from "../media/logo.png";
//import logo from "../media/logo.png";

const Navigation = (props) => {
  const options = [];

  return (
    <div>
      <Navbar bg="transparent" expand="lg">
        <Container>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Navbar.Brand href="#home">
              <img
                src={logo}
                alt="logo"
                style={{ width: "50px", paddingTop: "20px" }}
              />
              <span style={{ paddingLeft: "20px" }}>
                Blockchain Authenticator
              </span>
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link style={{ width: "300px", marginTop: "-6px" }}>
                <Select
                  placeholder="Select Option"
                  //   value={options.find((obj) => obj.value === props.sensor)}
                  //   options={options}
                  //   onChange={HandleSensorChange}
                />
              </Nav.Link>
              <Link to="/collection" style={{ textDecoration: "none" }}>
                <Nav.Link href="#Collection">Your Collection</Nav.Link>
              </Link>
              <Link to="/project" style={{ textDecoration: "none" }}>
                <Nav.Link href="#Project">The Project</Nav.Link>
              </Link>
              <Link to="/Info" style={{ textDecoration: "none" }}>
                <Nav.Link href="#Info">Info</Nav.Link>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Navigation;
