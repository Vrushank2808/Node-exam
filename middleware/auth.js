const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../controllers/authController');

// Middleware to check JWT token
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/auth/login');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.clearCookie('token');
        return res.redirect('/auth/login');
    }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).render('error', { 
            message: 'Access denied. Admin privileges required.' 
        });
    }
};

// Middleware to check if user is logged in (optional authentication)
const optionalAuth = (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
        } catch (error) {
            res.clearCookie('token');
        }
    }
    
    next();
};

module.exports = {
    authenticateToken,
    requireAdmin,
    optionalAuth
};
