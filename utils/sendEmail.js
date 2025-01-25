const nodemailer = require('nodemailer');

// Define the sendEmail function
const sendEmail = async ({ to, subject, message }) => {
    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // Use Gmail or your email provider
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS, // Your email password or app password
            },
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address
            to, // Recipient address
            subject, // Dynamic subject
            text: message, // Dynamic message
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
};

module.exports = sendEmail;
