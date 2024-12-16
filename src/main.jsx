// import { StrictMode } from 'react';  
// import { createRoot } from 'react-dom/client';  

// import App from './App.jsx';  

// import 'bootstrap/dist/css/bootstrap.min.css';  
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';  

// createRoot(document.getElementById('root')).render(  
//   <StrictMode>  
//     <App />  
//   </StrictMode>,  
// );  

import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

// Bootstrap CSS and JS imports
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const rootElement = document.getElementById("root");

// Check if rootElement exists
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
