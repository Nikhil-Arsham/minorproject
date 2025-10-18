const express = require('express');
const router = express.Router();
const {
  createChallenge,
  getChallenges,
  getChallengeById,
  updateChallenge,
  deleteChallenge
} = require('../controllers/Challenge');
const auth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');

// Create challenge (admin only - requires auth)
router.post('/', auth, createChallenge);

// Get all challenges (optional auth for showing solved status)
router.get('/', optionalAuth, getChallenges);

// Get challenge by ID (optional auth for showing solved status)
router.get('/:id', optionalAuth, getChallengeById);

// Update challenge (admin only - requires auth)
router.put('/:id', auth, updateChallenge);

// Delete challenge (admin only - requires auth)
router.delete('/:id', auth, deleteChallenge);

module.exports = router;
