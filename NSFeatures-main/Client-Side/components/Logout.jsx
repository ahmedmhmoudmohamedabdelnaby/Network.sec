import axios from "axios";
import Cookies from "js-cookie";

const Logout = async () => {
  try {
    const token = sessionStorage.getItem("token");
    await axios.post(
      "http://localhost:5289/api/User/Logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    // Clear cookies
    Cookies.remove("sessionId");
    // Clear sessionStorage
    sessionStorage.removeItem("token");
    // Redirect to login page
    window.location.href = "/";
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export default Logout;
