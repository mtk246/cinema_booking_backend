const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: 'Access denied. No token provided.'
        });
    }

    const tokenWithoutBearer = token.replace('Bearer ', '');

    jwt.verify(tokenWithoutBearer, 'secret_key', (err, decoded) => {
        console.log(decoded);
        if (err) {
            return res.status(401).json({
                message: 'Invalid token.'
            });
        }

        req.user = decoded;
        next();
    });
};

module.exports = exports;
