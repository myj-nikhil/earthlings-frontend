import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [PlaceholderVisible, setPlaceholderVisible] = useState(true);
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleEmailBlur = () => {
    if (email === "") {
      setPlaceholderVisible(true);
    }
  };

  const handlePasswordBlur = () => {
    if (password === "") {
      setPlaceholderVisible(true);
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  function authenticate() {
    const url = "http://127.0.0.1:3001/login";
    const postData = { email, password };
    axios
      .post(url, postData)
      .then((response) => {
        localStorage.setItem("token",response.data.token);
        setEmail("");
        setPassword("");
        setPlaceholderVisible(true);
        alert("Loggedin successfully");
        navigate("/");  
        }
      )
      .catch((error) => {
        setEmail("");
        setPassword("");
        setPlaceholderVisible(true);
        alert(error.response.data);
      });
  }
  return (
    <>
      <div id="inputs">
        <div className="datainput">
          <input
            type="email"
            name="email"
            id="email"
            onBlur={handleEmailBlur}
            onChange={handleEmailChange}
            value={email}
            className="datainput-el"
            placeholder={PlaceholderVisible ? "E-mail" : ""}
          />
        </div>
        <div className="datainput">
          <input
            type="password"
            name="password"
            id="password"
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            value={password}
            className="datainput-el"
            placeholder={PlaceholderVisible ? "Password" : ""}
          />
        </div>

        <button type="submit" id="submit-btn" onClick={authenticate}>
          Submit
        </button>
      </div>
    </>
  );
}

export default Login;
