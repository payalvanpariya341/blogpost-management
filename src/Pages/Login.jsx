import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  /* ================= INPUT CHANGE ================= */
  const handleInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors = {};

    if (!loginData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!loginData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleClick = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const user = JSON.parse(localStorage.getItem("authData"));

    if (
      user &&
      loginData.email === user.email &&
      loginData.password === user.password
    ) {
      // 🔥 STORE CLEAN LOGIN DATA
      localStorage.setItem(
        "loginData",
        JSON.stringify({
          email: loginData.email,
          username: loginData.email.split("@")[0],
        })
      );

      navigate("/dashboard");
    } else {
      alert("Invalid Email or Password");
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Welcome Back</h1>

      <form onSubmit={handleClick}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={loginData.email}
            placeholder="Enter Your Email"
            onChange={handleInputChange}
          />
          {errors.email && <span className="error-msg">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={loginData.password}
            placeholder="Enter Your Password"
            onChange={handleInputChange}
          />
          {errors.password && (
            <span className="error-msg">{errors.password}</span>
          )}
        </div>

        <button type="submit" className="btn-primary">
          Login
        </button>
      </form>

      <p className="link-text">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;