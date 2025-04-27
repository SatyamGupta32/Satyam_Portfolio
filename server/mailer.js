const path       = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env.local')   // ← point to the real location
});
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendContactEmail({ first_name, last_name, email, message }) {
  if (!first_name || !last_name || !email || !message) {
    throw new Error('All fields are required');
  }

  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_RECIPIENT,
    subject: `New message from ${first_name} ${last_name}`,
    text: `You got a message from ${email}:\n\n${message}`
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { transporter, sendContactEmail };
