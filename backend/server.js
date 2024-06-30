import express from "express";
import cors from "cors";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
//import path from "path";

//creating the supabase client
const supabaseUrl = "https://evbrffpvxgoyhaoqrmdn.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2YnJmZnB2eGdveWhhb3FybWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc2NTM3OTksImV4cCI6MjAzMzIyOTc5OX0.q-Ww1QoOBekFK0qS4rDUWDDVZ7KOvn1P-Pq205tTsjQ";
const supabase = createClient(supabaseUrl, supabaseKey);
const resend = new Resend('re_W5NpBXy2_E55ucKWASgE5n9U55edddSFK')

const app = express();
const PORT = 5000; //react by default uses port 3000. DONT put 3000 here!

app.use(cors({
  origin: ["https://vercel-prototype-server.vercel.app"],
  methods: ["POST", "GET"],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Testing, Hello World!');
});

//for forgot password
//-> send email
app.post('/send-reset-email', async (req, res) => {
  const { email } = req.body;
  console.log('POST Request received');  
  console.log('Received data:', req.body);

  const { data, error } = await supabase
        .from('users')
        .select()
        .eq('email', email)
        .maybeSingle();
  
  console.log('Fetched user data:', data);

  if (error) {
    console.error('Error requesting password reset:', error);
    return res.status(500).json({ message: "Failed to send reset email", details: error.message });
  } else {
    resend.emails.send({
      from: 'onboarding@resend.dev',
      //from:'ontrack@support.com',
      to: email,
      subject: 'Reset password link',
      html: '<p>Press the link to reset your password: <link>http://localhost:3000/newpassword</link>!</p>'
    });
    console.log('Reset password email sent:', data);
    res.json({ message: "Reset email sent successfully" });
  }
});

/*
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});*/

app.get("/api", (req,res)=>{
    res.send({"users":["userOne", "userTwo", "userThree"]});
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server is running on http://localhost:${PORT}`);
});
