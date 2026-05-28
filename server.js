const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Email transporter using environment variables (set these in Render dashboard)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Add in Render: lovi18788@gmail.com
    pass: process.env.EMAIL_PASS,  // Add in Render: your app password (no spaces)
  },
});

// Health check route
app.get('/', (req, res) => {
  res.json({ status: 'Focus Health Club backend is running ✅' });
});

// Inquiry form submission
app.post('/send-inquiry', async (req, res) => {
  const { name, phone, email, service, message } = req.body;

  if (!name || !phone || !message) {
    return res.status(400).json({ success: false, error: 'Name, phone, and message are required.' });
  }

  const mailOptions = {
    from: `"Focus Health Club Website" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `New Inquiry from ${name} - Focus Health Club`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #111; color: #fff; padding: 30px; border-radius: 10px;">
        <h2 style="color: #c9a84c; border-bottom: 2px solid #c9a84c; padding-bottom: 10px;">
          New Inquiry — Focus Health Club
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 10px; color: #aaa; width: 140px;">Name</td>
            <td style="padding: 10px; color: #fff; font-weight: bold;">${name}</td>
          </tr>
          <tr style="background: #1a1a1a;">
            <td style="padding: 10px; color: #aaa;">Phone</td>
            <td style="padding: 10px; color: #fff; font-weight: bold;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px; color: #aaa;">Email</td>
            <td style="padding: 10px; color: #fff;">${email || 'Not provided'}</td>
          </tr>
          <tr style="background: #1a1a1a;">
            <td style="padding: 10px; color: #aaa;">Service Interest</td>
            <td style="padding: 10px; color: #c9a84c; font-weight: bold;">${service || 'General Inquiry'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; color: #aaa; vertical-align: top;">Message</td>
            <td style="padding: 10px; color: #fff;">${message}</td>
          </tr>
        </table>
        <p style="margin-top: 30px; color: #555; font-size: 12px;">
          Sent from Focus Health Club website inquiry form
        </p>
      </div>
    `,
  };

  // Auto-reply to the client (if email provided)
  const autoReply = email ? {
    from: `"Focus Health Club" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Thank you for contacting Focus Health Club, ${name}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #111; color: #fff; padding: 30px; border-radius: 10px;">
        <h2 style="color: #c9a84c;">Focus Health Club</h2>
        <p style="color: #ccc;">Dear <strong>${name}</strong>,</p>
        <p style="color: #ccc;">Thank you for reaching out to us! We have received your inquiry and our team will contact you shortly on <strong>${phone}</strong>.</p>
        <p style="color: #c9a84c; font-weight: bold;">Transform Your Body. Transform Your Life.</p>
        <p style="color: #555; font-size: 12px; margin-top: 30px;">Focus Health Club, Ludhiana, Punjab</p>
      </div>
    `,
  } : null;

  try {
    await transporter.sendMail(mailOptions);
    if (autoReply) await transporter.sendMail(autoReply);
    res.json({ success: true, message: 'Inquiry sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, error: 'Failed to send email. Please try again.' });
  }
});

// Membership booking
app.post('/book-membership', async (req, res) => {
  const { name, phone, email, plan, startDate, message } = req.body;

  if (!name || !phone || !plan) {
    return res.status(400).json({ success: false, error: 'Name, phone, and plan are required.' });
  }

  const mailOptions = {
    from: `"Focus Health Club Website" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `New Membership Booking: ${plan} — ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #111; color: #fff; padding: 30px; border-radius: 10px;">
        <h2 style="color: #c9a84c; border-bottom: 2px solid #c9a84c; padding-bottom: 10px;">
          New Membership Booking — Focus Health Club
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 10px; color: #aaa; width: 140px;">Name</td>
            <td style="padding: 10px; color: #fff; font-weight: bold;">${name}</td>
          </tr>
          <tr style="background: #1a1a1a;">
            <td style="padding: 10px; color: #aaa;">Phone</td>
            <td style="padding: 10px; color: #fff; font-weight: bold;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px; color: #aaa;">Email</td>
            <td style="padding: 10px; color: #fff;">${email || 'Not provided'}</td>
          </tr>
          <tr style="background: #1a1a1a;">
            <td style="padding: 10px; color: #aaa;">Plan Selected</td>
            <td style="padding: 10px; color: #c9a84c; font-weight: bold; font-size: 18px;">${plan}</td>
          </tr>
          <tr>
            <td style="padding: 10px; color: #aaa;">Start Date</td>
            <td style="padding: 10px; color: #fff;">${startDate || 'As soon as possible'}</td>
          </tr>
          <tr style="background: #1a1a1a;">
            <td style="padding: 10px; color: #aaa; vertical-align: top;">Notes</td>
            <td style="padding: 10px; color: #fff;">${message || 'None'}</td>
          </tr>
        </table>
        <p style="margin-top: 30px; color: #555; font-size: 12px;">
          Sent from Focus Health Club membership booking form
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Membership booking received!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, error: 'Failed to process booking. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Focus Health Club server running on port ${PORT}`);
});
