const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// GET /api/comments/:targetType/:targetId - fetch comments for a stock or news
router.get('/:targetType/:targetId', async (req, res) => {
  const { targetType, targetId } = req.params;
  try {
    const comments = await Comment.find({ targetType, targetId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// POST /api/comments - post a new comment
router.post('/', async (req, res) => {
  const { user, targetType, targetId, text } = req.body;
  if (!user || !targetType || !targetId || !text) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const comment = new Comment({ user, targetType, targetId, text });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to post comment' });
  }
});

// DELETE /api/comments/:id - delete a comment by id
router.delete('/:id', async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;