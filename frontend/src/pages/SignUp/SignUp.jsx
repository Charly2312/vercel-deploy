import React, { useState } from "react";
import { Link } from "react-router-dom";
import bcrypt from "bcryptjs";
import "./SignUp.css";
import appleLogo from "../../assets/apple-logo.png";
import google from "../../assets/google-logo.png";
import facebook from "../../assets/facebook-logo.png";
import { supabase } from "../../components/supabaseClient";

const SignUp = () => {
  const [data, setData] = useState({
    username: "",
    email: "",
    password_hash: "",
    confirmPassword: "",
    dateOfBirth: "",
  });

  const handleSignUp = async (event) => {
    event.preventDefault();

    if (data.password_hash !== data.confirmPassword) {
      return alert("Passwords do not match");
    }

    const hashedPassword = await bcrypt.hash(data.password_hash, 10);

    const userData = {
      ...data,
      password_hash: hashedPassword,
    };

    delete userData.confirmPassword; // Remove confirmPassword before sending to the database

    const { error } = await supabase
      .from("users")
      .insert([userData])
      .maybeSingle();

    console.log(userData);

    if (error) {
      console.error("Error signing up:", error);
      alert("Error during sign up");
    } else {
      alert("Sign up successful!");
      resetForm();
    }
  };

  const resetForm = () => {
    setData({
      username: "",
      email: "",
      password_hash: "",
      confirmPassword: "",
      dateOfBirth: "",
    });
  };

  return (
    <div className="signup-container">
      <h2>Create an account</h2>
      <button className="social-button google">
        <img src={google} alt="Google" />
        <span>Signup with Google</span>
      </button>
      <button className="social-button facebook">
        <img src={facebook} alt="Facebook" />
        <span>Signup with Facebook</span>
      </button>
      <button className="social-button apple">
        <img src={appleLogo} alt="Apple" />
        <span>Signup with Apple</span>
      </button>
      <p className="divider">Or Sign Up With</p>
      <form className="signup-form" id="signupForm" onSubmit={handleSignUp}>
        <input
          type="text"
          id="username"
          placeholder="Enter Your Username"
          value={data.username}
          onChange={(e) => setData({ ...data, username: e.target.value })}
          required
        />
        <input
          type="email"
          id="email"
          placeholder="Enter Your Email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          required
        />
        <input
          type="password"
          id="password"
          placeholder="Enter Your Password"
          value={data.password_hash}
          onChange={(e) => setData({ ...data, password_hash: e.target.value })}
          required
        />
        <input
          type="password"
          id="confirmPassword"
          placeholder="Confirm Your Password"
          value={data.confirmPassword}
          onChange={(e) =>
            setData({ ...data, confirmPassword: e.target.value })
          }
          required
        />
        <input
          type="date"
          id="dateOfBirth"
          placeholder="Date of Birth"
          value={data.dateOfBirth}
          onChange={(e) => setData({ ...data, dateOfBirth: e.target.value })}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <br />
      <p className="ady">
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
};

export default SignUp;
