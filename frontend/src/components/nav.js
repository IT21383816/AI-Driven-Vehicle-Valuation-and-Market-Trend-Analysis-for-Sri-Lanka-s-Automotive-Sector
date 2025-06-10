import React from "react";
import "../App.css";
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class nav extends React.Component {
  Logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  dashboard = () => {
    if(localStorage.getItem('usertype')==='admin'){
      window.location.href = "/admin";
    }else if(localStorage.getItem('usertype')==='user'){
      window.location.href = "/user";
    }else{
      window.location.href = "/login";
    }
  };

  render() {
    
    if(localStorage.getItem('loginAccess')!=='true'){
      return(
        <Navbar className="navbar-custom" expand="lg">
          <Container>
            <Navbar.Brand href="/">LMS System</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
              </Nav>
              <Nav>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )
    }else{
        return(
          <Navbar className="navbar-custom" expand="lg">
            <Container>
              <Navbar.Brand href="/">LMS System</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                </Nav>
                <Nav>
                  <Nav.Link onClick={() => this.dashboard()} >Dashboard</Nav.Link>
                  <Nav.Link onClick={() => this.Logout()} >Logout</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        )
    }
  }
}

export default nav;
