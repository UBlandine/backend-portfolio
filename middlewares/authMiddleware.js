const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    // Check if token exists
    if (!token) {
        return res.status(401).json({ message: 'Access token missing' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.user = decoded;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticateToken;
