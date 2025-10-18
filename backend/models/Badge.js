const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: "#3B82F6"
  },
  criteria: {
    type: {
      type: String,
      enum: ["problems_solved", "topic_mastery", "contest_participation", "streak", "difficulty_mastery"],
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    topic: String, // For topic-specific badges
    difficulty: String // For difficulty-specific badges
  },
  rarity: {
    type: String,
    enum: ["Common", "Rare", "Epic", "Legendary"],
    default: "Common"
  }
});

module.exports = mongoose.model("Badge", badgeSchema);