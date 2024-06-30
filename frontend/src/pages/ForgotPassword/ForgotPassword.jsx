// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import "./ForgotPassword.css";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleResetPassword = async (event) => {
    event.preventDefault();
    
    try {
<<<<<<< HEAD
      const response = await fetch("/send-reset-email", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
      });
      const data = await response.json();
      alert(data.message);
=======
      const response = await axios.post('https://vercel-deploy-backend.vercel.app/forgotpassword/send-reset-email', { email });
      setMessage(response.data.message);
>>>>>>> 1632af1bad4ec5db0f73999d6ab217bb7d267f0e
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="reset-container">
      <h1>Reset Your Password</h1>
      <p>
        Please enter your email address to receive a link to create a new
        password via email.
      </p>
      <form className="reset-form" onSubmit={handleResetPassword}>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
