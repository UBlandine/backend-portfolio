const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.headers['authorization'];

    // Check if token exists and is in the correct format
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access token missing or invalid format. Ensure the token starts with "Bearer "' });
    }

    // Extract the token from the 'Bearer <token>' format
    const actualToken = token.split(' ')[1];

    // Verify the token
    try {
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded user info to the request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token', error: error.message });
    }
};

module.exports = authenticateToken;
