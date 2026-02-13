import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../Component/Navbar";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH POSTS =================
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("loginData");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // ================= DELETE POST =================
  const handleDeletePost = async (id) => {
    try {
      await fetch(`http://localhost:3000/posts/${id}`, {
        method: "DELETE",
      });

      setPosts(posts.filter((post) => post.id !== id));
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  // ================= CURRENT USER =================
  const loginData = JSON.parse(localStorage.getItem("loginData") || "{}");
  const currentUser = loginData?.email?.split("@")[0] || "User";

  // ================= STATS =================
  const totalPosts = posts.length;
  const userPosts = posts.filter(
    (post) =>
      post.author?.toLowerCase() === currentUser.toLowerCase()
  ).length;
  const communityPosts = totalPosts - userPosts;

  return (
    <div className="dashboard-page">
      <Navbar onLogout={handleLogout} />

      <main className="dashboard-main">

        {/* Welcome */}
        <div className="dashboard-welcome">
          <div className="welcome-text">
            <h1>Welcome to Your Dashboard, {currentUser}!</h1>
            <p>
              Manage your posts and connect with your audience.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="dashboard-stats-overview">
          <div className="dash-card">
            <h3>Total Posts</h3>
            <span className="dash-number">{totalPosts}</span>
          </div>

          <div className="dash-card">
            <h3>Your Stories</h3>
            <span className="dash-number">{userPosts}</span>
          </div>

          <div className="dash-card">
            <h3>Community Posts</h3>
            <span className="dash-number">{communityPosts}</span>
          </div>
        </div>

        {/* Posts Section */}
        <section className="posts-section">
          <div className="section-header">
            <h2 className="section-title">Recent Feed</h2>

            {/* ✅ NEW POST BUTTON WORKING */}
            <button
              className="create-shortcut-btn"
              onClick={() => navigate("/create-post")}
            >
              <FaPlus /> New Post
            </button>
          </div>

          <div className="posts-grid">
            {loading ? (
              <div className="loading-state">Loading posts...</div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <div className="post-card" key={post.id}>
                  <div className="post-image-container">
                    <img
                      src={
                        post.image ||
                        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500"
                      }
                      alt={post.title}
                      className="post-card-image"
                    />

                    <div className="post-actions">

                      {/* EDIT */}
                      <button
                        className="action-btn edit-btn"
                        title="Edit Post"
                        onClick={() =>
                          navigate(`/edit-post/${post.id}`)
                        }
                      >
                        <MdEdit size={22} color="#ffffff" />
                      </button>

                      {/* DELETE */}
                      <button
                        className="action-btn delete-btn"
                        title="Delete Post"
                        onClick={() =>
                          handleDeletePost(post.id)
                        }
                      >
                        <MdDelete size={20} color="#ffffff" />
                      </button>

                    </div>
                  </div>

                  <div className="post-card-content">
                    <div className="post-meta">
                      <span className="post-author">
                        By {post.author || "Anonymous"}
                      </span>
                      <span className="post-date">
                        {post.date ||
                          new Date(
                            post.createdAt || Date.now()
                          ).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="post-card-title">
                      {post.title}
                    </h3>

                    <p className="post-card-description">
                      {post.description ||
                        post.content ||
                        post.excerpt}
                    </p>

                    <button className="read-more-btn">
                      Read More
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-posts">
                <p>No posts yet. Be the first to create one!</p>

                <button
                  className="create-shortcut-btn"
                  onClick={() => navigate("/create-post")}
                >
                  Create First Post
                </button>
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
};

export default Dashboard;