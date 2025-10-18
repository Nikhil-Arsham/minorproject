const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} = require('../controllers/Announcement');
const auth = require('../middleware/auth');

// Public route - get all active announcements
router.get('/', getAnnouncements);

// Admin routes - require authentication
router.post('/', auth, createAnnouncement);
router.put('/:id', auth, updateAnnouncement);
router.delete('/:id', auth, deleteAnnouncement);

module.exports = router;