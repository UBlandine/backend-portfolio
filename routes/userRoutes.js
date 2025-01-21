const express = require('express');
const { signup, login, sendEmail } = require('../controller/userController'); // Ensure the path is correct
const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * tags:
 *   name: Users
 *   description: User management for my portfolio
 */

/**
 * @swagger
 * /api/v1/users/signup:
 *   post:
 *     summary: User signup
 *     description: Register a new user in the system.
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
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Validation errors or bad request
 */
router.post('/signup', signup);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user with email and password.
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
 *         description: Validation errors or bad request
 *       401:
 *         description: Unauthorized or invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /api/v1/auth/send-email:
 *   post:
 *     summary: Send an email
 *     description: Send an email to a specified recipient with a subject and message.
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
 *                 example: Welcome
 *               message:
 *                 type: string
 *                 description: Email message content
 *                 example: Hello, welcome to our platform!
 *     responses:
 *       200:
 *         description: Email successfully sent
 *       400:
 *         description: Validation errors or bad request
 *       500:
 *         description: Server error
 */
router.post('/send-email', sendEmail);

module.exports = router;
