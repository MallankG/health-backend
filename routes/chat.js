const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ChatMessage = require('../models/ChatMessage');

// GET /api/chat?userId=... - Get all chat messages for a user (sent or received)
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    let id = userId;
    if (typeof userId === 'string' && mongoose.Types.ObjectId.isValid(userId)) {
      id = new mongoose.Types.ObjectId(userId);
    } else if (typeof userId !== 'object' || !userId) {
      return res.status(400).json({ message: 'Invalid or missing userId' });
    }
    const messages = await ChatMessage.find({
      $or: [
        { sender: id },
        { receiver: id }
      ]
    }).sort({ sentAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
