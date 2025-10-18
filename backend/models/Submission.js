const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Challenge",
    required: true,
  },
  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contest",
    default: null,  // null for practice problems, contest ID for contest submissions
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
    enum: ["python", "javascript", "java", "cpp", "csharp", "java", "ruby", "go", "rust"], // Add more as needed
  },
  status: {
    type: String,
    enum: ["accepted", "wrong_answer", "time_limit_exceeded", "runtime_error", "pending"],
    default: "pending",
  },
  runtime: {
    type: Number, // milliseconds
  },
  memory: {
    type: Number, // MB
  },
  score: {
    type: Number,
    default: 0,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const Submission = mongoose.model("Submission", submissionSchema);  
module.exports = Submission;