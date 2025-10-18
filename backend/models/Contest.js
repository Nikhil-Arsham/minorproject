const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  challenges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Challenge" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Contest = mongoose.model("Contest", contestSchema);
module.exports = Contest;