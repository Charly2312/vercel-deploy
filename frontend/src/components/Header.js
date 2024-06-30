import React, { useState } from "react";
import "./Header.css";

function Header() {
  const [profilePic, setProfilePic] = useState(null);

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePic(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="header-container">
      <div className="profile-section">
        <label htmlFor="profile-pic-upload" className="profile-pic-label">
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="profile-pic" />
          ) : (
            <div className="default-profile-pic">+</div>
          )}
        </label>
        <input
          type="file"
          id="profile-pic-upload"
          style={{ display: "none" }}
          onChange={handleProfilePicChange}
        />
        <span className="user-info">
          Jamie Chastain
          <br />
          Administrator
        </span>
      </div>
      <div className="search-section">
        <input
          type="search"
          className="search-bar"
          placeholder="Search tool here..."
        />
        <button className="search-button">Search</button>
      </div>
    </div>
  );
}

export default Header;
