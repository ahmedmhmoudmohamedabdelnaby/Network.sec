import React, { useState, useEffect } from "react";
import axios from "axios";
import "./assets/css/Users.css";
import Logout from "./Logout";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import jsPDF from "jspdf";
import { Link } from "react-router-dom";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5289/api/User/GetAll",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setUsers(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(
        `http://localhost:5289/api/User/DeleteUser/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchUsers();
      setSuccessMessage("User Deleted Successfully");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleMakeLibrarian = async (userId) => {
    try {
      const token = sessionStorage.getItem("token");
      const user = users.find((user) => user.id === userId);
      if (user.roleID === 1) {
        setError("User is already a librarian.");
        return;
      }
      await axios.put(
        `http://localhost:5289/api/User/MakeLibrarian/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchUsers();
      setSuccessMessage("User successfully made a librarian.");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.put(
        `http://localhost:5289/api/User/ApproveUser/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchUsers();
      setSuccessMessage("User approved successfully.");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRejectUser = async (userId) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(
        `http://localhost:5289/api/User/DeleteUser/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchUsers();
      setSuccessMessage("User Rejected Successfully.");
    } catch (error) {
      setError(error.message);
    }
  };

  const loggedInUserID = () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.UserID;
    }
    return null;
  };

  const generateReport = () => {
    const doc = new jsPDF();
    const allUsers = users.filter(
      (user) => user.id.toString() !== loggedInUserID()
    );

    generatePage(doc, allUsers, "Users");

    doc.save("users_report.pdf");
  };

  const generatePage = (doc, userList, title) => {
    doc.setFontSize(10);
    doc.text(`Report - ${title}`, 10, 10);
    doc.text("ID", 10, 20);
    doc.text("Email", 30, 20);
    doc.text("First Name", 80, 20);
    doc.text("Last Name", 120, 20);
    doc.text("Is Approved", 160, 20);
    doc.text("Role", 190, 20);
    doc.text(`Total Number of Users: ${userList.length}`, 10, 130);
    doc.text(
      `Total Number of Approved Users: ${
        userList.filter((user) => user.isApproved).length
      }`,
      10,
      140
    );
    doc.text(
      `Total Number of Users Pending Approval: ${
        userList.filter((user) => !user.isApproved).length
      }`,
      10,
      150
    );
    doc.text(
      `Total Number of Librarians: ${
        userList.filter((user) => user.roleID.toString() === "1").length
      }`,
      10,
      160
    );
    doc.text(
      `Total Number of Normal Users: ${
        userList.filter((user) => user.roleID.toString() === "0").length
      }`,
      10,
      170
    );

    let y = 25;
    userList.forEach((user) => {
      doc.text(user.id.toString(), 10, y);
      doc.text(user.email, 30, y);
      doc.text(user.fName, 80, y);
      doc.text(user.lName, 120, y);
      doc.text(user.isApproved ? "True" : "False", 160, y);
      doc.text(user.roleID.toString() === "1" ? "Librarian" : "User", 190, y);
      y += 10;
    });
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-header">
        <div className="logo">OLS</div>
        <div className="options">
          <div className="option">
            <Link to="/Users">Users</Link>
          </div>
          <div className="option">
            <Link to="/Books">Books</Link>
          </div>
          <div className="option">
            <Link to="/Admin/UserRequests">Borrow Requests</Link>
          </div>
          <div className="option">
            <Link to="/Admin/Archive">Archive</Link>
          </div>
          <div className="option" onClick={Logout}>
            Logout
          </div>
        </div>
      </div>
      <button className="normal-btn" onClick={generateReport}>
        Generate User Report
      </button>
      <div className="admin-dashboard-content">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : users.length === 0 ? (
          <div className="no-users-container">
            <p>No Users Available</p>
          </div>
        ) : (
          <div>
            {successMessage && (
              <div className="success-message-container">
                <p className="success-message">{successMessage}</p>
              </div>
            )}
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Is Approved</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((user) => user.id.toString() !== loggedInUserID()) // Exclude logged-in user
                  .map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.email}</td>
                      <td>{user.fName}</td>
                      <td>{user.lName}</td>
                      <td>{user.isApproved ? "True" : "False"}</td>
                      <td>{user.roleID === 1 ? "Librarian" : "User"}</td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </button>
                        {user.roleID !== 1 && (
                          <button
                            className="normal-btn"
                            onClick={() => handleMakeLibrarian(user.id)}
                          >
                            Make Librarian
                          </button>
                        )}
                        {!user.isApproved && (
                          <button
                            className="normal-btn"
                            onClick={() => handleApproveUser(user.id)}
                          >
                            Approve
                          </button>
                        )}
                        {!user.isApproved && (
                          <button
                            className="delete-btn"
                            onClick={() => handleRejectUser(user.id)}
                          >
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
