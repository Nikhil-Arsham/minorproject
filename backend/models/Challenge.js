const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  topics: [{
    type: String,
    required: true
  }],
  inputFormat: String,
  outputFormat: String,
  constraints: String,
  points: {
    type: Number,
    default: 10
  },
  examples: [{
    input: String,
    output: String,
    explanation: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Challenge', challengeSchema);
