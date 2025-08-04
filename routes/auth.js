const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// GET routes
router.get('/login', authController.renderLogin);
router.get('/register', authController.renderRegister);

// POST routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;
