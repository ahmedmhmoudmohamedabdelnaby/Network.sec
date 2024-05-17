import React from "react";
import "./assets/css/NotFound.css";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="page-container">
      <h1>404 Not Found</h1>
      <div className="logout-btn">
        <Link to={"/Home"}>
          <button>Home</button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
