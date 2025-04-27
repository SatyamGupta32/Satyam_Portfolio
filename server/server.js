const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { sendEmail } = require('./mailer'); // Import custom email function

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public'))); // Serve static files from "public" directory

// API route for sending emails
app.post('/contact', async (req, res) => {
  const { first_name, last_name, email, message } = req.body;

  if (!first_name || !last_name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Send email using custom SMTP function
    const response = await sendEmail({
      from: 'youremail@example.com', // Replace with your email
      to: 'recipient@example.com', // Replace with your email (who receives contact submissions)
      subject: `Contact Form Submission from ${first_name} ${last_name}`,
      body: `Message from ${email}:\n\n${message}`,
    });

    res.status(200).json({ message: 'Email sent successfully!', response });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

// Serve the frontend for other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
