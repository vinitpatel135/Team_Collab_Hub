// Backend route to get and post messages for a task (routes/messageRoutes.js)
const express = require('express');
const Message = require('../model/Message');
// const Message = require('../models/Message');
const router = express.Router();

// Get messages for a task
router.get('/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const messages = await Message.find({ taskId }).populate('userId', 'name').sort('timestamp');
  res.json(messages);
});

// Post a new message
router.post('/', async (req, res) => {
  const { taskId, userId, content } = req.body;
  const message = new Message({ taskId, userId, content });
  await message.save();
  res.status(201).json(message);
});

module.exports = router;
