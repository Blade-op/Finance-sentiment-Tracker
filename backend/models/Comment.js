const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  user: { type: String, required: true }, // username or userId
  targetType: { type: String, enum: ['stock', 'news'], required: true },
  targetId: { type: String, required: true }, // stock symbol or news id
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);