import React from "react";
import Logout from "./Logout";
import "./assets/css/PendingApproval.css";

const PendingApprovalPage = () => {
  return (
    <div className="page-container">
      <h1>Pending Approval</h1>
      <div className="logout-btn">
        <button onClick={Logout}>Log Out</button>
      </div>
    </div>
  );
};

export default PendingApprovalPage;
