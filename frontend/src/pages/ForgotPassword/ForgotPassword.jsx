import React, { useState } from "react";
import "./ForgotPassword.css";
import axios from "axios";
import { supabase } from '../../components/supabaseClient'; 
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: "mlsn.8f3948f1c0ad86138d242a749a946369bf484a6c665e493095a33b221e72f16c",
});

const sentFrom = new Sender("ontrack@trial-yzkq340req04d796.mlsender.net", "ontrack");

const recipients = [
  new Recipient(email, "user")
];

const emailParams = new EmailParams()
  .setFrom(sentFrom)
  .setTo(recipients)
  .setReplyTo(sentFrom)
  .setSubject("This is a subject")
  .setHtml("<strong>This is the HTML content without link</strong>")
  .setText("this is the text content");

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  console.log(email);
  
  const handleResetPassword = async (event) => {
    event.preventDefault();

    /*axios.post("https://vercel-prototype-server.vercel.app/send-reset-email", {email})
    .then(result => console.log(result))
    .catch(err => console.log(err))*/

    
  /*const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://vercel-deploy-frontend-tau.vercel.app/newpassword',
  })

  if (error || !data) {
    return alert("email cannot be sent to email");
  }
  console.log("fetched data:", data);
  return alert ("email is sent successfully!");*/
  await mailerSend.mail.send(emailParams);
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
