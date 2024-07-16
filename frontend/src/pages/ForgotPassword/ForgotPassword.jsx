import React, { useState } from "react";
import "./ForgotPassword.css";
import axios from "axios";
import { supabase } from '../../components/supabaseClient'; 

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  console.log(email);
  
  const handleResetPassword = async (event) => {
    event.preventDefault();

    /*axios.post("https://vercel-prototype-server.vercel.app/send-reset-email", {email})
    .then(result => console.log(result))
    .catch(err => console.log(err))*/

    
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://vercel-deploy-frontend-tau.vercel.app/newpassword',
  })

  /*const { data, error } = await supabase.auth
  .resetPasswordForEmail(email)*/

  if (error || !data) {
    return alert("email cannot be sent to email");
  }
  console.log("fetched data:", data);
  return alert ("email is sent successfully!");
  }

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
