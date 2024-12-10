const express = require('express');
const { register, login } = require('../controllers/userController');
const router = express.Router();

// Render the registration form
router.get('/register', (req, res) => {
    res.render('register');
});

// Render the login form
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle registration form submission
router.post('/register', register);

// Handle login form submission
router.post('/login', login);

module.exports = router;

