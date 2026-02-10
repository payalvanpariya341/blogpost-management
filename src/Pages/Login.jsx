import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./Login.css";
import { BrowserRouter } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // logic section
  const handleInputChange = (e) => {
    //method declare
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // validation
  const validate = () => {
    const newErrors = {};

    if (!loginData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^s@]+\.[^\s@]+$/.test(loginData.email)) {
      newErrors.email = "Invalid Email format.";
    }

    if (!loginData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (loginData.password.length < 6) {
      newErrors.password = "Minimum 6 character required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // submit
  const handleClick = (e) => {
    e.preventDefault();
    if (validate()) {
      const user = JSON.parse(localStorage.getItem("authData"));
      if (
        user &&
        loginData.email === user.email &&
        loginData.password === user.password
      ) {
        localStorage.setItem("loginData", JSON.stringify(loginData));
        navigate("/dashboard");
      } else {
        alert("Invalid Email or Password");
      }
    } else {
      alert("Something went wrong");
    }
  };

  return (
    <div className="form-container">
      {/* Page Title */}
      <h1 className="form-title">Welcome Back</h1>

      {/* Login Form */}
      <form onSubmit={handleClick}>
        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={loginData.email}
            placeholder="Enter Your Email"
            onChange={handleInputChange}
          />
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={loginData.password}
            placeholder="Enter Your Password"
            onChange={handleInputChange}
          />
          {errors.password && (
            <span className="error-msg">{errors.password}</span>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn-primary">
          Login
        </button>
      </form>

      {/* Link to Register Page */}
      <p className="link-text">
        Dont't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;