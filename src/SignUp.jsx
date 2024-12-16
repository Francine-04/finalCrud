import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINT } from "./Api"; // Ensure you use the correct API_ENDPOINT if required
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function Signup() {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Log the data being sent
      const signupData = { fullname, username, password };
      console.log("Signing up with data:", signupData);

      // Send the POST request
      const response = await axios.post("https://backend-n41a.onrender.com/api/accounts/signup", signupData);

      // If successful, show success message and redirect
      setSuccess("Sign-up successful! Redirecting to login...");
      setError("");
      setTimeout(() => navigate("/login"), 2000); // Redirect to Login after 2 seconds
    } catch (error) {
      // Check if the error is from the response
      if (error.response) {
        // Log and display error message from backend
        console.error("Error response data:", error.response.data);
        setError(`Sign-up failed: ${error.response.data.message || "Please try again."}`);
      } else {
        // Log general error message
        console.error("Error message:", error.message);
        setError("Sign-up failed. Please try again.");
      }
      setSuccess("");
    }
  };

  return (
    <>
      {/* Upper Navigation Bar */}
      <Navbar className="navbar-custom">
        <Container>
          <Navbar.Brand href="#home">InstaCam</Navbar.Brand>
        </Container>
      </Navbar>

      {/* Sign-Up Form */}
      <Container className="login-container">
        <Row className="justify-content-md-center">
          <Col md={4}>
            <div className="login-form text-center">
              <h3 className="mb-4 text-light">Create an Account</h3>
              <Form onSubmit={handleSignup}>
                <Form.Group controlId="formFullname" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Full Name"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                    className="rounded-pill"
                  />
                </Form.Group>
                <Form.Group controlId="formUsername" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="rounded-pill"
                  />
                </Form.Group>
                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded-pill"
                  />
                </Form.Group>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {success && <p style={{ color: "green" }}>{success}</p>}
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 rounded-pill custom-btn"
                >
                  Sign Up
                </Button>
              </Form>
              <p className="mt-3">
                Already have an account?{" "}
                <span
                  className="text-light"
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => navigate("/login")}
                >
                  Log in
                </span>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Signup;