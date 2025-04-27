const net = require('net');

// SMTP email sending function
function sendEmail({ from, to, subject, body }) {
  return new Promise((resolve, reject) => {
    const smtpHost = 'smtp.your-email-provider.com'; // Replace with your SMTP server
    const smtpPort = 587; // SMTP port (use 465 for SSL, 587 for STARTTLS)
    const username = 'youremail@example.com'; // Replace with your email
    const password = 'your-email-password'; // Replace with your email password

    const client = net.createConnection(smtpPort, smtpHost, () => {
      let stage = 0;
      const commands = [
        `EHLO localhost`,
        `AUTH LOGIN`,
        Buffer.from(username).toString('base64'), // Email (Base64 encoded)
        Buffer.from(password).toString('base64'), // Password (Base64 encoded)
        `MAIL FROM:<${from}>`,
        `RCPT TO:<${to}>`,
        `DATA`,
        `Subject: ${subject}\r\nFrom: ${from}\r\nTo: ${to}\r\n\r\n${body}\r\n.\r\n`,
        `QUIT`,
      ];

      client.on('data', (data) => {
        console.log('SMTP Response:', data.toString());
        if (stage < commands.length) {
          client.write(commands[stage] + '\r\n');
          stage++;
        } else {
          client.end();
          resolve('Email sent successfully!');
        }
      });

      client.on('error', (err) => {
        reject(err);
      });
    });
  });
}

module.exports = { sendEmail };
