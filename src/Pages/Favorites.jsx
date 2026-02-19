import React from "react";
import { MdOpenInNew, MdDeleteSweep } from "react-icons/md"
import { FaRegStar } from "react-icons/fa";
import "./Favorites.css";
import Navbar from "../Component/Navbar";
const Favorites = () => {
  return (
    <div className="favorites-page-container">
      <Navbar />
      <main className="favorites-main">
        <div className="favorites-hero">
          <div className="hero-shape"> </div>
          <div className="hero-content">
            <h1>Your Reading List</h1>
            <p>Enjoy the collection of stories you have curated</p>
          </div>
        </div>
        <div className="favorites-content">
          <div className="favorites-header">
            <h2>
              Curated Collection
              <span className="count-badge">3</span>
            </h2>
            <button className="clear-all-btn">
              <MdDeleteSweep size={20} />
              Clear List
            </button>
          </div>
          <div className="fav-empty-state">
            <div className="empty-icon-wrapper">
              <FaRegStar className="empty-icon" />
            </div>
            <h3>List is empty</h3>
            <p> Discover interesting post and save them to read later</p>
            <button className="browser-btn">Explore Stories</button>
          </div>
          <div className="favorites-grid">
            <div className="fav-card">
              <div className="fav-card-image">
                <img
                  src="https://avatars.mds.yandex.net/i?id=18b8b48e8403d8b35ec27183b1f0d77e369722be-4451037-images-thumbs&n=13"
                  alt="Post"
                />
                <div className="fav-card-overlay">
                  <button className="read-btn">
                    <MdOpenInNew />
                    Read Article
                  </button>
                </div>
              </div>
              <div className="fav-card-body">
                <div className="fav-meta">
                  <span className="fav-author">Author Name</span>
                  <span className="fav-date">Recent</span>
                </div>
                <h3 className="fav-title">Sample post title</h3>
                <p className="fav-excerpt">sample description</p>
                <button className="remove-fav-btn">Remove</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Favorites;
