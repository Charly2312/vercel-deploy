import express from "express";
import cors from "cors";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
//import path from "path";

//creating the supabase client
const supabaseUrl = "https://evbrffpvxgoyhaoqrmdn.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2YnJmZnB2eGdveWhhb3FybWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc2NTM3OTksImV4cCI6MjAzMzIyOTc5OX0.q-Ww1QoOBekFK0qS4rDUWDDVZ7KOvn1P-Pq205tTsjQ";
const supabase = createClient(supabaseUrl, supabaseKey);
const resend = new Resend('re_W5NpBXy2_E55ucKWASgE5n9U55edddSFK')

const mailerSend = new MailerSend({
  apiKey: "mlsn.8f3948f1c0ad86138d242a749a946369bf484a6c665e493095a33b221e72f16c",
});

const app = express();
const PORT = 5000; //react by default uses port 3000. DONT put 3000 here!

//frontend url
app.use(cors({
  origin: ["https://vercel-deploy-frontend-tau.vercel.app"],
  methods: ["POST", "GET"],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Testing, Hello World!');
  res.json('Testing, Hello World!');
});

//for forgot password
//-> send email
app.post('/send-reset-email', async (req, res) => {
  const { email } = req.body;
  console.log('POST Request received');
  console.log('Received data:', req.body);

  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  console.log('Fetched user data:', data);

  if (error) {
    console.error('Error requesting password reset:', error);
    return res.status(500).json({ message: "Failed to send reset email", details: error.message });
  } else {
    const sentFrom = new Sender("ontrack@trial-yzkq340req04d796.mlsender.net", "ontrack");

    const recipients = [
      new Recipient(email, "user")
    ];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("Reset password link")
      .setHtml("<p>Press the link to reset your password: <link>https://vercel-deploy-frontend-tau.vercel.app/newpassword</link>!</p>")
      .setText("this is the text content");

    await mailerSend.email.send(emailParams);
  }
});

app.get("/api", (req, res) => {
  res.send({ "users": ["userOne", "userTwo", "userThree"] });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server is running on http://localhost:${PORT}`);
});

/*
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});*/