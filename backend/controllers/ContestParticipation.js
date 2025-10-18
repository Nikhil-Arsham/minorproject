const ContestParticipation = require("../models/ContestParticipation");
const User = require("../models/User");

const getUserContestParticipation = async (req, res) => {
  try {
    const { contestId } = req.params;
    
    const participation = await ContestParticipation.findOne({
      userId: req.user.id,
      contestId
    }).populate('solvedProblems', 'title points difficulty');
    
    if (!participation) {
      // Return empty participation if user hasn't started yet
      return res.status(200).json({
        userId: req.user.id,
        contestId,
        totalScore: 0,
        solvedProblems: [],
        problemScores: []
      });
    }
    
    res.status(200).json(participation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getContestLeaderboard = async (req, res) => {
  try {
    const { contestId } = req.params;
    const { limit = 10, page = 1 } = req.query;
    
    const leaderboard = await ContestParticipation.find({ contestId })
      .populate('userId', 'username profile')
      .sort({ totalScore: -1, updatedAt: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await ContestParticipation.countDocuments({ contestId });
    
    res.status(200).json({
      leaderboard: leaderboard.map((entry, index) => ({
        rank: (page - 1) * limit + index + 1,
        username: entry.userId.username,
        avatar: entry.userId.profile?.avatar,
        totalScore: entry.totalScore,
        solvedProblems: entry.solvedProblems.length,
        updatedAt: entry.updatedAt
      })),
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUserContestParticipation,
  getContestLeaderboard
};