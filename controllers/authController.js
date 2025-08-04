const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

// Register controller
const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            return res.status(400).render('register', { 
                error: 'User with this email or username already exists' 
            });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password,
            role: role || 'user'
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user._id, 
                username: user.username, 
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.redirect('/');
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).render('register', { 
            error: 'Registration failed. Please try again.' 
        });
    }
};

// Login controller
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).render('login', { 
                error: 'Invalid username or password' 
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).render('login', { 
                error: 'Invalid username or password' 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user._id, 
                username: user.username, 
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.redirect('/');
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).render('login', { 
            error: 'Login failed. Please try again.' 
        });
    }
};

// Logout controller
const logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/auth/login');
};

// Render login page
const renderLogin = (req, res) => {
    res.render('login', { error: null });
};

// Render register page
const renderRegister = (req, res) => {
    res.render('register', { error: null });
};

module.exports = {
    register,
    login,
    logout,
    renderLogin,
    renderRegister,
    JWT_SECRET
};
