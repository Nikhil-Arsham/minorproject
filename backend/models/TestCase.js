const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Challenge",
  },
  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contest",
  },
  input: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
  isHidden: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true
});

// Ensure at least one of challengeId or contestId is provided
testCaseSchema.pre('save', function(next) {
  if (!this.challengeId && !this.contestId) {
    throw new Error('Either challengeId or contestId must be provided');
  }
  next();
});

module.exports = mongoose.model("TestCase", testCaseSchema);
