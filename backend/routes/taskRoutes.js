const express = require('express');
const Task = require('../model/Task');

const router = express.Router();

router.post('/', async (req, res) => {
    const { title, userIds } = req.body;
    const newTask = new Task({ title, userIds }); // userIds should be an array
    await newTask.save();
    res.status(201).json(newTask);
});
router.get('/', async (req, res) => {
  const tasks = await Task.find().populate('userIds');
  res.json(tasks);
});

router.get('/:taskId/users', async (req, res) => {
    try {
        const { taskId } = req.params;

        // Find the task by ID and populate the userIds field with user details
        const task = await Task.findById(taskId).populate('userIds', 'name email'); // Only populate the 'name' and 'email' fields of users
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Return the list of users assigned to the task
        res.status(200).json(task.userIds);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
