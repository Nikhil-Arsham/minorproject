const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 0 // Higher numbers = higher priority
  }
}, {
  timestamps: true
});

// Index for efficient querying
announcementSchema.index({ date: -1, priority: -1 });

module.exports = mongoose.model('Announcement', announcementSchema);