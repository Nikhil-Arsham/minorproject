const express = require('express');
const router = express.Router();
const {
  createBadge,
  getBadges,
  getBadgeById,
  updateBadge,
  deleteBadge,
  seedBadges
} = require('../controllers/Badge');
const auth = require('../middleware/auth');

// Create badge (admin only)
router.post('/', auth, createBadge);

// Seed default badges (temporarily no auth for seeding)
router.post('/seed', seedBadges);

// Get all badges
router.get('/', getBadges);

// Get badge by ID
router.get('/:id', getBadgeById);

// Update badge (admin only)
router.put('/:id', auth, updateBadge);

// Delete badge (admin only)
router.delete('/:id', auth, deleteBadge);

module.exports = router;