const mongoose = require("mongoose");

const contestParticipationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contest",
    required: true,
  },
  totalScore: {
    type: Number,
    default: 0,
  },
  solvedProblems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Challenge",
  }],
  problemScores: [{
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
    },
    score: Number,
    submissionCount: {
      type: Number,
      default: 1,
    },
  }],
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Unique constraint on userId + contestId to prevent duplicates
contestParticipationSchema.index({ userId: 1, contestId: 1 }, { unique: true });

const ContestParticipation = mongoose.model(
  "ContestParticipation",
  contestParticipationSchema
);

module.exports = ContestParticipation;