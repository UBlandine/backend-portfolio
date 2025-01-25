const express = require('express');
const { signup, login, sendEmail } = require('../controller/userController'); // Correct path
const { body, validationResult } = require('express-validator');
const router = express.Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: User signup
 *     description: Register a new user by providing email, password, and phone number.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password (minimum 6 characters)
 *                 example: password123
 *               Telphone:
 *                 type: string
 *                 description: User's phone number (numeric only)
 *                 example: 1234567890
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Validation errors or bad request
 */
router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('Telphone').isNumeric().withMessage('Phone number must be numeric'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  signup
);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user using their email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: password123
 *     responses:
 *       200:
 *         description: User successfully logged in
 *       400:
 *         description: Missing or invalid credentials
 *       401:
 *         description: Unauthorized
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password' });
  }
  await login(req, res);
});

/**
 * @swagger
 * /api/users/send-email:
 *   post:
 *     summary: Send an email
 *     description: Send an email by specifying the recipient, subject, and message.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 description: Recipient's email address
 *                 example: recipient@example.com
 *               subject:
 *                 type: string
 *                 description: Email subject
 *                 example: Welcome to our platform
 *               message:
 *                 type: string
 *                 description: Email content
 *                 example: Thank you for signing up!
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error or failed to send email
 */
router.post('/send-email', async (req, res) => {
  console.log('Request body:', req.body);

  const { to, subject, message } = req.body;
  if (!to || !subject || !message) {
    return res.status(400).json({ message: 'Please provide all required fields (to, subject, message)' });
  }

  // Pass req and res to sendEmail
  await sendEmail(req, res, { to, subject, message });
});


module.exports = router;
