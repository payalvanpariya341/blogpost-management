import React, { useState } from "react";
import {
  FaCloudUploadAlt,
  FaHeading,
  FaLink,
  FaRegPaperPlane,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../Component/Navbar";
import "./CreatePost.css";

const CreatePost = () => {
  const navigate = useNavigate();

  /* ================= USER ================= */
  const loginData = JSON.parse(localStorage.getItem("loginData") || "{}");
  const currentUser = loginData?.email
    ? loginData.email.split("@")[0]
    : "";

  /* ================= STATE ================= */
  const [formData, setFormData] = useState({
    title: "",
    author: currentUser,
    description: "",
    image: "",
  });

  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("url");
  const [dragActive, setDragActive] = useState(false);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    let newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.image) {
      newErrors.image = "Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await fetch("http://localhost:3000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          createdAt: new Date().toISOString(),
        }),
      });

      toast.success("Post Published Successfully!");
      navigate("/dashboard");
    } catch {
      toast.error("Error creating post");
    }
  };

  /* ================= CLEAR ================= */
  const handleClear = () => {
    setFormData({
      title: "",
      author: currentUser,
      description: "",
      image: "",
    });
    setErrors({});
  };

  /* ================= FILE HANDLING ================= */
  const handleFileUpload = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }

    const imageURL = URL.createObjectURL(file);

    setFormData({
      ...formData,
      image: imageURL,
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  /* ================= UI ================= */
  return (
    <div className="create-post-page">
      <Navbar />

      <div className="create-post-container">
        <header className="form-header">
          <h1>Create a New Post</h1>
          <p>Share your thoughts with the world!</p>
        </header>

        <div className="post-form-card">
          <form onSubmit={handleSubmit}>
            
            {/* TITLE */}
            <div className="form-group">
              <label>Post Title</label>
              <div className="input-wrapper">
                <FaHeading className="input-icon" />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter an eye-catching blog title..."
                />
              </div>
              {errors.title && (
                <small className="error-text">{errors.title}</small>
              )}
            </div>

            {/* AUTHOR */}
            <div className="form-group">
              <label>Author Name</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  readOnly
                  className="form-control"
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="form-group">
              <label>Post Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                placeholder="Write your story, ideas, or thoughts here..."
              ></textarea>
              {errors.description && (
                <small className="error-text">{errors.description}</small>
              )}
            </div>

            {/* IMAGE */}
            <div className="form-group">
              <label>Post Image</label>

              <div className="image-source-tabs">
                <button
                  type="button"
                  className={`tab-btn ${activeTab === "url" ? "active" : ""}`}
                  onClick={() => setActiveTab("url")}
                >
                  Paste Image URL
                </button>

                <button
                  type="button"
                  className={`tab-btn ${activeTab === "upload" ? "active" : ""}`}
                  onClick={() => setActiveTab("upload")}
                >
                  Upload File
                </button>
              </div>

              {activeTab === "url" ? (
                <div className="input-wrapper">
                  <FaLink className="input-icon" />
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="https://example.com/your-image.jpg"
                  />
                </div>
              ) : (
                <div
                  className={`image-upload-area ${
                    dragActive ? "drag-active" : ""
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  onClick={() =>
                    document.getElementById("fileInput").click()
                  }
                >
                  <FaCloudUploadAlt className="upload-icon" />
                  <p>Drag & Drop Image Here</p>
                  <small>or click to browse</small>

                  <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                      handleFileUpload(e.target.files[0])
                    }
                  />
                </div>
              )}

              {errors.image && (
                <small className="error-text">{errors.image}</small>
              )}

              {formData.image && (
                <div className="image-preview-container">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="image-preview"
                  />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() =>
                      setFormData({ ...formData, image: "" })
                    }
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>

            {/* BUTTONS */}
            <div className="form-actions-row">
              <button type="submit" className="submit-btn">
                <FaRegPaperPlane /> Publish Post
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={handleClear}
              >
                Clear Form
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;