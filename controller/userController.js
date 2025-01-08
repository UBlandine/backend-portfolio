const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ugirablando@gmail.com', // Replace with your Gmail address
        pass: process.env.EMAIL_PASSWORD || 'your_gmail_app_password', // Replace with your app-specific password
    },
});

// Signup Controller
exports.signup = async (req, res) => {
    const { name, email, password, Telphone } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
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

        await newUser.save();

        res.status(201).json({ message: 'User signed up successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Error signing up user', error: err.message });
    }
};

// Login Controller
exports.login = async (req, res) => {
    const { email, password } = req.body;

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

    try {
        // Send email
        await transporter.sendMail({
            from: 'ugirablando@gmail.com',
            to,
            subject,
            text: message,
        });

        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Error sending email', error: err.message });
    }
};
