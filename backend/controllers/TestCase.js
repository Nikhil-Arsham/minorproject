const TestCase = require("../models/TestCase");

const getTestCasesByChallenge = async (req, res) => {
  try {
    const testCases = await TestCase.find({
      challengeId: req.params.id,
      ...(req.user?.role !== "admin" ? { isHidden: false } : {}),
    }).lean();
    res.status(200).json(testCases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTestCasesByContest = async (req, res) => {
  try {
    const testCases = await TestCase.find({
      contestId: req.params.id,
      ...(req.user?.role !== "admin" ? { isHidden: false } : {}),
    }).lean();
    res.status(200).json(testCases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTestCase = async (req, res) => {
  try {
    const testCase = new TestCase({
      ...req.body,
      challengeId: req.params.id,
    });
    await testCase.save();
    res.status(201).json(testCase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createContestTestCase = async (req, res) => {
  try {
    const testCase = new TestCase({
      ...req.body,
      contestId: req.params.id,
    });
    await testCase.save();
    res.status(201).json(testCase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTestCase = async (req, res) => {
  try {
    const testCase = await TestCase.findByIdAndUpdate(req.params.testCaseId, req.body, { new: true });
    if (!testCase) {
      return res.status(404).json({ error: 'Test case not found' });
    }
    res.json(testCase);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTestCase = async (req, res) => {
  try {
    const testCase = await TestCase.findByIdAndDelete(req.params.testCaseId);
    if (!testCase) {
      return res.status(404).json({ error: 'Test case not found' });
    }
    res.json({ message: 'Test case deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTestCasesByChallenge,
  getTestCasesByContest,
  createTestCase,
  createContestTestCase,
  updateTestCase,
  deleteTestCase,
};
