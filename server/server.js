// server.js (or index.js)
const express    = require('express');
const nodemailer = require('nodemailer');
const cors       = require('cors');
const bodyParser = require('body-parser');
const path       = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const transporter = nodemailer.createTransport({
  host: 'smtp.your-smtp-host.com',
  port: 587,            // or 465
  secure: false,        // true for 465, false for other ports
  auth: {
    user: 'youremail@domain.com',
    pass: 'your_smtp_password'
  }
});

app.post('/contact', async (req, res) => {
  const { first_name, last_name, email, message } = req.body;
  if (!first_name || !last_name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <youremail@domain.com>`,
      to:   'satyamg501@gmail.com',    // <-- where you want to receive it
      subject: `New message from ${first_name} ${last_name}`,
      text: `You got a message from ${email}:\n\n${message}`
    });

    return res.sendStatus(200);
  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
});

// Let React/router handle everything else
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
); 

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
