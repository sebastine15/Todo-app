jest.setTimeout(30000); 
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 
const request = require('supertest');
const app = require('../app');
const User = require('../server/models/User');

const existingUsername = 'Damoz1059'; 
const existingPassword = 'password123'; 

// Connect to the database before running the tests
beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database');

    // Ensure the existing user exists in the database with a hashed password
    const hashedPassword = await bcrypt.hash(existingPassword, 10);
    await User.updateOne(
      { username: existingUsername },
      { username: existingUsername, password: hashedPassword },
      { upsert: true } // Create the user if it doesn't exist
    );
  } catch (err) {
    console.error('Database connection error:', err.message);
  }
});

// Disconnect from the database after running the tests
afterAll(async () => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  } catch (err) {
    console.error('Database disconnection error:', err.message);
  }
});

// Cleanup test data after each test (avoid removing Damoz1059)
afterEach(async () => {
  try {
    await User.deleteMany({ username: { $in: ['testuser', 'invaliduser'] } });
  } catch (err) {
    console.error('Error cleaning up test data:', err.message);
  }
});

describe('User Authentication', () => {
  it('should login the existing user and return a token', async () => {
    const res = await request(app).post('/users/login').send({
      username: existingUsername,
      password: existingPassword, 
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with invalid credentials', async () => {
    const res = await request(app).post('/users/login').send({
      username: 'invaliduser',
      password: 'invalidpassword',
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Invalid username or password');
  });
});
