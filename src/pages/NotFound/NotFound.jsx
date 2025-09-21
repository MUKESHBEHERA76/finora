// src/pages/NotFound.jsx
import React from "react";
import "./NotFound.css"; 

function NotFound() {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-subtitle">Oops! Page Not Found</p>
      <a href="/" className="notfound-btn">
        Go Back Home
      </a>
    </div>
  );
}

export default NotFound;