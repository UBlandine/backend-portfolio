const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'ugirablando@gmail.com', // Gmail address from env variable
        pass: process.env.EMAIL_PASSWORD || 'your_gmail_app_password', // Gmail app-specific password from env variable
    },
});
// Signup Controller
exports.signup = async (req, res) => {
    const { name, email, password, Telphone } = req.body;

    // Validate inputs
    if (!name || !email || !password || !Telphone) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Check if phone number already exists
        const existingPhone = await User.findOne({ Telphone });
        if (existingPhone) {
            return res.status(400).json({ message: 'Phone number already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            Telphone,
        });

        // Save the user to the database
        await newUser.save();

        // Send a welcome email (optional)
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to My Portfolio!',
            text: `Hi ${name},\n\nThank you for signing up! We are excited to have you on board.\n\nBest regards,\nBlandine`,
        });

        // Respond with success message
        res.status(201).json({ message: 'User signed up successfully!' });
    } catch (err) {
        console.error('Signup Error:', err.message);
        res.status(500).json({ message: 'Error signing up user', error: err.message });
    }
};


// Login Controller
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in user', error: err.message });
    }
};

// Send Email Controller
exports.sendEmail = async (req, res) => {
    const { to, subject, message } = req.body;

    // Validate inputs
    if (!to || !subject || !message) {
        return res.status(400).json({ message: 'Missing required fields: to, subject, or message' });
    }

    try {
        // Send email to the user
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text: message,
        });

        // Send a copy of the email to yourself
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send a copy to yourself
            subject: `Copy of Email to ${to}: ${subject}`,
            text: `A user sent the following message:\n\nRecipient: ${to}\nSubject: ${subject}\n\nMessage:\n${message}`,
        });

        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (err) {
        console.error('Error sending email:', err);
        res.status(500).json({ message: 'Error sending email', error: err.message });
    }
};
