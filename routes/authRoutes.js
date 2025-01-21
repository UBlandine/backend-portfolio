const express = require('express');
const { signup, login, sendEmail } = require('../controller/userController'); // Correct path
const { body, validationResult } = require('express-validator');
const router = express.Router();


// Signup route with validation
router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('Telphone').isNumeric().withMessage('Phone number must be numeric'),
  ],
  async (req, res, next) => {
    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
  signup 
);

// Login route with validation
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password' });
  }
  await login(req, res);
});

// Send email route with validation
router.post('/send-email', async (req, res) => {
  console.log('Request body:', req.body);

  const { to, subject, message } = req.body;
  if (!to || !subject || !message) {
    return res.status(400).json({ message: 'Please provide all required fields (to, subject, message)' });
  }

  const result = await sendEmail({ to, subject, message });
  if (result.success) {
    return res.status(200).json({ message: 'Email sent successfully' });
  } else {
    return res.status(500).json({ message: 'Failed to send email', error: result.error });
  }
});


module.exports = router;
