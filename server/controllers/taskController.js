const Task = require('../models/Task');

// Get all tasks for the logged-in user
exports.getTasks = async (req, res, next) => {
  try {
    console.log('Inside getTasks function');

    if (!req.user || !req.user.id) {
      console.error('User not authenticated');
      return res.redirect('/users/login');
    }

    console.log('Authenticated User ID:', req.user.id);

    // Fetch tasks from the database
    const tasks = await Task.find({ user: req.user.id });
    console.log('Fetched Tasks from DB:', tasks);
    res.render('tasks', { tasks, errorMessage: null });
  } catch (err) {
    console.error('Error fetching tasks:', err.message);
    res.render('tasks', { tasks: [], errorMessage: 'Error loading tasks. Please try again.' });
  }
};

// Create a new task
exports.createTask = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      console.error('User not authenticated');
      return res.redirect('/users/login');
    }

    const { description } = req.body;

    if (!description) {
      console.error('Task description missing');
      return res.render('tasks', {
        tasks: [],
        errorMessage: 'Task description is required',
      });
    }

    const task = await Task.create({ description, user: req.user.id });
    console.log('Task Created Successfully:', task);
    res.redirect('/tasks');
  } catch (err) {
    console.error('Error creating task:', err.message);
    res.render('tasks', { tasks: [], errorMessage: 'Error creating task. Please try again.' });
  }
};

// Update a task's state
exports.updateTask = async (req, res, next) => {
  try {
    const { state } = req.body;
    const validStates = ['pending', 'completed', 'deleted'];

    if (!validStates.includes(state)) {
      console.error('Invalid task state:', state);
      return res.status(400).json({ message: 'Invalid task state' });
    }

    console.log('Updating Task ID:', req.params.id, 'to state:', state);
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { state },
      { new: true }
    );

    if (!task) {
      console.error('Task not found for update');
      return res.status(404).json({ message: 'Task not found' });
    }

    console.log('Task Updated Successfully:', task);
    res.redirect('/tasks');
  } catch (err) {
    console.error('Error updating task:', err.message);
    res.render('tasks', { tasks: [], errorMessage: 'Error updating task. Please try again.' });
  }
};

// Delete a task
exports.deleteTask = async (req, res, next) => {
  try {
    console.log('Deleting Task ID:', req.params.id);

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      console.error('Task not found for deletion');
      return res.status(404).json({ message: 'Task not found' });
    }

    console.log('Task Deleted Successfully:', task);
    res.redirect('/tasks');
  } catch (err) {
    console.error('Error deleting task:', err.message);
    res.render('tasks', { tasks: [], errorMessage: 'Error deleting task. Please try again.' });
  }
};
