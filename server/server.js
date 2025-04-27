require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sendContactEmail } = require('./mailer.js');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (css, scripts, assets)
app.use(express.static(path.join(__dirname, '../'))); 

// Form Submit Endpoint
app.post('/contact', async (req, res) => {
  try {
    await sendContactEmail(req.body);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(err.message === 'All fields are required' ? 400 : 500)
       .json({ error: err.message });
  }
});

// Serve index.html correctly
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));  
});

app.get('/contact', (req, res) => {
  res.send('Contact page');
});

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
