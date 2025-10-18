const Challenge = require('../models/Challenge');

const createChallenge = async (req, res) => {
  try {
    const challenge = new Challenge(req.body);
    await challenge.save();
    res.status(201).json(challenge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find();

    // If user is authenticated, include solved status
    if (req.user && req.user.id) {
      try {
        const userSubmissions = await require('../models/Submission').find({
          userId: req.user.id,
          status: 'accepted'
        }).select('challengeId').lean();

        // Create a set of solved challenge IDs
        const solvedChallengeIds = new Set(userSubmissions.map(sub => sub.challengeId.toString()));

        // Add solved status to challenges
        const challengesWithProgress = challenges.map(challenge => ({
          ...challenge.toObject(),
          solved: solvedChallengeIds.has(challenge._id.toString())
        }));

        res.json(challengesWithProgress);
      } catch (err) {
        // If error retrieving user submissions, return challenges without solved status
        console.warn('Could not retrieve user submissions:', err.message);
        res.json(challenges);
      }
    } else {
      res.json(challenges);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // If user is authenticated, include solved status
    if (req.user && req.user.id) {
      try {
        const userSubmission = await require('../models/Submission').findOne({
          userId: req.user.id,
          challengeId: req.params.id,
          status: 'accepted'
        }).lean();

        challenge.solved = !!userSubmission;
      } catch (err) {
        // If error retrieving user submission, don't set solved status
        console.warn('Could not retrieve user submission:', err.message);
      }
    }

    res.json(challenge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    res.json(challenge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    res.json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createChallenge,
  getChallenges,
  getChallengeById,
  updateChallenge,
  deleteChallenge
};
