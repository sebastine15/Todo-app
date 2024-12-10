jest.setTimeout(30000);

const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app'); 

let token;
let taskId;

beforeAll(async () => {
  // Connect to the database
  await mongoose.connect(process.env.MONGO_URI);

  // Register a user
  await request(app)
    .post('/users/register')
    .send({ username: 'taskuser', password: 'password123' });

  // Login the user and retrieve the token
  const res = await request(app)
    .post('/users/login')
    .send({ username: 'taskuser', password: 'password123' });

  token = res.body.token;
});

afterAll(async () => {
  // Disconnect from the database
  await mongoose.disconnect();
});

describe('Task Management', () => {
  it('should create a new task', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Test Task' });

    expect(res.statusCode).toEqual(201);
    expect(res.body.task.description).toEqual('Test Task');

    // Save task ID for further tests
    taskId = res.body.task._id;
  });

  it('should retrieve all tasks for the user', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true); 
    expect(res.body).toHaveLength(1); 
    expect(res.body[0]._id).toEqual(taskId); 
  });

  it('should update a task state to completed', async () => {
    const res = await request(app)
      .put(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ state: 'completed' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.task.state).toEqual('completed'); 
  });

  it('should delete a task', async () => {
    const res = await request(app)
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Task deleted successfully');
  });
});
