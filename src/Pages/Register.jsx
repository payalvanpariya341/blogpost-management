import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";
    else if (formData.name.length < 3)
      newErrors.name = "Minimum 3 characters required";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(formData.phone))
      newErrors.phone = "Phone must be 10 digits";

    if (!formData.password.trim())
      newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Minimum 6 characters required";

    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = "Confirm password is required";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      localStorage.setItem("authData", JSON.stringify(formData));
      toast.success("Registration successful!");
      navigate("/login");
    }
  };

  return (
    <div className="form-container">
      <h4 className="form-title">Create Account</h4>
      <p className="subtitle">Join us and start your journey</p>

      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="form-group">
          <label>Full Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="enter your name"
          />
          {errors.name && <span className="error-msg">{errors.name}</span>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="enter your e-mail"
          />
          {errors.email && <span className="error-msg">{errors.email}</span>}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label>Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="enter your phone number"
          />
          {errors.phone && <span className="error-msg">{errors.phone}</span>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="******"
              value={formData.password}
              onChange={handleInputChange}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <MdVisibilityOff size={22} />
              ) : (
                <MdVisibility size={22} />
              )}
            </span>
          </div>
          {errors.password && (
            <span className="error-msg">{errors.password}</span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label>Confirm Password</label>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="******"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            <span
              className="eye-icon"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? (
                <MdVisibilityOff size={22} />
              ) : (
                <MdVisibility size={22} />
              )}
            </span>
          </div>
          {errors.confirmPassword && (
            <span className="error-msg">{errors.confirmPassword}</span>
          )}
        </div>

        <button type="submit" className="btn-primary">
          Register
        </button>
      </form>

      <p className="link-text">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;