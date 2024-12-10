const mongoose = require('mongoose');
const logger = require('../utils/logger');

// Define the connectDB function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger?.('info', `MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    logger?.('error', `Database connection error: ${err.message}`);
    process.exit(1); 
  }
};

// Export the function
module.exports = connectDB;


//WHY IS MONGODB USED AS A DATABASE IN THIS PROJECT?

// MongoDB is used for the Todo App because it offers flexibility with its schema-less design, allowing tasks and users to be stored as JSON-like documents. 
// It integrates seamlessly with Node.js, enabling fast development with libraries like Mongoose. MongoDB's scalability makes it suitable for growing apps, and its querying capabilities allow efficient filtering 
// (e.g., finding tasks by state). Using MongoDB Atlas simplifies hosting and management, making it ideal for small projects. It also handles relationships through references or embedded documents, aligning well with the app's structure.
//  Finally, its horizontal scalability supports future expansion.
