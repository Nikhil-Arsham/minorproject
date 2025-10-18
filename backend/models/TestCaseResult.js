const mongoose = require("mongoose");

const testCaseResultSchema = new mongoose.Schema({
  submissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Submission",
    required: true,
  },
  testCaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TestCase",
    required: true,
  },
  status: {
    type: String,
    enum: ["passed", "failed", "error"],
    required: true,
  },
  output: {
    type: String,
  },
  error: {
    type: String,
  },
  runtime: {
    type: Number, // milliseconds
  },
  memory: {
    type: Number, // MB
  },
});

const TestCaseResult = mongoose.model("TestCaseResult", testCaseResultSchema);
module.exports = TestCaseResult;