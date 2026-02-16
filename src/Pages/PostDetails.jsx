import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Component/Navbar";
import "./PostDetails.css";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [post, setPost] = useState(null);

  // FETCH POST DATA
  useEffect(() => {
    fetch(`http://localhost:3000/posts/${id}`)
      .then((res) => res.json())
      .then((data) => setPost(data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!post) return <h3>Loading...</h3>;

  return (
    <div className="post-deatails-page">
      <Navbar />

      <main className="post-details-container">
        {/* BACK BUTTON */}
        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          <FaArrowLeft /> Back to Feed
        </button>

        <article className="full-post">
          <header className="post-header">
            <div className="post-category">
              {post.category || "Journal"}
            </div>

            <h1 className="post-full-title">
              {post.title}
            </h1>

            <div className="post-author-meta">
              <div className="author-info">
                <div className="author-avatar">
                  {post.author?.charAt(0)}
                </div>

                <div>
                  <span className="author-name">
                    {post.author}
                  </span>

                  <div className="post-date-row">
                    <span>{post.date}</span>
                    <span className="dot"></span>
                    <span>5 min read</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* IMAGE */}
          <div className="post-feature-image">
            <img src={post.image} alt="Post" />
          </div>

          {/* BODY */}
          <div className="post-body">
            <p>{post.description}</p>
          </div>
        </article>
      </main>
    </div>
  );
};

export default PostDetails;