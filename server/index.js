require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

app.use(cors());
app.use(express.json());

// Setup nodemailer transporter using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/api/contact', async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required.' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'nati.sami.mata@gmail.com',         // Target recipient
        subject: `New Contact Form Submission from ${name}`,
        text: `You have received a new message.\n\nName: ${name}\nEmail: ${email}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email successfully sent from ${name} (${email})`);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send email. Ensure your App Password is correct.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running closely on http://localhost:${PORT}`);
});
