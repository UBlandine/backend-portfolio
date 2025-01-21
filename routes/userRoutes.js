const express = require('express');
const {signup, login, sendEmail} = require('../controller/userController'); // Ensure the path is correct
const router = express.Router();

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Send email route
router.post('/send-email', sendEmail);

module.exports = router;
