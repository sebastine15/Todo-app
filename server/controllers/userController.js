const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Register a new user
exports.register = async (req, res, next) => {
    try {
      const { username, password } = req.body;
  
      // Check if username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.render('register', { errorMessage: 'Username already exists', successMessage: null });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      await User.create({ username, password: hashedPassword });
      console.log('User Created');
  
      // Redirect to login page after successful registration
      return res.redirect('/users/login');
    } catch (err) {
      console.error('Error during registration:', err.message); // Log the error for debugging
      return res.render('register', { errorMessage: 'Error during registration. Please try again.', successMessage: null });
    }
  };  

// Login a user
exports.login = async (req, res, next) => {
    try {
      const { username, password } = req.body;
  
      console.log('Login Request:', { username });
  
      // Find the user by username
      const user = await User.findOne({ username });
      console.log('User Found:', user);
  
      if (!user) {
        return res.render('login', { errorMessage: 'Invalid username or password', successMessage: null });
      }
  
      // Compare the password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password Match:', isMatch);
  
      if (!isMatch) {
        return res.render('login', { errorMessage: 'Invalid username or password', successMessage: null });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
  
      // Store the token in a cookie
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });      
  
      // Redirect to tasks
      res.redirect('/tasks');
    } catch (err) {
      console.error('Error during login:', err.message);
      res.render('login', { errorMessage: 'Error during login. Please try again.', successMessage: null });
    }
};

  