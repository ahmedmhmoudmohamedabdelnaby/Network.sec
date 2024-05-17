import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Assuming you're using React Router for navigation
import "./assets/css/Register.css";
import { Encrypt } from "../utils/EncryptionUtil";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fName, setfName] = useState("");
  const [lName, setlName] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();

    // Regular expressions for input validation
    const nameRegex = /^[A-Za-z]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{6,20}$/;

    if (!email || !password || !fName || !lName) {
      setMessage("Fields cannot be empty!");
      return;
    }

    if (!nameRegex.test(fName) || !nameRegex.test(lName)) {
      setMessage("First name and last name should only contain letters");
      return;
    }

    if (!passwordRegex.test(password)) {
      setMessage(
        "Password must be 6-20 characters long, containing at least one uppercase letter and one number"
      );
      return;
    }

    setIsLoading(true);
    try {
      let encryptedPassword = Encrypt(password);
      const response = await axios.post(
        `http://localhost:5289/api/User/Register`,
        { email, password: encryptedPassword, fName, lName }
      );
      const { data } = response;
      setMessage(data.msg);
      if (response.status === 200) {
        window.location.href = "/";
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setMessage(error.response.data.error); // Display specific error message returned by the API
      } else {
        setMessage(
          "Error while registering user (Email Already Exists/Invalid Input in Fields)"
        ); // Generic error message
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h1>Online Library System</h1>
      <form className="register-form" onSubmit={handleRegister}>
        {message && (
          <div className="reg-error-message-container">
            <div className="reg-error-message">{message}</div>
          </div>
        )}
        <br />
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            value={fName}
            onChange={(e) => setfName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            value={lName}
            onChange={(e) => setlName(e.target.value)}
          />
        </div>
        <button className="register-btn" type="submit" disabled={isLoading}>
          {isLoading ? "Registering.." : "Register"}
        </button>
        <div className="hypertext">
          <p>
            Already signed up? <Link to="/">Login here!</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
