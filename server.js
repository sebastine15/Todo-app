const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const connectDB = require('./server/config/database');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'client/views'));

// Middleware for parsing JSON, URL-encoded data, and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));

// Serve static files
app.use(express.static(path.join(__dirname, 'client/public')));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});
app.use('/users', require('./server/routes/userRoutes'));
app.use('/tasks', require('./server/routes/taskRoutes'));

// Error handler middleware
app.use(require('./server/middlewares/errorMiddleware'));

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});




