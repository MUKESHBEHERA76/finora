import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../../services/authApiService";
import { useAuth } from "../../context/AuthContext";
import LogoImg from "../../assets/logo/Finora_logo.png";
import "./LogIn.css";

const bubbles = [
  { size: "small", top: "10%", left: "20%" },
  { size: "medium", top: "30%", left: "70%" },
  { size: "large", top: "60%", left: "40%" },
  { size: "small", top: "80%", left: "10%" },
  { size: "medium", top: "50%", left: "80%" },
];

const LogIn = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const res = await signIn(email, pass, "Finora");
    if (res.success) {
      login({ email: res.data.email, role: res.data.role }, res.data.token);
      navigate("/");
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="login-wrapper">
      {/* Floating glazed bubbles */}
      {bubbles.map((b, index) => (
        <div
          key={index}
          className={`bubble ${b.size}`}
          style={{ top: b.top, left: b.left }}
        ></div>
      ))}

      <div className="login-card">
        <img src={LogoImg} alt="Logo" className="login-logo" />
        <h2>Sign In</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-field">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
            <span
              className="toggle-pass"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "🙈" : "👁️"}
            </span>
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Sign In</button>
        </form>

        {/* Links: Reset Password & Sign Up */}
        <div className="login-links">
          <span
            className="reset-pass"
            onClick={() => navigate("/reset-password")}
          >
            Forgot Password?
          </span>
          <span className="signup-link">
            Don't have an account?{" "}
            <a href="/signup" onClick={() => navigate("/signup")}>
              Sign Up
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
