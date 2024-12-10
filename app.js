const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client/views'));

// Default homepage route
app.get('/', (req, res) => {
    res.render('index');
});


// Serve static files
app.use(express.static(path.join(__dirname, '../client/public')));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for cookies
app.use(cookieParser());

// Debugging middleware (optional)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Routes
const userRoutes = require('./server/routes/userRoutes'); 
const taskRoutes = require('./server/routes/taskRoutes'); 
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);


// Global error handler
const errorMiddleware = require('./server/middlewares/errorMiddleware');
app.use(errorMiddleware);

module.exports = app;
