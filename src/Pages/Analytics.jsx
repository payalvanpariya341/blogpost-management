import React, { useEffect, useState } from "react";
import Navbar from "../Component/Navbar";
import "./Analytics.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const postsPerPage = 5;

  /* ================== FETCH DATA ================== */
  useEffect(() => {
    fetch("http://localhost:3000/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error(err));
  }, []);

  const authorStats = posts.reduce((acc, post) => {
    const author = post.author || "Unknown"; // ✅ FIXED
    acc[author] = (acc[author] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(authorStats).map((author) => ({
    name: author,
    posts: authorStats[author],
  }));

  /* ================== PAGINATION ================== */
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  /* ================== ACTIONS ================== */
  const handleEdit = (id) => {
    navigate(`/create-post/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    await fetch(`http://localhost:3000/posts/${id}`, {
      method: "DELETE",
    });

    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <div className="analytics-page">
      <Navbar />

      <main className="analytics-main">
        <header className="analytics-header">
          <h1>Blog Analytics</h1>
          <p>Insights into your blog's performance and activity</p>
        </header>

        {/* ================== CHARTS ================== */}
        <div className="charts-container">
          {/* BAR CHART */}
          <div className="chart-card">
            <h3>Posts per Author</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="posts" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* PIE CHART */}
          <div className="chart-card">
            <h3>Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="posts"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ================== TABLE ================== */}
        <div className="posts-table-section">
          <h3>All Posts</h3>

          <div className="table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentPosts.length > 0 ? (
                  currentPosts.map((post) => (
                    <tr key={post.id}>
                      <td>{post.id}</td>
                      <td>{post.title}</td>
                      <td>{post.author}</td> {/* ✅ FIXED */}
                      <td>
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(post.id)}
                        >
                          ✏
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(post.id)}
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No posts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ================== PAGINATION ================== */}
          <div className="pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="page-btn"
            >
              Previous
            </button>

            {[...Array(totalPages).keys()].map((number) => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className={`page-btn ${
                  currentPage === number + 1 ? "active" : ""
                }`}
              >
                {number + 1}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="page-btn"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
