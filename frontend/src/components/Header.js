import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import "./Header.css";
import { useAuth } from '../context/AuthContext';

function Header() {
  const { user } = useAuth();
  const user_id = user ? user.id : null;
  const [profilePic, setProfilePic] = useState(null);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("User");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("username") // Adjust fields as necessary
      .eq("id", user_id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user data:", error);
    } else {
      console.log("Fetched user data:", data); // Debugging
      if (data) {
        setUsername(data.username);
        setProfilePic(data.profile_picture);
        setRole(data.role || "User"); // Default role if not provided
      }
    }
  };

  return (
    <div className="header-container">
      <div className="profile-section">
        <div className="profile-pic-container">
          {profilePic ? (
            <img
              src={`https://your-supabase-url.supabase.co/storage/v1/object/public/${profilePic}`}
              alt="Profile"
              className="profile-pic"
            />
          ) : (
            <div className="default-profile-pic">+</div>
          )}
        </div>
        <span className="user-info">
          {username}
          <br />
          {role}
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