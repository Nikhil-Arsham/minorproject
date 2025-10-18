const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  profile: {
    name: {
      type: String,
      required: true,
    },
    bio: String,
    avatar: String,
    country: String,
    company: String,
    website: String,
    github: String,
    linkedin: String,
    rating: {
      type: Number,
      default: 1200
    },
    maxRating: {
      type: Number,
      default: 1200
    },
    rank: String,
    globalRank: Number,
    countryRank: Number
  },
  stats: {
    totalSolved: {
      type: Number,
      default: 0
    },
    easySolved: {
      type: Number,
      default: 0
    },
    mediumSolved: {
      type: Number,
      default: 0
    },
    hardSolved: {
      type: Number,
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    maxStreak: {
      type: Number,
      default: 0
    },
    lastSolvedDate: Date,
    topicProgress: {
      type: Map,
      of: {
        solved: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      },
      default: {}
    },
    contestsParticipated: {
      type: Number,
      default: 0
    },
    contestRating: {
      type: Number,
      default: 1200
    }
  },
  badges: [{
    badge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Badge"
    },
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  solvedProblems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Challenge"
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;




