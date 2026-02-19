import { useEffect, useState } from "react";
import { FaPlus, FaStar } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../Component/Navbar";
import "./Dashboard.css";
import "./PostDetails.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

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

  // ================= LOAD DATA =================
  useEffect(() => {
    fetchPosts();

    // Load favorites from localStorage
    const storedFavorites =
      JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // ================= DELETE POST =================
  const handleDeletePost = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/posts/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }

      setPosts((prev) => prev.filter((post) => post.id !== id));
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete post");
    }
  };

  // ================= TOGGLE FAVORITE =================
  const toggleFavorite = (id) => {
    let updatedFavorites;

    if (favorites.includes(id)) {
      updatedFavorites = favorites.filter((favId) => favId !== id);
    } else {
      updatedFavorites = [...favorites, id];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem(
      "favorites",
      JSON.stringify(updatedFavorites)
    );
  };

  const handleCreatePost = () => {
    navigate("/create-post");
  };

  // ================= USER =================
  const loginData = JSON.parse(
    localStorage.getItem("loginData") || "{}"
  );
  const currentUser = loginData?.username || "User";

  // ================= STATS =================
  const totalPosts = posts.length;

  const userPosts = posts.filter(
    (post) =>
      post.author?.toLowerCase() ===
      currentUser.toLowerCase()
  ).length;

  const communityPosts = totalPosts - userPosts;

  // ================= UI =================
  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <div className="welcome-text">
            <h1>
              Welcome to Your Dashboard, {currentUser}!
            </h1>
            <p>
              Manage your posts and connect with your audience.
            </p>
          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="dashboard-stats-overview">
          <div className="dash-card">
            <h3>Total Posts</h3>
            <span className="dash-number">
              {totalPosts}
            </span>
          </div>

          <div className="dash-card">
            <h3>Your Stories</h3>
            <span className="dash-number">
              {userPosts}
            </span>
          </div>

          <div className="dash-card">
            <h3>Community Posts</h3>
            <span className="dash-number">
              {communityPosts}
            </span>
          </div>
        </div>

        {/* ================= POSTS ================= */}
        <section className="posts-section">
          <div className="section-header">
            <h2 className="section-title">
              Recent Feed
            </h2>

            <button
              className="create-shortcut-btn"
              onClick={handleCreatePost}
            >
              <FaPlus /> New Post
            </button>
          </div>

          <div className="posts-grid">
            {loading ? (
              <div className="loading-state">
                Loading posts...
              </div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <div
                  className="post-card"
                  key={post.id}
                >
                  <div className="post-image-container">
                    <img
                      src={
                        post.image ||
                        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500"
                      }
                      alt={post.title}
                      className="post-card-image"
                    />

                    {/* ⭐ FAVORITE BUTTON */}
                    <button
                      className={`favorite-btn ${
                        favorites.includes(post.id)
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        toggleFavorite(post.id)
                      }
                    >
                      <FaStar size={22} />
                    </button>

                    {/* EDIT + DELETE */}
                    <div className="post-actions">
                      <button
                        className="action-btn edit-btn"
                        onClick={() =>
                          navigate(
                            `/create-post/${post.id}`
                          )
                        }
                      >
                        <MdEdit size={22} />
                      </button>

                      <button
                        className="action-btn delete-btn"
                        onClick={() =>
                          handleDeletePost(post.id)
                        }
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="post-card-content">
                    <div className="post-meta">
                      <span>
                        By {post.author || "Anonymous"}
                      </span>
                      <span>
                        {new Date(
                          post.createdAt ||
                            Date.now()
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="post-card-title">
                      {post.title}
                    </h3>

                    <p className="post-card-description">
                      {post.description}
                    </p>

                    <button
                      className="read-more-btn"
                      onClick={() =>
                        navigate(
                          `/post/${post.id}`
                        )
                      }
                    >
                      Read More
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-posts">
                No posts yet. Create your first
                post!
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;