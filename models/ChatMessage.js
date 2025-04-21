// ChatMessage.js - Mongoose model for chat messages
const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  sender: { type: String, ref: 'User', required: true },
  receiver: { type: String, ref: 'User', required: true },
  message: { type: String },
  attachmentUrl: { type: String },
  sentAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
