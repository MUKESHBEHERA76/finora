import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_CONFIG from "../../config";
import LogoImg from "../../assets/logo/Finora_logo.png";
import "./SignUp.css";

const bubbles = [
  { size: "small", top: "15%", left: "10%" },
  { size: "medium", top: "35%", left: "75%" },
  { size: "large", top: "65%", left: "45%" },
  { size: "small", top: "80%", left: "20%" },
  { size: "medium", top: "50%", left: "85%" },
];

const SignUp = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [gender, setGender] = useState("Male");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    // FIXED: Correct email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (pass.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.SIGN_UP}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          pass,
          name,
          gender,
          application: API_CONFIG.APPLICATION_NAME,
        }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="signup-wrapper">
      {/* Floating glazed bubbles */}
      {bubbles.map((b, index) => (
        <div
          key={index}
          className={`bubble ${b.size}`}
          style={{ top: b.top, left: b.left }}
        ></div>
      ))}

      <div className="signup-card">
        <img src={LogoImg} alt="Logo" className="signup-logo" />
        <h2>Create Account</h2>

        <form onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

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
          {success && <p className="success">{success}</p>}

          <button type="submit">Sign Up</button>
        </form>

        <div className="signup-links">
          <span>
            Already have an account?{" "}
            <a href="/login" onClick={() => navigate("/login")}>
              Sign In
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
