const TestCaseResult = require("../models/TestCaseResult");
const Submission = require("../models/Submission");
const TestCase = require("../models/TestCase");

// ...rest of your code unchanged...
const getTestCaseResults = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findById(id).lean();
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }
    if (submission.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const results = await TestCaseResult.find({ submissionId: id })
      .populate({
        path: "testCaseId",
        select: "input output isHidden",
      })
      .lean();
    const filteredResults = req.user.role === "admin"
      ? results
      : results.filter((result) => !result.testCaseId.isHidden);
    res.status(200).json(filteredResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getTestCaseResults };