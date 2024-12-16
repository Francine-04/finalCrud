// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Container from "react-bootstrap/Container";
// import Navbar from "react-bootstrap/Navbar";
// import Form from "react-bootstrap/Form";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
// import Button from "react-bootstrap/Button";
// import { API_ENDPOINT } from "./Api";
// import "./InstagramClone.css";

// function Login() {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     // Auto-login: FAST LOG IN
//     const checkSession = () => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         try {
//           const parsedToken = JSON.parse(token);
//           if (parsedToken) {
//             navigate("/dashboard");
//           }
//         } catch (e) {
//           console.error("Error parsing token:", e);
//           localStorage.removeItem("token");
//         }
//       }
//     };
//     checkSession();
//   }, [navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${API_ENDPOINT}/accounts/login`, {
//         username,
//         password,
//       });

//       // TO SAVE THE TOKEN AND TO NAVIGATE TO DASHBOARD
//       localStorage.setItem("token", JSON.stringify(response));
//       setError("");
//       navigate("/dashboard");
//     } catch (error) {
//       setError("Invalid username or password");
//       console.error(error);
//     }
//   };

//   return (
//     <>
//       {/* Navbar */}
//       <Navbar className="navbar-custom">
//         <Container>
//           <Navbar.Brand href="#home">InstaCam</Navbar.Brand>
//         </Container>
//       </Navbar>

//       {/* Login Form */}
//       <Container className="login-container">
//         <Row className="justify-content-md-center">
//           <Col md={4}>
//             <div className="login-form text-center">
//               <h3 className="mb-4 text-light">InstaCamBack!</h3>
//               <Form onSubmit={handleSubmit}>
//                 <Form.Group controlId="formUsername" className="mb-3">
//                   <Form.Control
//                     type="text"
//                     placeholder="Username"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     required
//                     className="rounded-pill"
//                   />
//                 </Form.Group>
//                 <Form.Group controlId="formPassword" className="mb-3">
//                   <Form.Control
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     className="rounded-pill"
//                   />
//                 </Form.Group>
//                 {error && <p style={{ color: "red" }}>{error}</p>}
//                 <Button
//                   variant="primary"
//                   type="submit"
//                   className="w-100 rounded-pill custom-btn"
//                 >
//                   Log In
//                 </Button>
//               </Form>
//               <p className="mt-3">
//                 Don't have an account?{" "}
//                 <a
//                   href="#signup"
//                   className="text-light"
//                   onClick={() => navigate("/signup")}
//                 >
//                   Sign up
//                 </a>
//               </p>
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </>
//   );
// }

// export default Login;



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { API_ENDPOINT } from "./Api";
import "./InstagramClone.css";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Auto-login: FAST LOG IN
    const checkSession = () => {
      const token = localStorage.getItem("token");
      if (token) {
        // If the token exists, navigate to dashboard 
        navigate("/dashboard");
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_ENDPOINT}/accounts/login`, {
        username,
        password,
      });
  
      // Adapt to actual backend response
      const token = response?.data?.data?.token || response?.data?.token;
  
      if (!token) {
        throw new Error("Token not provided in the response.");
      }
  
      localStorage.setItem("token", token); // Save token for future authentication
      setError("");
      navigate("/dashboard");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Invalid username or password";
      setError(errorMsg); // Show the backend-provided message or a fallback
      console.error("Login error:", error.response || error.message);
    }
  };
  

  return (
    <>
      {/* Navbar */}
      <Navbar className="navbar-custom">
        <Container>
          <Navbar.Brand href="#home">InstaCam</Navbar.Brand>
        </Container>
      </Navbar>

      {/* Login Form */}
      <Container className="login-container">
        <Row className="justify-content-md-center">
          <Col md={4}>
            <div className="login-form text-center">
              <h3 className="mb-4 text-light">InstaCamBack!</h3>
              <Form onSubmit={handleSubmit}>
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
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 rounded-pill custom-btn"
                >
                  Log In
                </Button>
              </Form>
              <p className="mt-3">
                Don't have an account?{" "}
                <a
                  href="#signup"
                  className="text-light"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </a>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Login;