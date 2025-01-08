const express = require('express');
const userController = require('../controller/userController'); // Ensure the path is correct
const router = express.Router();

// Signup route
router.post('/signup', userController.signup);

// Login route
router.post('/login', userController.login);

// Send email route
router.post('/send-email', userController.sendEmail);

module.exports = router;
