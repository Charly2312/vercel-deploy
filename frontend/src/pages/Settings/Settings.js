import React, { useState, useEffect } from "react";
import { supabase } from "../../components/supabaseClient";
import Sidebar from "../../components/Sidebar";
import "./Settings.css";

function Settings() {
  const user_id = 10; // Replace with the actual user ID
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    pfp: "",
    first_name: "",
    last_name: "",
    bio: "",
  });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user_id)
      .single();
    if (error) {
      console.error("Error fetching user data:", error);
    } else {
      setUserData(data);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await uploadProfilePicture(file);
    }
  };

  const uploadProfilePicture = async (file) => {
    const fileName = `${user_id}-${file.name}`;
    console.log(`Uploading file: ${fileName}`);
    const { data, error } = await supabase.storage
      .from("profile-pics")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Error uploading profile picture:", error);
    } else {
      console.log("File uploaded successfully:", data);
      const filePath = data.path;
      await updateProfilePicture(filePath);
    }
  };

  const updateProfilePicture = async (filePath) => {
    console.log(`Updating profile picture path in database: ${filePath}`);
    const { data, error } = await supabase
      .from("users")
      .update({ pfp: filePath })
      .eq("id", user_id);

    if (error) {
      console.error("Error updating profile picture:", error);
    } else {
      console.log("Profile picture updated successfully in database:", data);
      setUserData((prevData) => ({
        ...prevData,
        pfp: filePath,
      }));
      fetchUserData(); // Refresh user data to confirm the update
    }
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();

    const updates = {
      username: userData.username,
      first_name: userData.first_name,
      last_name: userData.last_name,
      bio: userData.bio,
    };

    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user_id);

    if (error) {
      console.error("Error updating user data:", error);
    } else {
      console.log("User details updated successfully:", data);
      alert("User details updated successfully");
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    // Check if old password is correct before updating
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("password")
      .eq("id", user_id)
      .single();

    if (fetchError) {
      console.error("Error fetching user data:", fetchError);
      alert("Failed to validate old password.");
      return;
    }

    if (user.password !== oldPassword) {
      alert("Old password is incorrect.");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    const updates = {
      password: newPassword,
    };

    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user_id);

    if (error) {
      console.error("Error updating user data:", error);
    } else {
      console.log("Password updated successfully:", data);
      alert("Password updated successfully");
    }
  };

  return (
    <div className="settings-page">
      <Sidebar />
      <div className="settings-container">
        <h2>Account Settings</h2>
        <form onSubmit={handleUpdateDetails}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={userData.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={userData.first_name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={userData.last_name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={userData.bio}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="pfp">Profile Picture</label>
            <input
              type="file"
              id="pfp"
              name="pfp"
              accept="image/*"
              onChange={handleFileChange}
            />
            {userData.pfp && (
              <img
                src={
                  supabase.storage
                    .from("profile-pics")
                    .getPublicUrl(userData.pfp).publicURL
                }
                alt="Profile"
                className="profile-picture"
              />
            )}
          </div>
          <button type="submit">Update Settings</button>
        </form>
        <form onSubmit={handleUpdatePassword}>
          <h3>Change Password</h3>
          <div className="form-group">
            <label htmlFor="old_password">Old Password</label>
            <input
              type="password"
              id="old_password"
              name="old_password"
              value={oldPassword}
              onChange={handleOldPasswordChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="new_password">New Password</label>
            <input
              type="password"
              id="new_password"
              name="new_password"
              value={newPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm_password">Confirm New Password</label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </div>
          <button type="submit">Change Password</button>
        </form>
      </div>
    </div>
  );
}

export default Settings;
