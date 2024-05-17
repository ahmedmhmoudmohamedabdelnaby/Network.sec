import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./assets/css/Login.css";
import { jwtDecode } from "jwt-decode";
import { Encrypt } from "../utils/EncryptionUtil";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    if (!email || !password) {
      setMessage("Fields cannot be empty!");
      return;
    }

    setIsLoading(true);
    try {
      let encryptedPassword = Encrypt(password);
      const response = await axios.post(
        `http://localhost:5289/api/User/Login`,
        { email, password: encryptedPassword }
      );
      const { data } = response;
      setMessage(data.msg);

      // Set expiration time for 10 minutes from now
      const expirationTime = new Date(Date.now() + 10 * 60 * 1000);

      document.cookie = `sessionId=${
        data.sessionId
      }; expires=${expirationTime.toUTCString()}; path=/;`;

      sessionStorage.setItem("token", data.token);
      const decodedToken = jwtDecode(data.token);
      if (decodedToken.IsApproved === "true" && decodedToken.RoleID === "1") {
        window.location.href = "/Users";
      } else if (
        decodedToken.IsApproved === "true" &&
        decodedToken.RoleID === "0"
      ) {
        window.location.href = "/Home";
      } else if (decodedToken.IsApproved === "false") {
        window.location.href = "/PendingApproval";
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage("Invalid Credentials");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Online Library System</h1>
      <form className="login-form" onSubmit={handleLogin}>
        {message && (
          <div className="login-error-message-container">
            <div className="login-error-message">{message}</div>
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
        <button className="login-btn" type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
        <div className="hypertext">
          <p>
            New Here? <Link to="/register">Sign Up now!</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
